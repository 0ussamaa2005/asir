// src/App.jsx
import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import LandingPage from './components/LandingPage';
import AuthPortal from './components/AuthPortal';
import FormulaChecklist from './components/FormulaChecklist';
import Paywall from './components/Paywall';
import AdminDashboard from './components/AdminDashboard'; // Ready to drop in next!

export default function App() {
  const [viewMode, setViewMode] = useState('landing'); 
  const [selectedDest, setSelectedDest] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  
  const [searchTrackId, setSearchTrackId] = useState('');
  const [isTrackLoading, setIsTrackLoading] = useState(false);

  // Download unique ID to the user's desktop/phone storage as a clean .txt note
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
      // Secret backdoor route keyword to load the admin office layout
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
        alert("No active student file discovered under that tracking reference ID.");
        return;
      }

      setActiveUser(data);
      
      if (!data.ccp_receipt_url) {
        setViewMode('checklist');
      } else if (data.pre_evaluation_paid) {
        setViewMode('checklist'); 
      } else {
        setViewMode('waiting-approval');
      }
    } catch (err) {
      alert("System connection error.");
    } finally {
      setIsTrackLoading(false);
    }
  };

  const handleSelectRoute = (destName) => {
    setSelectedDest(destName);
    if (!activeUser) {
      setIsAuthOpen(true);
    } else {
      setViewMode('checklist');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] font-sans antialiased text-slate-200">
      
      {/* Updated: 100% Translucent Glass Top Header Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-transparent backdrop-blur-xl border-b border-slate-800/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setViewMode('landing')}>
            <div className="bg-gradient-to-br from-red-500 to-rose-600 text-white font-black px-2.5 py-1 rounded-lg text-lg tracking-tighter">A</div>
            <span className="text-xl font-bold text-white tracking-tight hidden sm:inline">Asir <span className="text-red-500">Visa</span></span>
          </div>

          <form onSubmit={handleTrackFile} className="flex items-center gap-2 max-w-xs w-full">
            <input 
              type="text"
              placeholder="Track File ID or Key Code..."
              value={searchTrackId}
              onChange={(e) => setSearchTrackId(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950/40 border border-slate-800/40 rounded-xl text-xs text-white placeholder-slate-500 font-mono outline-none focus:border-red-500/50 transition-colors backdrop-blur-md"
            />
            <button 
              type="submit"
              disabled={isTrackLoading}
              className="bg-slate-900/60 border border-slate-800/40 hover:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 transition-all cursor-pointer"
            >
              {isTrackLoading ? '⏳' : 'Track'}
            </button>
          </form>

          <div className="flex items-center gap-3 shrink-0">
            {activeUser && (
              <div className="bg-slate-950/40 border border-slate-800/40 px-3 py-1.5 rounded-xl text-[11px] text-slate-300 font-mono flex items-center gap-2 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                ID: {activeUser.file_tracking_id} 
                <span className="text-slate-600">|</span> 
                <span className={activeUser.pre_evaluation_paid ? "text-emerald-400 font-bold" : "text-amber-400"}>
                  {activeUser.pre_evaluation_paid ? "Verified" : "Pending"}
                </span>
              </div>
            )}
            {viewMode !== 'landing' && (
              <button 
                onClick={() => setViewMode('landing')} 
                className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors bg-transparent border-none cursor-pointer"
              >
                Exit
              </button>
            )}
          </div>

        </div>
      </header>

      {/* View Matrix Router Display */}
      {viewMode === 'landing' && (
        <LandingPage onSelectRoute={handleSelectRoute} activeUser={activeUser} onViewDashboard={() => setViewMode('checklist')} />
      )}

      {viewMode === 'checklist' && (
        <FormulaChecklist studentProfile={activeUser} onNavigateToPayment={() => setViewMode('paywall')} />
      )}

      {viewMode === 'paywall' && (
        <Paywall studentProfile={activeUser} onPaymentSubmitted={() => setViewMode('waiting-approval')} />
      )}

      {viewMode === 'waiting-approval' && (
        <div className="max-w-md mx-auto text-center pt-44 px-4">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto mb-4 font-mono text-xl font-bold">⏳</div>
          <h2 className="text-2xl font-bold text-white">File Awaiting Approval</h2>
          <p className="text-xs font-mono text-slate-500 mt-1">Tracking Code: <span className="text-red-400 font-bold">{activeUser?.file_tracking_id}</span></p>
          
          {/* New ID Downloader Block */}
          <button
            onClick={() => downloadIdTokenFile(activeUser)}
            className="mt-4 px-4 py-2 bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white rounded-xl font-semibold inline-flex items-center gap-2 cursor-pointer transition-all hover:border-slate-700"
          >
            💾 Download File ID as Text Note
          </button>

          <p className="text-sm text-slate-400 mt-6 leading-relaxed">
            Your verification ledger is now in the queue. Our processing desk will clear your profile soon. Paste your tracking code into the bar above at any time to verify updates.
          </p>
        </div>
      )}

      {viewMode === 'admin-panel' && (
        <AdminDashboard />
      )}

      {isAuthOpen && (
        <AuthPortal 
          selectedDest={selectedDest} 
          onClose={() => setIsAuthOpen(false)} 
          onAuthSuccess={(user) => { setActiveUser(user); setIsAuthOpen(false); setViewMode('checklist'); }} 
        />
      )}

    </div>
  );
}