// src/components/AuthPortal.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export default function AuthPortal({ selectedDest, onAuthSuccess, onClose, lang = 'en', isDarkMode = false }) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);
  const isRtl = lang === 'ar';

  const translations = {
    en: {
      signUpTitle: (dest) => `Target Gateway: ${dest}`,
      signInTitle: "Access Your File",
      signUpDesc: "Create your file profile parameters to initiate the interactive assessment formula.",
      signInDesc: "Enter your credentials to load your calculation matrix & review queue.",
      fullName: "Full Name",
      fullNamePlaceholder: "e.g., Mohamed Amine",
      email: "Email Address",
      emailPlaceholder: "name@domain.com",
      phone: "Phone Number",
      phonePlaceholder: "e.g., 0555XX2389",
      submitSignUp: "Generate File & See Success %",
      submitSignIn: "Load Profile File",
      processing: "Processing Ledger...",
      toggleSignIn: "Already have a structural file tracking layout? Sign In",
      toggleSignUp: "Need to initiate a new European destination route? Sign Up",
      cancel: "Cancel and return to dashboard",
      required: "Required",
      invalidEmail: "Invalid email format",
      duplicateEmail: "This email profile is already registered in our agency queue.",
      notFound: "No student entry matching that email address was discovered.",
      success: (id) => `Registration successful! Your custom File tracking code is: ${id}\nPlease keep this code safe to check your file status.`,
    },
    ar: {
      signUpTitle: (dest) => `بوابة الوجهة: ${dest}`,
      signInTitle: "الوصول إلى ملفك",
      signUpDesc: "أنشئ معلمات ملفك الشخصي لبدء صيغة التقييم التفاعلية.",
      signInDesc: "أدخل بيانات الاعتماد الخاصة بك لتحميل مصفوفة الحسابات وقائمة المراجعة.",
      fullName: "الاسم الكامل",
      fullNamePlaceholder: "مثال: محمد أمين",
      email: "عنوان البريد الإلكتروني",
      emailPlaceholder: "name@domain.com",
      phone: "رقم الهاتف",
      phonePlaceholder: "مثال: 0555XX2389",
      submitSignUp: "إنشاء الملف وعرض نسبة النجاح",
      submitSignIn: "تحميل الملف الشخصي",
      processing: "جاري معالجة السجل...",
      toggleSignIn: "لديك بالفعل ملف تتبع مسجل؟ تسجيل الدخول",
      toggleSignUp: "هل تحتاج إلى بدء مسار وجهة أوروبية جديد؟ إنشاء حساب",
      cancel: "إلغاء والعودة للوحة التحكم",
      required: "مطلوب",
      invalidEmail: "تنسيق البريد الإلكتروني غير صالح",
      duplicateEmail: "هذا البريد الإلكتروني مسجل بالفعل في قائمة الوكالة.",
      notFound: "لم يتم العثور على ملف طالب مطابق لعنوان البريد الإلكتروني.",
      success: (id) => `تم التسجيل بنجاح! رمز تتبع ملفك المخصص هو: ${id}\nيرجى الاحتفاظ بهذا الرمز بأمان للتحقق من حالة ملفك.`,
    }
  };

  const t = translations[lang] || translations.en;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEscape);
    setTimeout(() => modalRef.current?.querySelector('input')?.focus(), 50);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  const validate = () => {
    const newErrors = {};
    if (isSignUp && !fullName.trim()) newErrors.fullName = t.required;
    if (!email.trim()) newErrors.email = t.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = t.invalidEmail;
    if (isSignUp && !phone.trim()) newErrors.phone = t.required;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateCleanTrackingId = () => {
    const validChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let randomString = '';
    for (let i = 0; i < 5; i++) randomString += validChars.charAt(Math.floor(Math.random() * validChars.length));
    return `ASIR-${randomString}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      if (isSignUp) {
        const uniqueTrackingId = generateCleanTrackingId();
        const { data, error } = await supabase.from('student_profiles').insert([{
          full_name: fullName, email: email.trim().toLowerCase(), phone: phone.trim(),
          chosen_destination: selectedDest, file_tracking_id: uniqueTrackingId,
          agency_contract_status: 'Not Signed', pre_evaluation_paid: false
        }]).select();
        if (error) {
          if (error.code === '23505') throw new Error(t.duplicateEmail);
          throw error;
        }
        alert(t.success(uniqueTrackingId));
        onAuthSuccess(data[0]);
      } else {
        const { data, error } = await supabase.from('student_profiles').select('*').eq('email', email.trim().toLowerCase()).single();
        if (error || !data) throw new Error(t.notFound);
        onAuthSuccess(data);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-slate-950/60 transition-all duration-300" onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div ref={modalRef} className={`relative w-full max-w-md border shadow-2xl rounded-3xl p-8 overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/95 border-slate-200'}`}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 blur-xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-500/10 blur-xl pointer-events-none rounded-full" />

        <div className="text-center mb-6">
          <h3 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{isSignUp ? t.signUpTitle(selectedDest) : t.signInTitle}</h3>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{isSignUp ? t.signUpDesc : t.signInDesc}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.fullName}</label>
              <input type="text" placeholder={t.fullNamePlaceholder} className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all ${errors.fullName ? 'border-red-500 focus:ring-2 focus:ring-red-500' : isDarkMode ? 'border-slate-800 bg-slate-950/50 focus:border-red-500/50 text-white placeholder-slate-600' : 'border-slate-200 bg-slate-50 focus:border-red-500 text-slate-800 placeholder-slate-400'}`} value={fullName} onChange={(e) => { setFullName(e.target.value); if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined })); }} />
              {errors.fullName && <p className="text-[10px] text-red-500 mt-1">{errors.fullName}</p>}
            </div>
          )}
          <div>
            <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.email}</label>
            <input type="email" placeholder={t.emailPlaceholder} className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all ${errors.email ? 'border-red-500 focus:ring-2 focus:ring-red-500' : isDarkMode ? 'border-slate-800 bg-slate-950/50 focus:border-red-500/50 text-white placeholder-slate-600' : 'border-slate-200 bg-slate-50 focus:border-red-500 text-slate-800 placeholder-slate-400'}`} value={email} onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(prev => ({ ...prev, email: undefined })); }} />
            {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email}</p>}
          </div>
          {isSignUp && (
            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.phone}</label>
              <input type="tel" placeholder={t.phonePlaceholder} className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all ${errors.phone ? 'border-red-500 focus:ring-2 focus:ring-red-500' : isDarkMode ? 'border-slate-800 bg-slate-950/50 focus:border-red-500/50 text-white placeholder-slate-600' : 'border-slate-200 bg-slate-50 focus:border-red-500 text-slate-800 placeholder-slate-400'}`} value={phone} onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined })); }} />
              {errors.phone && <p className="text-[10px] text-red-500 mt-1">{errors.phone}</p>}
            </div>
          )}
          <button type="submit" disabled={isLoading} className="w-full mt-2 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-900/10 transition-all disabled:opacity-50 cursor-pointer active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {t.processing}
              </span>
            ) : isSignUp ? t.submitSignUp : t.submitSignIn}
          </button>
        </form>

        <div className="mt-6 text-center border-t pt-4 transition-colors border-slate-800/60">
          <button type="button" onClick={() => { setIsSignUp(!isSignUp); setErrors({}); }} className="text-xs text-red-400 hover:text-red-300 transition-colors bg-transparent border-none cursor-pointer font-medium">
            {isSignUp ? t.toggleSignIn : t.toggleSignUp}
          </button>
        </div>
        <button type="button" onClick={onClose} className={`w-full text-center text-xs mt-4 block bg-transparent border-none cursor-pointer transition-colors ${isDarkMode ? 'text-slate-500 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'}`}>
          {t.cancel}
        </button>
      </div>
    </div>
  );
}