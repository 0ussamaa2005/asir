import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStudent } from '../context/StudentContext';

export default function AuthModal({ isOpen, onClose, lang = 'en', isDarkMode = false }) {
  const { studentProfile, updateProfile } = useStudent();
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);
  const isRtl = lang === 'ar';

  const translations = {
    en: {
      title: (dest) => `Interested in ${dest}?`,
      subtitle: "Create your Asir Visa profile to check tuition parameters and alert the consultancy office.",
      fullName: "Full Name",
      fullNamePlaceholder: "e.g., Mohamed Amine",
      email: "Email Address",
      emailPlaceholder: "amine@example.com",
      phone: "Phone Number",
      phonePlaceholder: "0555 XX XX XX",
      submit: "Create Account & Get Information",
      cancel: "Cancel and browse back",
      required: "This field is required",
      invalidEmail: "Please enter a valid email",
    },
    ar: {
      title: (dest) => `هل أنت مهتم بـ ${dest}؟`,
      subtitle: "أنشئ ملفك الشخصي في أسير فيزا للتحقق من معلمات الرسوم الدراسية وتنبيه مكتب الاستشارات.",
      fullName: "الاسم الكامل",
      fullNamePlaceholder: "مثال: محمد أمين",
      email: "عنوان البريد الإلكتروني",
      emailPlaceholder: "amine@example.com",
      phone: "رقم الهاتف",
      phonePlaceholder: "0555 XX XX XX",
      submit: "إنشاء حساب والحصول على المعلومات",
      cancel: "إلغاء والعودة للتصفح",
      required: "هذا الحقل مطلوب",
      invalidEmail: "يرجى إدخال بريد إلكتروني صالح",
    }
  };

  const t = translations[lang] || translations.en;

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEscape);
    setTimeout(() => modalRef.current?.querySelector('input')?.focus(), 50);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = t.required;
    if (!formData.email.trim()) newErrors.email = t.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t.invalidEmail;
    if (!formData.phone.trim()) newErrors.phone = t.required;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    updateProfile({ isLoggedIn: true, user: formData });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-slate-950/60 transition-all duration-300"
      onClick={handleBackdropClick}
      role="dialog" aria-modal="true"
    >
      <div 
        ref={modalRef}
        className={`relative w-full max-w-md border shadow-2xl rounded-3xl p-8 overflow-hidden transition-colors duration-300 ${
          isDarkMode ? 'bg-slate-900/90 border-slate-800/80' : 'bg-white/95 border-white/40'
        }`}
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-6 relative z-10">
          <h3 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {t.title(studentProfile.selectedDestination)} 
          </h3>
          <p className={`text-sm mt-1.5 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {['fullName', 'email', 'phone'].map((field) => (
            <div key={field}>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                {t[field]}
              </label>
              <input
                type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                placeholder={t[`${field}Placeholder`]}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm ${
                  errors[field] 
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                    : isDarkMode 
                      ? 'border-slate-800 bg-slate-950/50 focus:border-red-500/50 text-white placeholder-slate-600' 
                      : 'border-slate-200/80 bg-white/70 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-slate-800 placeholder-slate-400'
                }`}
                value={formData[field]}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, [field]: e.target.value }));
                  if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
                }}
              />
              {errors[field] && <p className="text-[10px] text-red-500 mt-1 font-medium">{errors[field]}</p>}
            </div>
          ))}

          <button
            type="submit"
            className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-600/20 active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {t.submit}
          </button>
        </form>

        <button 
          onClick={onClose}
          className={`w-full text-center text-xs mt-4 font-medium block transition-colors ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
        >
          {t.cancel}
        </button>
      </div>
    </div>
  );
}