// src/components/LandingPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';

// Add animation styles
const animationStyles = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-in {
    animation: slideUp 0.6s ease-out forwards;
  }
  
  .fade-in {
    animation-name: fadeIn;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .slide-up {
    animation-name: slideUp;
  }
`;

const specializedCountries = [
  'Hungary', 'Germany', 'France', 'Spain', 'Belgium', 'Austria', 
  'Netherlands', 'Sweden', 'Denmark', 'Finland', 'Portugal', 
  'Czech Republic', 'Greece', 'Ireland', 'Switzerland', 'Norway', 
  'Luxembourg', 'Slovakia', 'Slovenia', 'Croatia'
];

const getStatsData = (lang) => [
  { value: 340, suffix: '+', label: lang === 'ar' ? 'طالب تم قبوله' : 'Students Placed', percentage: 100 },
  { value: 98, suffix: '%', label: lang === 'ar' ? 'نسبة قبول التأشيرة' : 'Visa Approval Rate', percentage: 98 },
  { value: 15, suffix: '+', label: lang === 'ar' ? 'جامعة شريكة' : 'Partner Universities', percentage: 95 },
  { value: 10, suffix: '', label: lang === 'ar' ?  'سنوات خبرة' : 'Years of Experience', percentage: 95 },
];

const getTestimonials = () => [
  {
    name: 'Amira K.',
    story: 'Got accepted to Sapienza in 6 weeks. The process was seamless!',
    country: 'Italy',
    icon: (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-400 text-white flex items-center justify-center shadow-lg shadow-red-500/20">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M8 17l4-2 4 2" />
          <path d="M9 7v5" />
          <path d="M15 7v5" />
        </svg>
      </div>
    ),
  },
  {
    name: 'Hassan M.',
    story: 'Secured NAWA certification for Poland. Best decision ever!',
    country: 'Poland',
    icon: (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-400 text-white flex items-center justify-center shadow-lg shadow-red-500/20">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>
    ),
  },
  {
    name: 'Zainab L.',
    story: 'Visa approved with scholarship offer. Thank you Asir Visa!',
    country: 'Germany',
    icon: (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-400 text-white flex items-center justify-center shadow-lg shadow-red-500/20">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 16.5l7-7 7 7" />
          <path d="M12 3v10.5" />
          <path d="M7.5 21h9" />
        </svg>
      </div>
    ),
  },
];

const getFeaturedUnis = () => ['🇮🇹 Sapienza', '🇵🇱 Warsaw', '🇮🇹 Politecnico', '🇵🇱 AGH', '🇩🇪 TU Berlin', '🇫🇷 Sorbonne', '🇪🇸 UNED', '🇳🇱 Amsterdam'];

const getProcessSteps = (t) => [
  {
    step: '1',
    title: t.step1,
    desc: t.step1Desc,
    icon: (
      <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-red-500 to-rose-400 text-white flex items-center justify-center shadow-lg shadow-red-500/20 mb-3">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="7" y="4" width="10" height="16" rx="2" />
          <path d="M9 4V2h6v2" />
          <path d="M9 10h6" />
        </svg>
      </div>
    ),
  },
  {
    step: '2',
    title: t.step2,
    desc: t.step2Desc,
    icon: (
      <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-red-500 to-rose-400 text-white flex items-center justify-center shadow-lg shadow-red-500/20 mb-3">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ),
  },
  {
    step: '3',
    title: t.step3,
    desc: t.step3Desc,
    icon: (
      <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-red-500 to-rose-400 text-white flex items-center justify-center shadow-lg shadow-red-500/20 mb-3">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82L4.21 4.21a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </div>
    ),
  },
  {
    step: '4',
    title: t.step4,
    desc: t.step4Desc,
    icon: (
      <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-red-500 to-rose-400 text-white flex items-center justify-center shadow-lg shadow-red-500/20 mb-3">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 15l5-5 5 5" />
          <path d="M12 3v12" />
        </svg>
      </div>
    ),
  },
];

export default function LandingPage({ onSelectRoute, activeUser, onViewDashboard, onTrack, lang, isDarkMode }) {
  const [showSelector, setShowSelector] = useState(false);
  const [countryFilter, setCountryFilter] = useState('');
  const [heroTrackId, setHeroTrackId] = useState('');
  const [animatingIndices, setAnimatingIndices] = useState(new Set());
  const [showForgotIdModal, setShowForgotIdModal] = useState(false);
  const [forgotIdEmail, setForgotIdEmail] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const modalRef = useRef(null);
  const statsRef = useRef(null);


  const filteredCountries = specializedCountries.filter((c) =>
    c.toLowerCase().includes(countryFilter.toLowerCase())
  );

  // Close modal on Escape key and lock body scroll
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setShowSelector(false);
    };
    if (showSelector) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      // Focus first focusable element for accessibility
      const firstBtn = modalRef.current?.querySelector('button, input');
      firstBtn?.focus();
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [showSelector]);

  // Intersection Observer for scroll animations and progress counting
  const stats = getStatsData(lang);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'stats-section') {
            // Animate progress circles when stats come into view
            stats.forEach((_, idx) => {
              setTimeout(() => {
                setAnimatingIndices((prev) => new Set(prev).add(idx));
              }, idx * 100);
            });
          } else {
            // Add animation class to other sections
            entry.target.classList.add('animate-in', 'fade-in', 'slide-up');
          }
        }
      });
    }, { threshold: 0.1 });

    // Observe all data-animate elements
    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) setShowSelector(false);
  };

  const translations = {
    en: {
      badge: "European Educational Consultant",
      heroTitle1: "Shine Globally With Asir Visa:",
      heroTitle2: "Your Pathway to Study in Europe",
      heroDesc: "Specialized admission routes, document processing metrics, and visa logistics for Italy, Poland, and leading European university networks.",
      applyNowBtn: "Apply Now",
      btnTrack: "Track",
      dashboardBtn: "➔ Open Your Active Assessment Dashboard",
      sectionTitle: "Select Your European Route",
      italyRoute: "Universitaly Route",
      italyTitle: "Study in Italy",
      italyDesc: "Access prestigious public enrollment systems and native regional scholarship setups.",
      polandRoute: "Schengen Gateway",
      polandTitle: "Study in Poland",
      polandDesc: "High-ranking polytechnics offering globally recognized technical degrees in English.",
      otherRoute: "Custom Programs",
      otherTitle: "Other European Hubs",
      otherDesc: "Tailored logistics processing for France, Germany, Hungary, and matching options.",
      exploreBtn: "Explore Requirements →",
      specifyBtn: "Specify Country →",
      modalTitle: "Select Your Target European Nation",
      modalDesc: "Choose from our secondary supported consulting lanes:",
      modalBack: "Go Back",
      searchPlaceholder: "Search country...",
      noResults: "No countries found",
      testimonials: "Student Success Stories",
      process: "Your Application Journey",
      step1: "Application",
      step1Desc: "Submit your profile",
      step2: "Review",
      step2Desc: "Document check",
      step3: "Processing",
      step3Desc: "Visa preparation",
      step4: "Approval",
      step4Desc: "Begin your studies",
      forgotId: "Forgot my ID?",
      forgotIdPrompt: "Please enter your email to retrieve your File ID:",
      emailPlaceholder: "Enter your email address",
      trackPlaceholder: "Enter File ID or Key Code",
      trackHelp: "Paste your student tracking ID to check your file status instantly.",
      faqTitle: "Frequently Asked Questions",
      faq1Q: "What documents do I need to apply?",
      faq1A: "You'll need a passport, academic transcripts, language proficiency proof (IELTS/TOEFL), and a bank statement. Poland also requires NAWA certification for academic recognition.",
      faq2Q: "How long does the visa process take?",
      faq2A: "Typically 4-8 weeks depending on the destination and document completeness. We expedite processing with our partner universities.",
      faq3Q: "What's the cost of applying?",
      faq3A: "Our consultation is free. Tuition ranges: Italy €500-€3,000/year, Poland €2,000-€4,000/year. Living costs vary by city.",
      faq4Q: "Can you help with scholarship opportunities?",
      faq4A: "Yes! We have access to scholarship databases and can guide you through merit-based and need-based funding options.",
      featured: "Featured Universities & Partners",
      whatsappCta: "Need Help? Chat with us on WhatsApp",
    },
    ar: {
      badge: "مستشار التعليم الأوروبي",
      heroTitle1: "تألق عالميًا مع أسير فيزا:",
      heroTitle2: "طريقك للدراسة في أوروبا",
      heroDesc: "مسارات قبول متخصصة، مقاييس معالجة المستندات، ولوجستيات التأشيرات لإيطاليا وبولندا وشبكات الجامعات الأوروبية الرائدة.",
      applyNowBtn: "قدِّم الآن",
      btnTrack: "تتبع",
      dashboardBtn: "➔ افتح لوحة تقييم ملفك النشطة",
      sectionTitle: "اختر وجهتك الأوروبية",
      italyRoute: "مسار Universitaly",
      italyTitle: "الدراسة في إيطاليا",
      italyDesc: "الوصول إلى أنظمة التسجيل العامة المرموقة وبرامج المنح الدراسية الإقليمية.",
      polandRoute: "بوابة الشنغن",
      polandTitle: "الدراسة في بولندا",
      polandDesc: "جامعات تقنية رفيعة المستوى تقدم درجات علمية معترف بها عالميًا باللغة الإنجليزية.",
      otherRoute: "برامج مخصصة",
      otherTitle: "مراكز أوروبية أخرى",
      otherDesc: "معالجة لوجستية مخصصة لفرنسا وألمانيا والمجر والخيارات المتوافقة الأخرى.",
      exploreBtn: "استكشاف الشروط →",
      specifyBtn: "تحديد الدولة →",
      modalTitle: "اختر دولتك الأوروبية المستهدفة",
      modalDesc: "اختر من بين مسارات الاستشارات الثانوية المدعومة لدينا:",
      modalBack: "العودة للخلف",
      searchPlaceholder: "ابحث عن دولة...",
      noResults: "لم يتم العثور على نتائج",
      testimonials: "قصص نجاح الطلاب",
      process: "رحلة طلبك",
      step1: "التقديم",
      step1Desc: "إرسال ملفك",
      step2: "المراجعة",
      step2Desc: "فحص المستندات",
      step3: "المعالجة",
      step3Desc: "تحضير التأشيرة",
      step4: "الموافقة",
      step4Desc: "ابدأ دراستك",
      forgotId: "هل نسيت رمز الملف؟",
      forgotIdPrompt: "الرجاء إدخال بريدك الإلكتروني لاسترداد رمز الملف الخاص بك:",
      emailPlaceholder: "أدخل عنوان بريدك الإلكتروني",
      trackPlaceholder: "أدخل رقم الملف أو رمز الدخول",
      trackHelp: "ألصق رمز تتبع الطالب للتحقق من حالة الملف فورًا.",
      faqTitle: "أسئلة شائعة",
      faq1Q: "ما المستندات المطلوبة للتقديم؟",
      faq1A: "ستحتاج جواز سفر وشهادة أكاديمية وإثبات كفاءة لغة (IELTS/TOEFL) وكشف حسابي بنكي. بولندا تتطلب شهادة NAWA.",
      faq2Q: "كم مدة عملية التأشيرة؟",
      faq2A: "عادة 4-8 أسابيع حسب الوجهة واكتمال المستندات. نسرع المعالجة مع جامعاتنا الشريكة.",
      faq3Q: "ما تكلفة التقديم؟",
      faq3A: "استشارتنا مجانية. الرسوم: إيطاليا €500-€3,000/سنة، بولندا €2,000-€4,000/سنة.",
      faq4Q: "هل يمكنك مساعدتي في المنح الدراسية؟",
      faq4A: "نعم! لدينا وصول لقواعد بيانات المنح ويمكننا إرشادك نحو خيارات التمويل المختلفة.",
      featured: "الجامعات والشركاء المميزون",
      whatsappCta: "هل تحتاج إلى مساعدة؟ تحدث معنا على WhatsApp",
    },
  };

  const t = translations[lang] || translations['en'];
  const isRtl = lang === 'ar';

  const handleHeroTrack = async (e) => {
    e.preventDefault();
    if (!heroTrackId.trim()) return;
    await onTrack(heroTrackId.trim());
  };

  const handleForgotPassword = async () => {
    let emailToUse = heroTrackId.trim();
    if (!emailToUse.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      // If current input is not an email, open modal to ask for email
      setShowForgotIdModal(true);
      return;
    }

    // If it looks like an email, use it directly
    await retrieveAndEmailId(emailToUse);
  };

  const retrieveAndEmailId = async (email) => {
    const { data, error } = await supabase
      .from('student_profiles')
      .select('file_tracking_id')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

      if (error) {
        alert(lang === 'ar' ? "خطأ في الاتصال بالنظام." : "System connection error.");
        return;
      }

      if (!data) {
        alert(lang === 'ar' ? "لم يتم العثور على بريد إلكتروني مسجل." : "No registered email found.");
      } else {
        alert(`${lang === 'ar' ? "تم استرداد رمز الملف الخاص بك: " : "Your File ID has been retrieved: "}${data.file_tracking_id}`);
        setShowForgotIdModal(false);
      }
  };

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'} 
      className={`relative min-h-screen flex flex-col overflow-x-hidden transition-colors duration-500 ${
        isDarkMode ? 'bg-[#0b1120]' : 'bg-slate-50'
      }`}
    >
      {/* Inject animation styles */}
      <style>{animationStyles}</style>

      {/* Ambient Background Glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[110%] max-w-none h-[740px] bg-gradient-to-b from-red-500/24 via-rose-500/14 to-transparent blur-[130px] opacity-90 pointer-events-none z-0" />
      <div className="absolute top-14 left-1/2 -translate-x-1/2 w-[78%] max-w-none h-[380px] bg-[radial-gradient(circle_at_top,_rgba(244,63,94,0.26),_rgba(251,146,60,0.08)_40%,_transparent_85%)] blur-[110px] opacity-88 pointer-events-none z-0" />
      
      {/* Subtle Dot Pattern Overlay */}
      <div 
        className={`absolute inset-0 pointer-events-none z-0 bg-[length:24px_24px] opacity-[0.025] ${
          isDarkMode 
            ? 'bg-[radial-gradient(circle,_#ffffff_1px,_transparent_1px)]' 
            : 'bg-[radial-gradient(circle,_#000000_1px,_transparent_1px)]'
        }`} 
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10 w-full flex-grow">
        
        {/* Hero Section */}
        <div className="text-center max-w-5xl mx-auto px-4">
          <div className="flex justify-center mb-6">
            <div className="w-full max-w-[720px] flex flex-col gap-3 sm:flex-row items-center">
              <form onSubmit={handleHeroTrack} className="flex-1 w-full flex gap-3">
                <input
                  type="text"
                  value={heroTrackId}
                  onChange={(e) => setHeroTrackId(e.target.value)}
                  placeholder={t.trackPlaceholder}
                  className={`flex-1 rounded-[28px] border px-5 py-3 text-sm sm:text-base outline-none transition-colors ${
                    isDarkMode
                      ? 'bg-slate-950/80 border-slate-800 text-white placeholder-slate-500'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500'
                  }`}
                />
                <button
                  type="submit"
                  className="w-auto rounded-[28px] bg-gradient-to-r from-red-500 to-rose-500 px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-2xl shadow-red-500/20 transition hover:brightness-105"
                >
                  {t.btnTrack}
                </button>
              </form>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 mt-4 mb-12">
            <p className={`text-center text-xs sm:text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {t.trackHelp}
            </p>
            <button onClick={handleForgotPassword} className="text-xs font-bold text-red-500 hover:underline cursor-pointer">{t.forgotId}</button>
          </div>

          <span className={`inline-block px-4 py-1.5 rounded-full uppercase tracking-widest text-xs font-bold border mb-6 backdrop-blur-md transition-all duration-300 hover:scale-105 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-white/10 via-red-500/15 to-white/10 text-red-100 border-red-400/30 shadow-lg shadow-red-500/10' 
              : 'bg-white/80 text-red-600 border-red-200 shadow-sm'
          }`}>
            {t.badge}
          </span>
          
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6 uppercase transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            {t.heroTitle1} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-red-400">
              {t.heroTitle2}
            </span>
          </h1>

          <p className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-12 transition-colors duration-300 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {t.heroDesc}
          </p>

          {activeUser?.isLoggedIn && (
            <button 
              onClick={onViewDashboard}
              className="mb-12 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-[#0b1120]"
            >
              {t.dashboardBtn}
            </button>
          )}
        </div>

        {/* Section Title */}
        <div className="text-center mt-8 mb-12">
          <h2 className={`text-xl md:text-2xl font-bold tracking-tight uppercase transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            {t.sectionTitle}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-rose-400 mx-auto mt-3 rounded-full" />
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-2">
          
          {/* Italy Card */}
          <div className="group relative">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl opacity-0 group-hover:opacity-70 blur-[2px] transition-opacity duration-500" />
            <div 
              onClick={() => onSelectRoute('Italy')} 
              className={`relative h-72 rounded-2xl overflow-hidden border backdrop-blur-md cursor-pointer hover:border-red-500/40 shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col justify-end ${
                isDarkMode ? 'border-slate-800/40 bg-slate-900/20' : 'border-slate-200 bg-white/40'
              }`}
              role="link"
              tabIndex={0}
              aria-label="Study in Italy - View cost and details"
            >
              <img 
                src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80" 
                alt="Italy Landscape" 
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                  isDarkMode 
                    ? 'opacity-30 mix-blend-luminosity group-hover:opacity-50' 
                    : 'opacity-80 group-hover:opacity-100'
                }`}
              />
              {/* Cost Overlay */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm ${
                isDarkMode ? 'bg-slate-950/40' : 'bg-white/40'
              }`}>
                <div className="text-center">
                  <p className={`text-xs font-bold ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>Annual Costs</p>
                  <p className={`text-sm font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>€500 - €3,000</p>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Tuition</p>
                  <p className={`text-sm font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>€6,000 - €10,000</p>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Living Expenses</p>
                </div>
              </div>
              <div className={`relative z-10 p-6 bg-gradient-to-t pt-16 ${
                isDarkMode 
                  ? 'from-slate-950 via-slate-950/80 to-transparent' 
                  : 'from-white via-white/80 to-transparent'
              }`}>
                <span className="text-[10px] uppercase font-bold tracking-widest text-red-500">{t.italyRoute}</span>
                <h3 className={`text-xl font-bold mt-1 group-hover:text-red-500 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.italyTitle}</h3>
                <p className={`text-xs mt-1.5 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t.italyDesc}</p>
                <div className="mt-4 flex flex-col gap-3">
                  <div className={`text-xs font-bold inline-flex items-center gap-1 group-hover:underline ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.exploreBtn}</div>
                  <button
                    type="button"
                    onClick={() => onSelectRoute('Italy')}
                    className={`w-full rounded-2xl px-3 py-2 text-xs font-semibold transition-all duration-300 border backdrop-blur-sm ${
                      isDarkMode ? 'bg-white/10 border-white/15 text-white hover:bg-white/15' : 'bg-white/70 border-white/60 text-slate-900 hover:bg-white'
                    }`}
                  >
                    {t.applyNowBtn} Italy
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Poland Card */}
          <div className="group relative">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl opacity-0 group-hover:opacity-70 blur-[2px] transition-opacity duration-500" />
            <div 
              onClick={() => onSelectRoute('Poland')} 
              className={`relative h-72 rounded-2xl overflow-hidden border backdrop-blur-md cursor-pointer hover:border-red-500/40 shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col justify-end ${
                isDarkMode ? 'border-slate-800/40 bg-slate-900/20' : 'border-slate-200 bg-white/40'
              }`}
              role="link"
              tabIndex={0}
              aria-label="Study in Poland - View cost and details"
            >
              <img 
                src="https://images.unsplash.com/photo-1519197924294-4ba991a11128?q=80&w=1169&auto=format&fit=crop" 
                alt="Poland Architecture" 
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                  isDarkMode 
                    ? 'opacity-30 mix-blend-luminosity group-hover:opacity-50' 
                    : 'opacity-80 group-hover:opacity-100'
                }`}
              />
              {/* Cost Overlay */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm ${
                isDarkMode ? 'bg-slate-950/40' : 'bg-white/40'
              }`}>
                <div className="text-center">
                  <p className={`text-xs font-bold ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>Annual Costs</p>
                  <p className={`text-sm font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>€2,000 - €4,000</p>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Tuition</p>
                  <p className={`text-sm font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>€5,000 - €8,000</p>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Living Expenses</p>
                </div>
              </div>
              <div className={`relative z-10 p-6 bg-gradient-to-t pt-16 ${
                isDarkMode 
                  ? 'from-slate-950 via-slate-950/80 to-transparent' 
                  : 'from-white via-white/80 to-transparent'
              }`}>
                <span className="text-[10px] uppercase font-bold tracking-widest text-red-500">{t.polandRoute}</span>
                <h3 className={`text-xl font-bold mt-1 group-hover:text-red-500 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.polandTitle}</h3>
                <p className={`text-xs mt-1.5 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t.polandDesc}</p>
                <div className="mt-4 flex flex-col gap-3">
                  <div className={`text-xs font-bold inline-flex items-center gap-1 group-hover:underline ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.exploreBtn}</div>
                  <button
                    type="button"
                    onClick={() => onSelectRoute('Poland')}
                    className={`w-full rounded-2xl px-3 py-2 text-xs font-semibold transition-all duration-300 border backdrop-blur-sm ${
                      isDarkMode ? 'bg-white/10 border-white/15 text-white hover:bg-white/15' : 'bg-white/70 border-white/60 text-slate-900 hover:bg-white'
                    }`}
                  >
                    {t.applyNowBtn} Poland
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Other Destinations Card */}
          <div className="group relative">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl opacity-0 group-hover:opacity-70 blur-[2px] transition-opacity duration-500" />
            <div 
              onClick={() => setShowSelector(true)} 
              className={`relative h-72 rounded-2xl overflow-hidden border backdrop-blur-md cursor-pointer hover:border-red-500/40 shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col justify-end ${
                isDarkMode ? 'border-slate-800/40 bg-slate-900/20' : 'border-slate-200 bg-white/40'
              }`}
              role="link"
              tabIndex={0}
              aria-label="Explore other European countries"
              aria-expanded={showSelector}
              aria-haspopup="dialog"
            >
              <img 
                src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=600&q=80" 
                alt="Europe Hubs" 
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                  isDarkMode 
                    ? 'opacity-30 mix-blend-luminosity group-hover:opacity-50' 
                    : 'opacity-80 group-hover:opacity-100'
                }`}
              />
              <div className={`relative z-10 p-6 bg-gradient-to-t pt-16 ${
                isDarkMode 
                  ? 'from-slate-950 via-slate-950/80 to-transparent' 
                  : 'from-white via-white/80 to-transparent'
              }`}>
                <span className="text-[10px] uppercase font-bold tracking-widest text-red-500">{t.otherRoute}</span>
                <h3 className={`text-xl font-bold mt-1 group-hover:text-red-500 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.otherTitle}</h3>
                <p className={`text-xs mt-1.5 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t.otherDesc}</p>
                <div className={`mt-4 text-xs font-bold inline-flex items-center gap-1 group-hover:underline ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.specifyBtn}</div>
              </div>
            </div>
          </div>

        </div>

        {/* Featured Universities Section */}
        <div className="mt-20 mb-20" data-animate>
          <div className="text-center mb-12">
            <h2 className={`text-xl md:text-2xl font-bold tracking-tight uppercase transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.featured}</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-rose-400 mx-auto mt-3 rounded-full" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-5xl mx-auto px-2">
            {getFeaturedUnis().map((uni, idx) => (
              <div key={idx} className={`p-4 rounded-xl text-center border backdrop-blur-md transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
                isDarkMode ? 'bg-slate-900/40 border-slate-800/60 text-slate-300' : 'bg-white/50 border-slate-200 text-slate-600'
              }`}>
                <span className="text-2xl mb-2 block">{uni.split(' ')[0]}</span>
                <p className="text-xs font-semibold">{uni.split(' ').slice(1).join(' ')}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-20 mb-20" data-animate>
          <div className="text-center mb-12">
            <h2 className={`text-xl md:text-2xl font-bold tracking-tight uppercase transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.testimonials}</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-rose-400 mx-auto mt-3 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {getTestimonials().map((testimonial, idx) => (
              <div key={idx} className={`p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 hover:scale-105 group ${
                isDarkMode ? 'bg-slate-900/50 border-slate-800/60 hover:bg-slate-900/70' : 'bg-white/50 border-slate-200 hover:bg-white/70'
              }`}>
                <div className="flex items-center mb-3">
                  <div className="mr-3">{testimonial.icon}</div>
                  <div>
                    <p className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{testimonial.name}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{testimonial.country}</p>
                  </div>
                </div>
                <p className={`text-xs leading-relaxed italic ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>"{testimonial.story}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Process Timeline Section */}
        <div className="mt-20 mb-20" data-animate>
          <div className="text-center mb-12">
            <h2 className={`text-xl md:text-2xl font-bold tracking-tight uppercase transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.process}</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-rose-400 mx-auto mt-3 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {getProcessSteps(t).map((item, idx) => (
              <div key={idx} className="relative">
                <div className={`p-6 rounded-2xl text-center border backdrop-blur-md transition-all duration-300 hover:scale-105 ${
                  isDarkMode ? 'bg-slate-900/50 border-red-500/20' : 'bg-white/50 border-red-200/30'
                }`}>
                  {item.icon}
                  <div className={`text-2xl font-black mb-2 bg-gradient-to-r from-red-500 to-rose-400 bg-clip-text text-transparent`}>{item.step}</div>
                  <h3 className={`text-sm font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-0.5 bg-gradient-to-r from-red-500 to-rose-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 mb-20" data-animate>
          <div className="text-center mb-12">
            <h2 className={`text-xl md:text-2xl font-bold tracking-tight uppercase transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.faqTitle}</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-rose-400 mx-auto mt-3 rounded-full" />
          </div>
          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              { q: t.faq1Q, a: t.faq1A },
              { q: t.faq2Q, a: t.faq2A },
              { q: t.faq3Q, a: t.faq3A },
              { q: t.faq4Q, a: t.faq4A },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className={`w-full text-left p-4 rounded-xl border backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/40 hover:border-red-500/30 ${
                  isDarkMode ? 'bg-slate-900/50 border-slate-800/60 hover:bg-slate-900/70' : 'bg-white/50 border-slate-200 hover:bg-white/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.q}</p>
                  <span className={`text-xl transition-transform duration-300 ${expandedFaq === idx ? 'rotate-180' : ''}`}>▼</span>
                </div>
                {expandedFaq === idx && (
                  <p className={`mt-3 text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{item.a}</p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Section - Bottom */}
        <div className="mt-24 mb-12" id="stats-section" data-animate ref={statsRef}>
          <div className="text-center mb-12">
            <h2 className={`text-xl md:text-2xl font-bold tracking-tight uppercase transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Our Impact</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-rose-400 mx-auto mt-3 rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, idx) => {
              const percentage = stat.percentage || Math.min(stat.value, 100);
              const circumference = 2 * Math.PI * 45;
              const strokeDashoffset = circumference - (percentage / 100) * circumference;
              return (
                <div key={idx} className="flex justify-center">
                  <div className="group relative w-28 h-28 md:w-32 md:h-32 hover:scale-110 hover:-translate-y-3 transition-all duration-300 cursor-pointer">
                    {/* SVG Circular Progress */}
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      {/* Background Circle */}
                      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                      {/* Progress Circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#redGradient)"
                        strokeWidth="3"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                      {/* Gradient Definition */}
                      <defs>
                        <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="rgb(239, 68, 68)" />
                          <stop offset="100%" stopColor="rgb(244, 63, 94)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    {/* Text Center */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-center">
                        <div className={`text-xl md:text-2xl font-black transition-all ${
                          isDarkMode 
                            ? 'text-white drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] group-hover:drop-shadow-[0_0_12px_rgba(239,68,68,1)]' 
                            : 'text-red-600 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] group-hover:drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]'
                        }`}>
                          {stat.value}{stat.suffix}
                        </div>
                        <div className={`text-[7px] md:text-[8px] font-bold uppercase tracking-widest mt-0.5 transition-all ${
                          isDarkMode 
                            ? 'text-white/80 drop-shadow-[0_0_4px_rgba(239,68,68,0.6)]' 
                            : 'text-red-500/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]'
                        }`}>
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Country Selector Modal */}
      {showSelector && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xl transition-all duration-300 animate-in fade-in" 
          onClick={handleBackdropClick}
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modal-title"
        >
          <div 
            ref={modalRef}
            className={`w-full max-w-md border backdrop-blur-md p-6 rounded-2xl shadow-2xl relative transition-all duration-300 scale-100 ${
              isDarkMode ? 'bg-slate-900/90 border-slate-800/80' : 'bg-white/95 border-slate-200'
            }`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 blur-2xl pointer-events-none rounded-full" />
            
            <h4 id="modal-title" className={`text-base font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {t.modalTitle}
            </h4>
            <p className={`text-xs mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.modalDesc}
            </p>

            {/* Search Filter */}
            <div className="relative mb-4">
              <input
                type="text"
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 transition-all ${
                  isDarkMode 
                    ? 'bg-slate-950/50 border-slate-800 text-slate-200 placeholder-slate-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400'
                }`}
              />
              <svg className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" style={{ [isRtl ? 'left' : 'right']: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Country Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-red-500/20 scrollbar-track-transparent">
              {filteredCountries.map((country) => (
                <button
                  key={country}
                  onClick={() => {
                    setShowSelector(false);
                    setCountryFilter('');
                    onSelectRoute(country);
                  }}
                  className={`p-2.5 border rounded-xl text-xs hover:border-red-500/50 transition-all duration-200 font-medium text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/30 ${
                    isDarkMode 
                      ? 'bg-slate-950/40 border-slate-800 text-slate-200 hover:bg-slate-900/60' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="inline-flex mr-1.5 items-center justify-center w-5 h-5 text-red-500">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 21C12 21 4 14 4 8a8 8 0 1116 0c0 6-8 13-8 13z" />
                      <circle cx="12" cy="8" r="2.5" />
                    </svg>
                  </span>
                  {country}
                </button>
              ))}
              {filteredCountries.length === 0 && (
                <div className="col-span-2 text-center py-6">
                  <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {t.noResults}
                  </p>
                </div>
              )}
            </div>

            <button 
              onClick={() => setShowSelector(false)}
              className={`w-full text-center text-xs block bg-transparent border-none cursor-pointer mt-2 py-2 rounded-lg transition-colors hover:underline ${
                isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.modalBack}
            </button>
          </div>
        </div>
      )}

      {/* Forgot ID Modal */}
      {showForgotIdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xl transition-all duration-300 animate-in fade-in" onClick={handleBackdropClick}>
          <div className={`relative w-full max-w-md border p-8 rounded-3xl shadow-2xl transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.forgotId}</h3>
            <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t.forgotIdPrompt}</p>
            <input
              type="email"
              value={forgotIdEmail}
              onChange={(e) => setForgotIdEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              className={`w-full px-4 py-3 rounded-xl border mb-6 outline-none text-sm ${
                isDarkMode ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
            <div className="flex gap-3">
              <button onClick={() => setShowForgotIdModal(false)} className={`flex-1 py-3 rounded-xl text-sm font-bold ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>{t.modalBack}</button>
              <button onClick={() => retrieveAndEmailId(forgotIdEmail)} className="flex-1 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold rounded-xl text-sm">{t.btnTrack}</button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button (WhatsApp) */}
      <a 
        href="https://wa.me/213XXXXXXXXX?text=Bonjour%20Asir%20Visa%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20..." 
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-2xl shadow-green-500/40 flex items-center justify-center hover:scale-125 active:scale-110 transition-all duration-300 group focus:outline-none focus:ring-4 focus:ring-green-400/50"
        aria-label={t.whatsappCta}
        title={t.whatsappCta}
      >
        <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse opacity-50"></div>
        <svg className="w-8 h-8 text-white relative z-10 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* WhatsApp CTA Banner - Sticky on mobile */}
      <div className={`fixed bottom-24 left-0 right-0 z-30 mx-4 mb-2 md:hidden backdrop-blur-xl border rounded-xl shadow-lg transition-all duration-300 animate-in slide-up ${
        isDarkMode ? 'bg-green-950/50 border-green-800/60' : 'bg-green-50/80 border-green-200'
      }`}>
        <button
          onClick={() => window.open('https://wa.me/213XXXXXXXXX?text=Bonjour%20Asir%20Visa%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20...', '_blank')}
          className={`w-full px-4 py-3 text-xs font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-green-500/40 ${
            isDarkMode ? 'text-green-300 hover:text-green-200' : 'text-green-700 hover:text-green-900'
          }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          {t.whatsappCta}
        </button>
      </div>

      {/* Footer */}
      <footer className={`py-6 px-4 text-center sm:text-left backdrop-blur-md border-t relative z-10 ${
        isDarkMode ? 'bg-slate-950/60 border-slate-800/60' : 'bg-white/70 border-slate-200'
      }`}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-xs text-slate-500 font-medium">
              &copy; {new Date().getFullYear()} Asir Visa. All rights reserved. 
            </p>
          </div>
      
          <div className="flex items-center gap-3">
            <a 
              href="https://www.facebook.com/asir.visa/" 
              target="_blank" 
              rel="noreferrer"
              className={`px-4 py-2 border rounded-xl text-xs font-bold hover:text-blue-400 transition-all duration-300 inline-flex items-center gap-2 backdrop-blur-md shadow-sm hover:scale-105 ${
                isDarkMode ? 'bg-slate-900/50 border-slate-800/60 text-slate-400 hover:border-blue-500/40' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
              </svg>
              Facebook
            </a>

            <a 
              href="https://www.tiktok.com/@asir.visa" 
              target="_blank" 
              rel="noreferrer"
              className={`px-4 py-2 border rounded-xl text-xs font-bold hover:text-rose-400 transition-all duration-300 inline-flex items-center gap-2 backdrop-blur-md shadow-sm hover:scale-105 ${
                isDarkMode ? 'bg-slate-900/50 border-slate-800/60 text-slate-400 hover:border-rose-500/40' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31 0 2.585.34 3.705.99A6.83 6.83 0 0119.38 4.21c.14.31.25.64.32.98.08.38.11.76.11 1.15v2.24c-.95-.31-1.84-.81-2.61-1.46-.7-.59-1.27-1.32-1.68-2.15v9.11a6.04 6.04 0 01-1.07 3.42 6.08 6.08 0 01-8.13 1.34 6.04 6.04 0 01-2.22-3.1 6.13 6.13 0 014.28-7.73c.37-.1.76-.15 1.15-.15v3.13a2.95 2.95 0 00-.78.11 3 3 0 00-2 2.52 3.01 3.01 0 002.3 3.19c.21.04.43.06.65.06a3 3 0 003-3V0h3.15z"/>
              </svg>
              TikTok
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}