// src/components/AuthPortal.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AuthPortal({ selectedDest, onAuthSuccess, onClose }) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Helper logic to generate a clean, readable 5-character alphanumeric suffix
  const generateCleanTrackingId = () => {
    const validChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No easily confused numbers/letters
    let randomString = '';
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * validChars.length);
      randomString += validChars.charAt(randomIndex);
    }
    return `ASIR-${randomString}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const uniqueTrackingId = generateCleanTrackingId();

        // 1. Insert structural student account into Supabase
        const { data, error } = await supabase
          .from('student_profiles')
          .insert([
            {
              full_name: fullName,
              email: email.trim().toLowerCase(),
              phone: phone.trim(),
              chosen_destination: selectedDest,
              file_tracking_id: uniqueTrackingId,
              agency_contract_status: 'Not Signed',
              pre_evaluation_paid: false
            }
          ])
          .select();

        if (error) {
          // PostgreSQL Error Code for Unique Violations (e.g., Email duplicate record)
          if (error.code === '23505') {
            throw new Error("This email profile is already registered in our agency queue.");
          }
          throw error;
        }

        alert(`Registration successful! Your custom File tracking code is: ${uniqueTrackingId}\nPlease keep this code safe to check your file status.`);
        onAuthSuccess(data[0]);
      } else {
        // 2. Clear Login/Lookup routine via Registered Email parameter
        const { data, error } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('email', email.trim().toLowerCase())
          .single();

        if (error || !data) {
          throw new Error("No student entry matching that email address was discovered.");
        }

        onAuthSuccess(data);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-slate-950/60">
      <div className="relative w-full max-w-md bg-slate-900/90 border border-slate-800 shadow-2xl rounded-3xl p-8 overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 blur-xl pointer-events-none rounded-full" />

        <div className="text-center mb-6">
          <h3 className="text-2xl font-black text-white tracking-tight">
            {isSignUp ? `Target Gateway: ${selectedDest}` : 'Access Your File'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isSignUp 
              ? 'Create your file profile parameters to initiate the interactive assessment formula.' 
              : 'Enter your credentials to load your calculation matrix & review queue.'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text" 
                required 
                placeholder="e.g., Mohamed Amine"
                className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 focus:border-red-500/50 outline-none text-sm text-white placeholder-slate-600 transition-colors"
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
            <input
              type="email" 
              required 
              placeholder="name@domain.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 focus:border-red-500/50 outline-none text-sm text-white placeholder-slate-600 transition-colors"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</label>
              <input
                type="tel" 
                required 
                placeholder="e.g., 0555XX2389"
                className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 focus:border-red-500/50 outline-none text-sm text-white placeholder-slate-600 transition-colors"
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          )}

          <button
            type="submit" 
            disabled={isLoading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-900/10 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Processing Ledger..." : isSignUp ? "Generate File & See Success %" : "Load Profile File"}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-800/60 pt-4">
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-red-400 hover:text-red-300 transition-colors bg-transparent border-none cursor-pointer font-medium"
          >
            {isSignUp ? "Already have a structural file tracking layout? Sign In" : "Need to initiate a new European destination route? Sign Up"}
          </button>
        </div>

        <button 
          type="button"
          onClick={onClose}
          className="w-full text-center text-xs text-slate-500 hover:text-slate-400 mt-4 block bg-transparent border-none cursor-pointer transition-colors"
        >
          Cancel and return to dashboard
        </button>
      </div>
    </div>
  );
}