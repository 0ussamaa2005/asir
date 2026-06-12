// src/App.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import LandingPage from './components/LandingPage';
import AuthPortal from './components/AuthPortal';
import FormulaChecklist from './components/FormulaChecklist';
import Paywall from './components/Paywall';
import AdminDashboard from './components/AdminDashboard';
import Services from './components/services.jsx';
import { AppProvider, useApp } from './context/AppContext.jsx'; // 👈 FIX: Make sure the AppProvider wrapper is imported here
import { useStudent } from './context/StudentContext.jsx';

function MainAppContent() {
  // 🔗 Extract global controls from our context tower
  const { lang, toggleLang, isDarkMode, toggleTheme } = useApp();
  const { studentProfile, updateProfile } = useStudent();

  const [viewMode, setViewMode] = useState('landing'); 
  const [selectedDest, setSelectedDest] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTrackLoading, setIsTrackLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Translation dictionary for top layout parameters
  const layoutText = {
    en: {
      placeholder: "Track via Email or File ID...", // Already updated in previous diff
      btnTrack: "Track",
      btnApplyHeader: "Apply Now",
      btnIELTS: "IELTS Simulation",
      btnServices: "Services",
      btnExit: "Exit",
      verified: "Verified",
      pending: "Pending",
      trackerPlaceholder: "Email or Unique ID Key",
      trackerHelp: "Track your profile with either your email or your unique file key.",
      waitingTitle: "File Awaiting Approval",
      waitingSub: "Tracking Code:",
      waitingBtn: "💾 Download File ID as Text Note",
      waitingDesc: "Your verification ledger is now in the queue. Our processing desk will clear your profile soon. Paste your tracking code into the bar above at any time to verify updates."
    },
    ar: {
      placeholder: "تتبع عبر البريد الإلكتروني أو رمز الملف...", // Already updated in previous diff
      btnTrack: "تتبع",
      btnApplyHeader: "قدِّم الآن",
      btnIELTS: "محاكاة IELTS",
      btnServices: "الخدمات",
      btnExit: "خروج",
      verified: "مؤكد",
      pending: "قيد الانتظار",
      trackerPlaceholder: "البريد الإلكتروني أو رمز الملف",
      trackerHelp: "تتبع ملفك باستخدام بريدك الإلكتروني أو رمز الملف الفريد.",
      waitingTitle: "الملف في انتظار الموافقة",
      waitingSub: "رمز التتبع:",
      waitingBtn: "💾 تحميل رمز التتبع كملف نصي",
      waitingDesc: "ملفك قيد المراجعة حالياً. سيقوم مكتب المعالجة لدينا بالتدقيق في بياناتك قريباً. يمكنك إدخال رمز التتبع في الأعلى في أي وقت لمتابعة التحديثات الحية."
    }
  };

  const t = layoutText[lang];

  const downloadIdTokenFile = (profile) => {
    if (!profile) return;
    const content = `====================================\nASIR VISA CONSULTING STUDENT CODE\n====================================\n\nStudent Name: ${profile.full_name}\nTarget Country: ${profile.chosen_destination}\nYour Unique File ID: ${profile.file_tracking_id}\n\nPaste this File ID into the top-bar tracker component on our application layout to reload your progress matrix live.`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ASIR-TRACKING-ID-${profile.file_tracking_id}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const performTrack = async (trackId) => {
    if (!trackId.trim()) return;

    setIsTrackLoading(true);
    try {
      if (trackId.trim().toLowerCase() === 'adminoffice123') {
        setViewMode('admin-panel');
        return;
      }

      // Logic: Allow entering "email ID" or just one. 
      // We will try to find a record that matches the input.
      const parts = trackId.trim().split(/[\s,]+/);
      let query = supabase.from('student_profiles').select('*');

      if (parts.length >= 2) {
        // If two parts are provided, assume Email and ID
        const emailPart = parts.find(p => p.includes('@'))?.toLowerCase();
        const idPart = parts.find(p => !p.includes('@'))?.toUpperCase();
        
        if (emailPart && idPart) {
          query = query.eq('email', emailPart).eq('file_tracking_id', idPart);
        } else {
          query = query.or(`file_tracking_id.eq."${parts[0].toUpperCase()}",email.eq."${parts[parts.length-1].toLowerCase()}"`);
        }
      } else {
        // Fallback to searching either column for a single input
        const searchVal = trackId.trim();
        query = query.or(`file_tracking_id.eq."${searchVal.toUpperCase()}",email.eq."${searchVal.toLowerCase()}"`);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error("Supabase tracking error details:", error);
        if (error.code === '42501') {
          alert(lang === 'ar' ? "خطأ في الأذونات: يرجى تفعيل سياسة RLS للوصول العام." : "Permission Error: Please enable the RLS policy for public access in Supabase.");
        } else {
          alert(lang === 'ar' ? "خطأ في الاتصال بالنظام." : "System connection error.");
        }
        return;
      }

      if (!data) {
        alert(lang === 'ar' ? "لم يتم العثور على أي ملف طالب مسجل تحت رمز التتبع هذا." : "No active student file discovered under that tracking reference ID.");
        return;
      }

      updateProfile({
        isLoggedIn: true,
        user: { fullName: data.full_name, email: data.email, phone: data.phone },
        selectedDestination: data.chosen_destination,
        hasPaid: data.pre_evaluation_paid,
        ...data
      });

      if (!data.ccp_receipt_url) {
        setViewMode('checklist');
      } else if (data.pre_evaluation_paid) {
        setViewMode('checklist');
      } else {
        setViewMode('waiting-approval');
      }
    } catch (err) {
      console.error("Critical tracking failure:", err);
      alert(lang === 'ar' ? "خطأ في الاتصال بالنظام." : "System connection error.");
    } finally {
      setIsTrackLoading(false);
    }
  };

  const handleTrackFromServices = async (trackId) => {
    await performTrack(trackId);
  };

  const handleSelectRoute = (destName) => {
    setSelectedDest(destName);
    if (!studentProfile.isLoggedIn) {
      setIsAuthOpen(true);
    } else {
      setViewMode('checklist');
    }
  };

  const handleNavigateToServices = () => {
    setViewMode('services');
  };

  const handleOpenIELTS = () => {
    window.open('https://ieltsonlinetests.com/', '_blank');
  };

  const handleApplyNow = () => {
    if (!studentProfile.isLoggedIn) {
      setSelectedDest('services');
      setIsAuthOpen(true);
    } else {
      setViewMode('checklist');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 32);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    /* Dynamic Theme Switcher Layer */
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 pt-0 ${
      isDarkMode ? 'bg-[#0b1120] text-slate-200' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* 100% Translucent Glass Top Header Navigation Bar */}
      <header className={`sticky top-0 w-full z-50 h-16 transition-all duration-300 ${
        isDarkMode
          ? isScrolled
            ? 'bg-slate-950/95 border-slate-800/70 shadow-xl shadow-slate-950/30'
            : 'bg-transparent border-slate-800/30'
          : isScrolled
            ? 'bg-white/95 border-slate-200 shadow-xl shadow-slate-900/10'
            : 'bg-white/70 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setViewMode('landing')}>
            <img src="/favicon.svg" alt="Asir Visa Logo" className="w-9 h-9 object-contain" />
            <div className="flex items-center gap-2">
              <span className={`text-xl font-bold tracking-tight hidden sm:inline ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Asir <span className="text-red-500">Visa</span>
              </span>
              {isScrolled && (
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold border transition-colors ${
                  studentProfile?.isLoggedIn 
                    ? studentProfile.pre_evaluation_paid
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/15 text-amber-400 border-amber-500/20'
                    : 'bg-red-500/15 text-red-300 border-red-500/20'
                }`}>
                  {studentProfile?.isLoggedIn ? (studentProfile.pre_evaluation_paid ? t.verified : t.pending) : "Active"}
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center gap-2 min-w-0">
            <button
              type="button"
              onClick={handleOpenIELTS}
              className={`hidden sm:inline-flex items-center justify-center rounded-2xl px-3 py-2 text-xs sm:text-sm font-semibold transition-all border ${
                isDarkMode
                  ? 'bg-slate-950/60 border-slate-800/50 text-slate-100 hover:bg-slate-900/80'
                  : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.btnIELTS}
            </button>

            <button
              type="button"
              onClick={handleApplyNow}
              className={`hidden sm:inline-flex items-center justify-center rounded-2xl min-w-[180px] px-6 py-2 text-sm sm:text-base font-semibold transition-all border ${
                isDarkMode
                  ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/15'
                  : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.btnApplyHeader}
            </button>

            <button
              type="button"
              onClick={handleNavigateToServices}
              className={`hidden sm:inline-flex items-center justify-center rounded-2xl px-3 py-2 text-xs sm:text-sm font-semibold transition-all border ${
                isDarkMode
                  ? 'bg-slate-950/60 border-slate-800/50 text-slate-100 hover:bg-slate-900/80'
                  : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.btnServices}
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className={`sm:hidden inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition-all border ${
                isDarkMode
                  ? 'bg-slate-950/60 border-slate-800/50 text-slate-100 hover:bg-slate-900/80'
                  : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-100'
              }`}
            >
              {isMobileMenuOpen ? 'Close' : 'Menu'}
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-xl border ${
              isDarkMode ? 'bg-slate-900/40 border-slate-800/40' : 'bg-white border-slate-300'
            }`}>
              <button 
                onClick={toggleTheme} 
                className="p-1 rounded-lg text-sm hover:bg-slate-500/10 transition-colors"
                type="button"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <div className={`w-px h-3.5 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
              <button 
                onClick={toggleLang}
                className="px-1.5 py-0.5 text-[10px] font-black tracking-wider hover:bg-slate-500/10 transition-colors text-red-500"
                type="button"
              >
                {lang === 'en' ? 'AR' : 'EN'}
              </button>
            </div>

            {viewMode !== 'landing' && (
              <button 
                onClick={() => setViewMode('landing')} 
                className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors bg-transparent border-none cursor-pointer"
              >
                {t.btnExit}
              </button>
            )}
          </div>

          {isMobileMenuOpen && (
            <div className={`absolute left-0 right-0 top-full z-40 border-b border-t ${
              isDarkMode ? 'border-slate-800 bg-slate-950/95' : 'border-slate-200 bg-white/95'
            }`}> 
              <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-2 sm:hidden">
                <button
                  type="button"
                  onClick={() => { handleOpenIELTS(); setIsMobileMenuOpen(false); }}
                  className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition-all border ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100 hover:bg-slate-900/80' : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {t.btnIELTS}
                </button>
                <button
                  type="button"
                  onClick={() => { handleApplyNow(); setIsMobileMenuOpen(false); }}
                  className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition-all border ${
                    isDarkMode ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/15' : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {t.btnApplyHeader}
                </button>
                <button
                  type="button"
                  onClick={() => { handleNavigateToServices(); setIsMobileMenuOpen(false); }}
                  className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition-all border ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100 hover:bg-slate-900/80' : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {t.btnServices}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ⚡ UPDATED: Passing global state properties down into your components */}
      {viewMode === 'landing' && (
        <LandingPage 
          onSelectRoute={handleSelectRoute} 
          activeUser={studentProfile} 
          onViewDashboard={() => setViewMode('checklist')} 
          onTrack={performTrack}
          lang={lang} 
          isDarkMode={isDarkMode} 
        />
      )}

      {viewMode === 'checklist' && (
        <FormulaChecklist 
          studentProfile={studentProfile} 
          onNavigateToPayment={() => setViewMode('paywall')} 
          lang={lang} 
          isDarkMode={isDarkMode} 
        />
      )}

      {viewMode === 'paywall' && (
        <Paywall 
          studentProfile={studentProfile} 
          onPaymentSubmitted={() => setViewMode('waiting-approval')} 
          lang={lang} 
          isDarkMode={isDarkMode} 
        />
      )}

      {viewMode === 'services' && (
        <Services
          onTrack={handleTrackFromServices}
          isDarkMode={isDarkMode}
          lang={lang}
        />
      )}

      {viewMode === 'waiting-approval' && (
        <div className="max-w-md mx-auto text-center pt-24 px-4">
          <div className={`w-14 h-14 rounded-full border flex items-center justify-center text-amber-500 mx-auto mb-4 font-mono text-xl font-bold ${
            isDarkMode ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'
          }`}>⏳</div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.waitingTitle}</h2>
          <p className="text-xs font-mono text-slate-400 mt-1">{t.waitingSub} <span className="text-red-500 font-bold">{studentProfile?.file_tracking_id}</span></p>
          
          <button
            onClick={() => downloadIdTokenFile(studentProfile)}
            className={`mt-4 px-4 py-2 border text-xs rounded-xl font-semibold inline-flex items-center gap-2 cursor-pointer transition-all ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700' 
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm'
            }`}
          >
            {t.waitingBtn}
          </button>

          <p className={`text-sm mt-6 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.waitingDesc}
          </p>
        </div>
      )}

      {viewMode === 'admin-panel' && (
        <AdminDashboard lang={lang} isDarkMode={isDarkMode} />
      )}

      {isAuthOpen && (
        <AuthPortal 
          selectedDest={selectedDest} 
          onClose={() => setIsAuthOpen(false)} 
          onAuthSuccess={(user) => { 
            updateProfile({ ...user, isLoggedIn: true }); 
            setIsAuthOpen(false); 
            setViewMode('checklist'); 
          }} 
          lang={lang}
          isDarkMode={isDarkMode}
        />
      )}

    </div>
  );
}

// Global App wrapper exporting context cleanly down to nested router states
export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
