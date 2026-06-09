// src/components/LandingPage.jsx
import React, { useState, useEffect, useRef } from 'react';

export default function LandingPage({ onSelectRoute, activeUser, onViewDashboard, lang, isDarkMode }) {
  const [showSelector, setShowSelector] = useState(false);
  const [countryFilter, setCountryFilter] = useState('');
  const modalRef = useRef(null);

  const specializedCountries = [
    'Hungary', 'Germany', 'France', 'Spain', 'Belgium', 'Austria', 
    'Netherlands', 'Sweden', 'Denmark', 'Finland', 'Portugal', 
    'Czech Republic', 'Greece', 'Ireland', 'Switzerland', 'Norway', 
    'Luxembourg', 'Slovakia', 'Slovenia', 'Croatia'
  ];

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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) setShowSelector(false);
  };

  const translations = {
    en: {
      badge: "European Educational Consultant",
      heroTitle1: "Shine Globally With Asir Visa:",
      heroTitle2: "Your Pathway to Study in Europe",
      heroDesc: "Specialized admission routes, document processing metrics, and visa logistics for Italy, Poland, and leading European university networks.",
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
    },
    ar: {
      badge: "مستشار التعليم الأوروبي",
      heroTitle1: "تألق عالميًا مع أسير فيزا:",
      heroTitle2: "طريقك للدراسة في أوروبا",
      heroDesc: "مسارات قبول متخصصة، مقاييس معالجة المستندات، ولوجستيات التأشيرات لإيطاليا وبولندا وشبكات الجامعات الأوروبية الرائدة.",
      dashboardBtn: " ➔ افتح لوحة تقييم ملفك النشطة",
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
      exploreBtn: "استكشاف الشروط ←",
      specifyBtn: "تحديد الدولة ←",
      modalTitle: "اختر دولتك الأوروبية المستهدفة",
      modalDesc: "اختر من بين مسارات الاستشارات الثانوية المدعومة لدينا:",
      modalBack: "العودة للخلف",
      searchPlaceholder: "ابحث عن دولة...",
      noResults: "لم يتم العثور على نتائج",
    },
  };

  const t = translations[lang] || translations['en'];
  const isRtl = lang === 'ar';

  // Statistics data
  const stats = [
    { value: 340, suffix: '+', label: lang === 'ar' ? 'طالب تم قبوله' : 'Students Placed' },
    { value: 98, suffix: '%', label: lang === 'ar' ? 'نسبة قبول التأشيرة' : 'Visa Approval Rate' },
    { value: 15, suffix: '+', label: lang === 'ar' ? 'جامعة شريكة' : 'Partner Universities' },
    { value: 10, suffix: '', label: lang === 'ar' ? 'سنوات خبرة' : 'Years of Experience' },
  ];

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'} 
      className={`relative min-h-screen flex flex-col overflow-x-hidden transition-colors duration-500 ${
        isDarkMode ? 'bg-[#0b1120]' : 'bg-slate-50'
      }`}
    >
      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-red-600/10 via-rose-500/5 to-transparent blur-[120px] pointer-events-none z-0" />
      
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
          <span className={`inline-block px-4 py-1.5 rounded-full uppercase tracking-widest text-xs font-bold border mb-6 backdrop-blur-md transition-all duration-300 hover:scale-105 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-red-500/10 to-rose-500/10 text-red-400 border-red-500/20' 
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
              <div className={`relative z-10 p-6 bg-gradient-to-t pt-16 ${
                isDarkMode 
                  ? 'from-slate-950 via-slate-950/80 to-transparent' 
                  : 'from-white via-white/80 to-transparent'
              }`}>
                <span className="text-[10px] uppercase font-bold tracking-widest text-red-500">{t.italyRoute}</span>
                <h3 className={`text-xl font-bold mt-1 group-hover:text-red-500 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.italyTitle}</h3>
                <p className={`text-xs mt-1.5 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t.italyDesc}</p>
                <div className={`mt-4 text-xs font-bold inline-flex items-center gap-1 group-hover:underline ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.exploreBtn}</div>
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
              <div className={`relative z-10 p-6 bg-gradient-to-t pt-16 ${
                isDarkMode 
                  ? 'from-slate-950 via-slate-950/80 to-transparent' 
                  : 'from-white via-white/80 to-transparent'
              }`}>
                <span className="text-[10px] uppercase font-bold tracking-widest text-red-500">{t.polandRoute}</span>
                <h3 className={`text-xl font-bold mt-1 group-hover:text-red-500 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.polandTitle}</h3>
                <p className={`text-xs mt-1.5 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t.polandDesc}</p>
                <div className={`mt-4 text-xs font-bold inline-flex items-center gap-1 group-hover:underline ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.exploreBtn}</div>
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
                  <span className="inline-block mr-1.5">📍</span>
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
      
      {/* Stats Section */}
      <section className={`py-16 border-t relative z-10 ${isDarkMode ? 'border-slate-800/40' : 'border-slate-200'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className={`text-3xl md:text-4xl font-black mb-1 transition-colors duration-300 ${isDarkMode ? 'text-white group-hover:text-red-500' : 'text-slate-900 group-hover:text-red-600'}`}>
                  {stat.value}{stat.suffix}
                </div>
                <div className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Action Button (WhatsApp) */}
      <a 
        href="https://wa.me/213XXXXXXXXX?text=Bonjour%20Asir%20Visa%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20..." 
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 rounded-full shadow-lg shadow-green-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300"
        aria-label="Contact on WhatsApp"
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Footer */}
      <footer className={`w-full relative z-10 border-t backdrop-blur-xl py-6 transition-colors duration-300 ${
        isDarkMode ? 'border-slate-800/40 bg-slate-950/40' : 'border-slate-200 bg-white/60'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
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