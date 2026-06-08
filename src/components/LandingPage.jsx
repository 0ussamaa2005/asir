// src/components/LandingPage.jsx
import React, { useState } from 'react';

export default function LandingPage({ onSelectRoute, activeUser, onViewDashboard }) {
  const [showSelector, setShowSelector] = useState(false);

  const specializedCountries = ['Hungary', 'Germany', 'France', 'Spain', 'Belgium', 'Austria', 'Netherlands', 'Sweden', 'Denmark', 'Finland','Portugal', 'Czech Republic', 'Greece', 'Ireland', 'Switzerland', 'Norway', 'Luxembourg', 'Slovakia', 'Slovenia', 'Croatia'];

  return (
    <div className="relative min-h-screen bg-[#0b1120] flex flex-col justify-between overflow-x-hidden">
      
      {/* Dynamic Background Glow Ambiance */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-red-600/10 via-rose-500/5 to-transparent blur-[120px] pointer-events-none z-0" />

      {/* Main Hero Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10 w-full flex-grow">
        <div className="text-center max-w-5xl mx-auto px-4">
          <span className="bg-gradient-to-r from-red-500/10 to-rose-500/10 text-red-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border border-red-500/20 inline-block mb-6 backdrop-blur-md">
            European Educational Consultant
          </span>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6 uppercase">
            Shine Globally With Asir Visa: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-red-400 animate-pulse">
              Your Pathway to Study in Europe
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-12">
            Specialized admission routes, document processing metrics, and visa logistics for Italy, Poland, and leading European university networks.
          </p>

          {activeUser && (
            <button 
              onClick={onViewDashboard}
              className="mb-12 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm cursor-pointer"
            >
              ➔ Open Your Active Assessment Dashboard
            </button>
          )}
        </div>

        <div className="text-center mt-8 mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight uppercase">Select Your European Route</h2>
          <div className="w-12 h-1 bg-red-500 mx-auto mt-2 rounded-full" />
        </div>

        {/* Enhanced Glassmorphic Destination Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-2">
          
          {/* ITALY CARD */}
          <div 
            onClick={() => onSelectRoute('Italy')} 
            className="group relative h-72 rounded-2xl overflow-hidden border border-slate-800/40 bg-slate-900/20 backdrop-blur-md cursor-pointer hover:border-red-500/40 shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-end"
          >
            {/* Visual Image Underlay */}
            <img 
              src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80" 
              alt="Italy Landscape" 
              className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity group-hover:opacity-60 group-hover:scale-105 transition-all duration-500"
            />
            {/* Translucent Text Overlay Shield */}
            <div className="relative z-10 p-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pt-12">
              <span className="text-[10px] uppercase font-bold tracking-widest text-red-400">Universitaly Route</span>
              <h3 className="text-xl font-bold text-white mt-1 group-hover:text-red-400 transition-colors">Study in Italy</h3>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">Access prestigious public enrollment systems and native regional scholarship setups.</p>
              <div className="mt-4 text-xs font-bold text-white inline-flex items-center gap-1 group-hover:underline">Explore Requirements →</div>
            </div>
          </div>

          {/* POLAND CARD */}
          <div 
            onClick={() => onSelectRoute('Poland')} 
            className="group relative h-72 rounded-2xl overflow-hidden border border-slate-800/40 bg-slate-900/20 backdrop-blur-md cursor-pointer hover:border-red-500/40 shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-end"
          >
            {/* Visual Image Underlay */}
            <img 
              src="https://images.unsplash.com/photo-1519197924294-4ba991a11128?q=80&w=1169&auto=format&fit=crop" 
              alt="Poland Architecture" 
              className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity group-hover:opacity-60 group-hover:scale-105 transition-all duration-500"
            />
            {/* Translucent Text Overlay Shield */}
            <div className="relative z-10 p-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pt-12">
              <span className="text-[10px] uppercase font-bold tracking-widest text-red-400">Schengen Gateway</span>
              <h3 className="text-xl font-bold text-white mt-1 group-hover:text-red-400 transition-colors">Study in Poland</h3>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">High-ranking polytechnics offering globally recognized technical degrees in English.</p>
              <div className="mt-4 text-xs font-bold text-white inline-flex items-center gap-1 group-hover:underline">Explore Requirements →</div>
            </div>
          </div>

          {/* OTHER DESTINATIONS CARD */}
          <div 
            onClick={() => setShowSelector(true)} 
            className="group relative h-72 rounded-2xl overflow-hidden border border-slate-800/40 bg-slate-900/20 backdrop-blur-md cursor-pointer hover:border-red-500/40 shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-end"
          >
            {/* Visual Image Underlay */}
            <img 
              src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=600&q=80" 
              alt="Europe Hubs" 
              className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity group-hover:opacity-60 group-hover:scale-105 transition-all duration-500"
            />
            {/* Translucent Text Overlay Shield */}
            <div className="relative z-10 p-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pt-12">
              <span className="text-[10px] uppercase font-bold tracking-widest text-red-400">Custom Programs</span>
              <h3 className="text-xl font-bold text-white mt-1 group-hover:text-red-400 transition-colors">Other European Hubs</h3>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">Tailored logistics processing for France, Germany, Hungary, and matching options.</p>
              <div className="mt-4 text-xs font-bold text-white inline-flex items-center gap-1 group-hover:underline">Specify Country →</div>
            </div>
          </div>

        </div>
      </main>

      {/* Target Country Specification Selector Overlay Pop-up */}
      {showSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-slate-950/60">
          <div className="w-full max-w-sm bg-slate-900/90 border border-slate-800/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl relative">
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 blur-xl pointer-events-none rounded-full" />
            
            <h4 className="text-base font-bold text-white mb-1">Select Your Target European Nation</h4>
            <p className="text-xs text-slate-400 mb-4">Choose from our secondary supported consulting lanes:</p>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {specializedCountries.map((country) => (
                <button
                  key={country}
                  onClick={() => {
                    setShowSelector(false);
                    onSelectRoute(country);
                  }}
                  className="p-2.5 bg-slate-950/40 border border-slate-800 text-slate-200 rounded-xl text-xs hover:border-red-500/50 hover:bg-slate-900/60 transition-all font-medium text-left cursor-pointer"
                >
                  📍 {country}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setShowSelector(false)}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-400 block bg-transparent border-none cursor-pointer mt-2"
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      {/* Premium Translucent Footer with Social Shortcuts */}
      <footer className="w-full relative z-10 border-t border-slate-800/40 bg-slate-950/40 backdrop-blur-xl py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="text-center sm:text-left">
            <p className="text-xs text-slate-500 font-medium">
              &copy; {new Date().getFullYear()} Asir Visa. All rights reserved. 
            </p>
          </div>

          {/* Social Icons Container */}
          <div className="flex items-center gap-4">
            
            {/* FACEBOOK SHORTCUT */}
            <a 
              href="https://www.facebook.com/asir.visa/" 
              target="_blank" 
              rel="noreferrer"
              className="px-4 py-2 bg-slate-900/50 border border-slate-800/60 hover:border-blue-500/40 rounded-xl text-xs font-bold text-slate-400 hover:text-blue-400 transition-all inline-flex items-center gap-2 backdrop-blur-md shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
              </svg>
              Facebook
            </a>

            {/* TIKTOK SHORTCUT */}
            <a 
              href="https://www.tiktok.com/@asir.visa" 
              target="_blank" 
              rel="noreferrer"
              className="px-4 py-2 bg-slate-900/50 border border-slate-800/60 hover:border-rose-500/40 rounded-xl text-xs font-bold text-slate-400 hover:text-rose-400 transition-all inline-flex items-center gap-2 backdrop-blur-md shadow-sm"
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