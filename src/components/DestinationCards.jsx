import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import AuthModal from './AuthModal';

export default function DestinationCards({ lang = 'en', isDarkMode = false }) {
  const { studentProfile, updateProfile } = useStudent();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isRtl = lang === 'ar';

  const translations = {
    en: {
      sectionTitle: "Select Your European Route",
      sectionDesc: "Explore structured pathways specifically optimized for major European university centers.",
      active: "Active",
      viewBlueprint: "View Full Blueprint",
      unlockRequirements: "Unlock Requirements",
      destinations: [
        { id: 'Italy', title: 'Study in Italy', tagline: 'Universitaly Portal & DOV Pathway', tuition: '€500 - €3,000 / year', requirements: ['Pre-enrolment via Universitaly', 'CIMEA Statement or DOV', 'Language certification Proof'] },
        { id: 'Poland', title: 'Study in Poland', tagline: 'Affordable English-Taught Degrees', tuition: '€2,000 - €4,000 / year', requirements: ['High School Diploma Legalization', 'Embassy D-Type Appointment booking', 'Bank Statement Balance'] },
        { id: 'Other Europe', title: 'Other European Hubs', tagline: 'Schengen Student Gateway', tuition: 'Varies by destination', requirements: ['Valid Academic Transcripts', 'Schengen Area Proof of funds', 'Accommodation coverage verification'] }
      ]
    },
    ar: {
      sectionTitle: "اختر وجهتك الأوروبية",
      sectionDesc: "استكشف المسارات المنظمة المحسّنة خصيصاً للمراكز الجامعية الأوروبية الكبرى.",
      active: "نشط",
      viewBlueprint: "عرض المخطط الكامل",
      unlockRequirements: "فتح المتطلبات",
      destinations: [
        { id: 'Italy', title: 'الدراسة في إيطاليا', tagline: 'بوابة Universitaly ومسار DOV', tuition: '€500 - €3,000 / سنة', requirements: ['التسجيل المسبق عبر Universitaly', 'بيان CIMEA أو DOV', 'إثبات شهادة اللغة'] },
        { id: 'Poland', title: 'الدراسة في بولندا', tagline: 'درجات ميسورة باللغة الإنجليزية', tuition: '€2,000 - €4,000 / سنة', requirements: ['ت Legalization شهادة الثانوية', 'حجز موعد سفارة النوع D', 'رصيد كشف الحساب'] },
        { id: 'Other Europe', title: 'مراكز أوروبية أخرى', tagline: 'بوابة طالب شنغن', tuition: 'تختلف حسب الوجهة', requirements: ['كشوف أكاديمية سارية', 'إثبات موارد منطقة شنغن', 'التحقق من تغطية السكن'] }
      ]
    }
  };

  const t = translations[lang] || translations.en;
  const destinations = t.destinations;

  const handleSelectCard = (id) => {
    updateProfile({ selectedDestination: id });
    if (!studentProfile.isLoggedIn) setIsModalOpen(true);
  };

  return (
    <section dir={isRtl ? 'rtl' : 'ltr'} className={`py-12 transition-colors duration-300 ${isDarkMode ? 'bg-[#0b1120]' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.sectionTitle}</h2>
          <p className={`text-sm max-w-md mx-auto mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.sectionDesc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div key={dest.id} className="group relative">
              <div className="absolute -inset-[1px] bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl opacity-0 group-hover:opacity-70 blur-[2px] transition-opacity duration-500" />
              <div
                onClick={() => handleSelectCard(dest.id)}
                className={`relative overflow-hidden rounded-2xl border p-6 transition-all duration-500 cursor-pointer h-full flex flex-col ${studentProfile.selectedDestination === dest.id ? 'border-red-500 bg-red-500/[0.03] shadow-md shadow-red-500/5 ring-1 ring-red-500/20' : isDarkMode ? 'border-slate-800/60 bg-slate-900/40 hover:border-red-500/30 hover:bg-slate-900/60' : 'border-slate-200/60 bg-white hover:border-red-200 hover:shadow-xl'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className={`text-xl font-bold tracking-tight group-hover:text-red-600 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{dest.title}</h3>
                  <span className={`text-[10px] uppercase font-black tracking-widest text-red-600 px-2.5 py-1 rounded-md ${isDarkMode ? 'bg-red-500/10' : 'bg-red-50'}`}>{t.active}</span>
                </div>
                <p className={`text-xs font-semibold mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>{dest.tagline}</p>
                <div className={`mb-4 p-3 rounded-xl border ${isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                  <span className={`text-[11px] block font-bold uppercase tracking-wide ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{lang === 'ar' ? 'الرسوم الدراسية' : 'Average Fees'}</span>
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>{dest.tuition}</span>
                </div>
                <ul className="space-y-2 mt-auto">
                  {dest.requirements.map((req, i) => (
                    <li key={i} className={`text-xs flex items-center gap-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" /><span>{req}</span>
                    </li>
                  ))}
                </ul>
                <div className={`mt-6 pt-4 border-t flex items-center justify-between text-xs font-bold text-red-600 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                  <span>{studentProfile.isLoggedIn ? t.viewBlueprint : t.unlockRequirements}</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">{isRtl ? '←' : '→'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} lang={lang} isDarkMode={isDarkMode} />
    </section>
  );
}