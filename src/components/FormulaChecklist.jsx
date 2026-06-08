// src/components/FormulaChecklist.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function FormulaChecklist({ studentProfile, onNavigateToPayment }) {
  // Checklist local states initialized from current profile data
  const [docs, setDocs] = useState({
    has_diploma: studentProfile.has_diploma || false,
    has_transcripts: studentProfile.has_transcripts || false,
    has_language_proof: studentProfile.has_language_proof || false,
    has_valid_passport: studentProfile.has_valid_passport || false,
    has_bank_statement: studentProfile.has_bank_statement || false,
    has_legalized_docs: studentProfile.has_legalized_docs || false,
  });

  const [rates, setRates] = useState({ acceptance: 0, visa: 0 });
  const [isSaving, setIsSaving] = useState(false);

  // Calculate percentages live based on our algorithm weightings
  useEffect(() => {
    let acceptanceScore = 0;
    let visaScore = 0;

    if (docs.has_diploma) acceptanceScore += 40;
    if (docs.has_transcripts) acceptanceScore += 30;
    if (docs.has_language_proof) acceptanceScore += 30;

    if (docs.has_valid_passport) visaScore += 20;
    if (docs.has_bank_statement) visaScore += 50;
    if (docs.has_legalized_docs) visaScore += 30;

    setRates({ acceptance: acceptanceScore, visa: visaScore });
  }, [docs]);

  const handleToggle = (key) => {
    setDocs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const saveProfileMetrics = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('student_profiles')
        .update({
          ...docs,
          acceptance_rate: rates.acceptance,
          visa_rate: rates.visa
        })
        .eq('id', studentProfile.id);

      if (error) throw error;
      
      // Move forward to pay-wall view on successful update
      onNavigateToPayment();
    } catch (err) {
      alert("Error logging metrics: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
      
      {/* Header Profile Summary */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 mb-8 backdrop-blur-md">
        <h2 className="text-xl font-bold text-white">Student Workspace: {studentProfile.full_name}</h2>
        <p className="text-sm text-slate-400 mt-1">Target Route: <span className="text-red-400 font-semibold">{studentProfile.chosen_destination}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left column: Checklist parameters */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-white tracking-tight">Interactive Profile Formula</h3>
          <p className="text-xs text-slate-400 -mt-2">Select the administrative elements you currently possess to check your profile metrics:</p>
          
          <div className="bg-slate-900/20 border border-slate-800/60 rounded-2xl p-5 space-y-3">
            {[
              { id: 'has_diploma', label: 'Final Diploma / Graduation Certificate', sub: 'Proves academic baseline completion' },
              { id: 'has_transcripts', label: 'Official Multi-Semester Transcripts', sub: 'Required for university syllabus matching' },
              { id: 'has_language_proof', label: 'Language Competency Proof (IELTS / Medium of Instruction)', sub: 'Unlocks English-taught exemptions' },
              { id: 'has_valid_passport', label: 'Valid Biometric Passport', sub: 'Must have at least 1-2 years remaining validity' },
              { id: 'has_bank_statement', label: 'Schengen-Compliant Financial Bank Statement', sub: 'Demonstrates self-sufficiency resources' },
              { id: 'has_legalized_docs', label: 'Legalized & Translated Files', sub: 'Embassy-ready certified translations' },
            ].map((item) => (
              <div 
                key={item.id}
                onClick={() => handleToggle(item.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  docs[item.id] ? 'bg-red-950/10 border-red-500/50' : 'bg-slate-950/40 border-slate-800/60 hover:border-slate-700/60'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.sub}</p>
                </div>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                  docs[item.id] ? 'bg-red-500 border-red-500 text-white' : 'border-slate-600'
                }`}>
                  {docs[item.id] && "✓"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Dynamic Success Rates & Pricing Rules Breakdown */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white tracking-tight">Your Evaluation Score</h3>
          
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-6 shadow-xl">
            
            {/* Acceptance Speed Gauge */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">University Acceptance Rate</span>
              <div className="text-3xl font-black text-white mt-1">{rates.acceptance}%</div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-rose-500 h-full transition-all duration-500" style={{ width: `${rates.acceptance}%` }} />
              </div>
            </div>

            {/* Visa Speed Gauge */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Visa Approval Probability</span>
              <div className="text-3xl font-black text-white mt-1">{rates.visa}%</div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-gradient-to-r from-rose-500 to-red-500 h-full transition-all duration-500" style={{ width: `${rates.visa}%` }} />
              </div>
            </div>

            <hr className="border-slate-800" />

            {/* Premium Structure Details */}
            <div className="text-left space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Agency Fee Structure</h4>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-900">
                <p className="text-xs text-slate-400 font-medium">Phase 1: Admissions Lock</p>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">50,000 DA <span className="text-slate-500 font-normal text-xs">(100% Refundable)</span></p>
                <p className="text-[10px] text-slate-500 mt-0.5">Fully refunded if zero university acceptances are issued.</p>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-900">
                <p className="text-xs text-slate-400 font-medium">Phase 2: Visa Support</p>
                <p className="text-sm font-bold text-white mt-0.5">50,000 DA</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Collected upon confirmation to execute embassy filing.</p>
              </div>
            </div>

            <button
              onClick={saveProfileMetrics}
              disabled={isSaving}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs rounded-xl shadow-lg hover:from-red-700 transition-all uppercase tracking-wider block"
            >
              {isSaving ? "Saving Calculations..." : "Submit File & Pay 2000 DA"}
            </button>
          </div>
          
        </div>

      </div>
    </div>
  );
}