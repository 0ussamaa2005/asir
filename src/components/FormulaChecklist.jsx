// src/components/FormulaChecklist.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function FormulaChecklist({ studentProfile, onNavigateToPayment, lang = 'en', isDarkMode = false }) {
  const [docs, setDocs] = useState({
    has_diploma: studentProfile.has_diploma || false,
    has_transcripts: studentProfile.has_transcripts || false,
    has_language_proof: studentProfile.has_language_proof || false,
    has_valid_passport: studentProfile.has_valid_passport || false,
    has_bank_statement: studentProfile.has_bank_statement || false,
    has_legalized_docs: studentProfile.has_legalized_docs || false,
  });
  const [rates, setRates] = useState({ acceptance: 0, visa: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const isRtl = lang === 'ar';

  useEffect(() => {
    let acceptanceScore = 0, visaScore = 0;
    if (docs.has_diploma) acceptanceScore += 40;
    if (docs.has_transcripts) acceptanceScore += 30;
    if (docs.has_language_proof) acceptanceScore += 30;
    if (docs.has_valid_passport) visaScore += 20;
    if (docs.has_bank_statement) visaScore += 50;
    if (docs.has_legalized_docs) visaScore += 30;
    setRates({ acceptance: acceptanceScore, visa: visaScore });
  }, [docs]);

  const handleToggle = (key) => setDocs(prev => ({ ...prev, [key]: !prev[key] }));

  const saveProfileMetrics = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('student_profiles').update({ ...docs, acceptance_rate: rates.acceptance, visa_rate: rates.visa }).eq('id', studentProfile.id);
      if (error) throw error;
      onNavigateToPayment();
    } catch (err) {
      alert((lang === 'ar' ? "خطأ في حفظ المؤشرات: " : "Error logging metrics: ") + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const translations = {
    en: {
      workspace: "Student Workspace",
      target: "Target Route",
      formula: "Interactive Profile Formula",
      formulaDesc: "Select the administrative elements you currently possess to check your profile metrics:",
      scoreTitle: "Your Evaluation Score",
      acceptance: "University Acceptance Rate",
      visa: "Visa Approval Probability",
      feeTitle: "Agency Fee Structure",
      phase1: "Phase 1: Admissions Lock",
      phase1Price: "50,000 DA",
      refundable: "(100% Refundable)",
      phase1Desc: "Fully refunded if zero university acceptances are issued.",
      phase2: "Phase 2: Visa Support",
      phase2Price: "50,000 DA",
      phase2Desc: "Collected upon confirmation to execute embassy filing.",
      submit: "Submit File & Pay 2000 DA",
      saving: "Saving Calculations...",
    },
    ar: {
      workspace: "مساحة عمل الطالب",
      target: "وجهة المسار",
      formula: "صيغة الملف التفاعلية",
      formulaDesc: "حدد العناصر الإدارية التي تملكها حالياً للتحقق من مؤشرات ملفك:",
      scoreTitle: "درجة التقييم الخاصة بك",
      acceptance: "نسبة قبول الجامعة",
      visa: "احتمالية الموافقة على التأشيرة",
      feeTitle: "هيكل رسوم الوكالة",
      phase1: "المرحلة 1: قفل القبول",
      phase1Price: "50,000 دج",
      refundable: "(قابلة للاسترداد 100%)",
      phase1Desc: "تسترد بالكامل إذا لم يتم إصدار أي قبول جامعي.",
      phase2: "المرحلة 2: دعم التأشيرة",
      phase2Price: "50,000 دج",
      phase2Desc: "يتم تحصيلها عند التأكيد لتنفيذ تقديم السفارة.",
      submit: "إرسال الملف ودفع 2000 دج",
      saving: "جاري حفظ الحسابات...",
    }
  };

  const t = translations[lang] || translations.en;

  const checklistItems = [
    { id: 'has_diploma', label: lang === 'ar' ? 'الشهادة النهائية / شهادة التخرج' : 'Final Diploma / Graduation Certificate', sub: lang === 'ar' ? 'تثبت إكمال المرحلة الدراسية الأساسية' : 'Proves academic baseline completion' },
    { id: 'has_transcripts', label: lang === 'ar' ? 'الكشوف الرسمية متعددة الفصول' : 'Official Multi-Semester Transcripts', sub: lang === 'ar' ? 'مطلوبة لمطابقة المنهج الجامعي' : 'Required for university syllabus matching' },
    { id: 'has_language_proof', label: lang === 'ar' ? 'إثبات الكفاءة اللغوية (IELTS / لغة التدريس)' : 'Language Competency Proof (IELTS / Medium of Instruction)', sub: lang === 'ar' ? 'يفتح الإعفاءات للبرامج باللغة الإنجليزية' : 'Unlocks English-taught exemptions' },
    { id: 'has_valid_passport', label: lang === 'ar' ? 'جواز سفر بيومتري ساري' : 'Valid Biometric Passport', sub: lang === 'ar' ? 'يجب أن يكون صالحاً لمدة 1-2 سنة على الأقل' : 'Must have at least 1-2 years remaining validity' },
    { id: 'has_bank_statement', label: lang === 'ar' ? 'كشف حساب بنكي متوافق مع شنغن' : 'Schengen-Compliant Financial Bank Statement', sub: lang === 'ar' ? 'يُظهر موارد الاكتفاء الذاتي' : 'Demonstrates self-sufficiency resources' },
    { id: 'has_legalized_docs', label: lang === 'ar' ? 'ملفات موثقة ومترجمة' : 'Legalized & Translated Files', sub: lang === 'ar' ? 'ترجمات معتمدة جاهزة للسفارة' : 'Embassy-ready certified translations' },
  ];

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className={`max-w-4xl mx-auto px-4 pt-24 pb-16 min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0b1120]' : 'bg-slate-50'}`}>
      <div className={`border rounded-2xl p-6 mb-8 backdrop-blur-md transition-colors ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.workspace}: {studentProfile.full_name}</h2>
        <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.target}: <span className="text-red-400 font-semibold">{studentProfile.chosen_destination}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h3 className={`text-lg font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.formula}</h3>
          <p className={`text-xs -mt-2 mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.formulaDesc}</p>
          <div className={`border rounded-2xl p-5 space-y-3 transition-colors ${isDarkMode ? 'bg-slate-900/20 border-slate-800/60' : 'bg-white border-slate-200'}`}>
            {checklistItems.map((item) => (
              <div key={item.id} onClick={() => handleToggle(item.id)} className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${docs[item.id] ? 'bg-red-500/5 border-red-500/50' : isDarkMode ? 'bg-slate-950/40 border-slate-800/60 hover:border-slate-700/60' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                <div>
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.label}</p>
                  <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{item.sub}</p>
                </div>
                <div className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all ${docs[item.id] ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20' : isDarkMode ? 'border-slate-600' : 'border-slate-300'}`}>
                  {docs[item.id] && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className={`text-lg font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.scoreTitle}</h3>
          <div className={`border rounded-2xl p-6 text-center space-y-6 shadow-xl transition-colors ${isDarkMode ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div>
              <span className={`text-[11px] font-bold uppercase tracking-wider block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.acceptance}</span>
              <div className={`text-3xl font-black mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{rates.acceptance}%</div>
              <div className={`w-full h-2 rounded-full mt-2 overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <div className="bg-gradient-to-r from-red-500 to-rose-500 h-full transition-all duration-500" style={{ width: `${rates.acceptance}%` }} />
              </div>
            </div>
            <div>
              <span className={`text-[11px] font-bold uppercase tracking-wider block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.visa}</span>
              <div className={`text-3xl font-black mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{rates.visa}%</div>
              <div className={`w-full h-2 rounded-full mt-2 overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <div className="bg-gradient-to-r from-rose-500 to-red-500 h-full transition-all duration-500" style={{ width: `${rates.visa}%` }} />
              </div>
            </div>

            <hr className={isDarkMode ? 'border-slate-800' : 'border-slate-200'} />

            <div className="text-left space-y-3">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.feeTitle}</h4>
              <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-slate-950/60 border-slate-900' : 'bg-slate-50 border-slate-200'}`}>
                <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.phase1}</p>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">{t.phase1Price} <span className={`font-normal text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.refundable}</span></p>
                <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.phase1Desc}</p>
              </div>
              <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-slate-950/60 border-slate-900' : 'bg-slate-50 border-slate-200'}`}>
                <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.phase2}</p>
                <p className={`text-sm font-bold mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.phase2Price}</p>
                <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.phase2Desc}</p>
              </div>
            </div>

            <button onClick={saveProfileMetrics} disabled={isSaving} className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs rounded-xl shadow-lg hover:from-red-700 transition-all uppercase tracking-wider block active:scale-[0.98] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
              {isSaving ? t.saving : t.submit}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}