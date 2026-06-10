// src/App.jsx
import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import LandingPage from './components/LandingPage';
import AuthPortal from './components/AuthPortal';
import FormulaChecklist from './components/FormulaChecklist';
import Paywall from './components/Paywall';
import AdminDashboard from './components/AdminDashboard'; 
import { AppProvider, useApp } from './context/AppContext.jsx'; // 👈 FIX: Make sure the AppProvider wrapper is imported here
import { useStudent } from './context/StudentContext.jsx';

function MainAppContent() {
  // 🔗 Extract global controls from our context tower
  const { lang, toggleLang, isDarkMode, toggleTheme } = useApp();
  const { studentProfile, updateProfile } = useStudent();

  const [viewMode, setViewMode] = useState('landing'); 
  const [selectedDest, setSelectedDest] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchTrackId, setSearchTrackId] = useState('');
  const [isTrackLoading, setIsTrackLoading] = useState(false);

  // Translation dictionary for top layout parameters
  const layoutText = {
    en: {
      placeholder: "Track File ID or Key Code...",
      btnTrack: "Track",
      btnExit: "Exit",
      verified: "Verified",
      pending: "Pending",
      waitingTitle: "File Awaiting Approval",
      waitingSub: "Tracking Code:",
      waitingBtn: "💾 Download File ID as Text Note",
      waitingDesc: "Your verification ledger is now in the queue. Our processing desk will clear your profile soon. Paste your tracking code into the bar above at any time to verify updates."
    },
    ar: {
      placeholder: "تتبع ملفك أو أدخل رمز الدخول...",
      btnTrack: "تتبع",
      btnExit: "خروج",
      verified: "مؤكد",
      pending: "قيد الانتظار",
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

  const handleTrackFile = async (e) => {
    e.preventDefault();
    if (!searchTrackId.trim()) return;

    setIsTrackLoading(true);
    try {
      if (searchTrackId.trim().toLowerCase() === 'adminoffice123') {
        setViewMode('admin-panel');
        return;
      }

      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('file_tracking_id', searchTrackId.trim().toUpperCase())
        .single();

      if (error || !data) {
        alert(lang === 'ar' ? "لم يتم العثور على أي ملف طالب مسجل تحت رمز التتبع هذا." : "No active student file discovered under that tracking reference ID.");
        return;
      }

      // Sync Supabase data to our persistent StudentContext
      updateProfile({
        isLoggedIn: true,
        user: { fullName: data.full_name, email: data.email, phone: data.phone },
        selectedDestination: data.chosen_destination,
        hasPaid: data.pre_evaluation_paid,
        ...data // Spreading remaining Supabase fields
      });
      
      if (!data.ccp_receipt_url) {
        setViewMode('checklist');
      } else if (data.pre_evaluation_paid) {
        setViewMode('checklist'); 
      } else {
        setViewMode('waiting-approval');
      }
    } catch (err) {
      alert(lang === 'ar' ? "خطأ في الاتصال بالنظام." : "System connection error.");
    } finally {
      setIsTrackLoading(false);
    }
  };

  const handleSelectRoute = (destName) => {
    setSelectedDest(destName);
    if (!studentProfile.isLoggedIn) {
      setIsAuthOpen(true);
    } else {
      setViewMode('checklist');
    }
  };

  return (
    /* Dynamic Theme Switcher Layer */
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 pt-16 ${
      isDarkMode ? 'bg-[#0b1120] text-slate-200' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* 100% Translucent Glass Top Header Navigation Bar */}
      <header className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${
        isDarkMode ? 'bg-transparent border-slate-800/30' : 'bg-white/60 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setViewMode('landing')}>
            <img src="/favicon.svg" alt="Asir Visa Logo" className="w-9 h-9 object-contain" />
            <span className={`text-xl font-bold tracking-tight hidden sm:inline ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Asir <span className="text-red-500">Visa</span>
            </span>
          </div>

          {/* Centered Document Tracking Input Field */}
          <form onSubmit={handleTrackFile} className="flex items-center gap-2 max-w-xs w-full">
            <input 
              type="text"
              placeholder={t.placeholder}
              value={searchTrackId}
              onChange={(e) => setSearchTrackId(e.target.value)}
              className={`w-full px-3 py-1.5 rounded-xl text-xs font-mono outline-none focus:border-red-500/50 transition-colors backdrop-blur-md border ${
                isDarkMode 
                  ? 'bg-slate-950/40 border-slate-800/40 text-white placeholder-slate-500' 
                  : 'bg-white/80 border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
            <button 
              type="submit"
              disabled={isTrackLoading}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isDarkMode 
                  ? 'bg-slate-900/60 border-slate-800/40 text-slate-300 hover:border-slate-700' 
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {isTrackLoading ? '⏳' : t.btnTrack}
            </button>
          </form>

          {/* Verification Status Micro-badge & Central Floating Toolbar Control */}
          <div className="flex items-center gap-3 shrink-0">
            {studentProfile?.isLoggedIn && (
              <div className={`border px-3 py-1.5 rounded-xl text-[11px] font-mono flex items-center gap-2 backdrop-blur-md ${
                isDarkMode ? 'bg-slate-950/40 border-slate-800/40 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
              }`}>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                ID: {studentProfile?.file_tracking_id} 
                <span className={isDarkMode ? 'text-slate-600' : 'text-slate-300'}>|</span> 
                <span className={studentProfile?.pre_evaluation_paid ? "text-emerald-500 font-bold" : "text-amber-500"}>
                  {studentProfile.pre_evaluation_paid ? t.verified : t.pending}
                </span>
              </div>
            )}
            
            {/* 🛠️ INTEGRATED NAVBAR CONTROLLERS */}
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-xl border ${
              isDarkMode ? 'bg-slate-900/40 border-slate-800/40' : 'bg-white border-slate-200'
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

        </div>
      </header>

      {/* ⚡ UPDATED: Passing global state properties down into your components */}
      {viewMode === 'landing' && (
        <LandingPage 
          onSelectRoute={handleSelectRoute} 
          activeUser={studentProfile} 
          onViewDashboard={() => setViewMode('checklist')} 
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