import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';

export default function AuthModal({ isOpen, onClose }) {
  const { studentProfile, updateProfile } = useStudent();
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) return;

    // Simulate account creation (Supabase integration will replace this)
    updateProfile({
      isLoggedIn: true,
      user: formData
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-lg bg-slate-900/40 animate-fade-in">
      {/* Shining Blurry Red Glass Container */}
      <div className="relative w-full max-w-md bg-white/80 border border-white/40 shadow-2xl rounded-3xl p-8 backdrop-blur-xl ring-1 ring-red-500/10 overflow-hidden">
        
        {/* Glow effect in background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Interested in <span className="text-red-600">{studentProfile.selectedDestination}</span>?
          </h3>
          <p className="text-sm text-slate-600 mt-1.5 font-medium">
            Create your Asir Visa profile to check tuition parameters and alert the consultancy office.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g., Mohamed Amine"
              className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm text-slate-800"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="amine@example.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm text-slate-800"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Phone Number</label>
            <input
              type="tel"
              required
              placeholder="0555 XX XX XX"
              className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm text-slate-800"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-600/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            Create Account & Get Information
          </button>
        </form>

          <button 
            onClick={onClose}
            className="w-full text-center text-xs text-slate-400 hover:text-slate-600 mt-4 font-medium block"
          >
            Cancel and browse back
          </button>
      </div>
    </div>
  );
}