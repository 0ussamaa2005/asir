import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import AuthModal from './AuthModal';

export default function DestinationCards() {
  const { studentProfile, updateProfile } = useStudent();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const destinations = [
    {
      id: 'Italy',
      title: 'Study in Italy',
      tagline: 'Universitaly Portal & DOV Pathway',
      tuition: '€500 - €3,000 / year',
      requirements: ['Pre-enrolment via Universitaly', 'CIMEA Statement or DOV', 'Language certification Proof']
    },
    {
      id: 'Poland',
      title: 'Study in Poland',
      tagline: 'Affordable English-Taught Degrees',
      tuition: '€2,000 - €4,000 / year',
      requirements: ['High School Diploma Legalization', 'Embassy D-Type Appointment booking', 'Bank Statement Balance']
    },
    {
      id: 'Other Europe',
      title: 'Other European Hubs',
      tagline: 'Schengen Student Gateway',
      tuition: 'Varies by destination',
      requirements: ['Valid Academic Transcripts', 'Schengen Area Proof of funds', 'Accommodation coverage verification']
    }
  ];

  const handleSelectCard = (id) => {
    updateProfile({ selectedDestination: id });
    if (!studentProfile.isLoggedIn) {
      setIsModalOpen(true);
    }
  };

  return (
    <section className="my-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Select Your European Route</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
          Explore structured pathways specifically optimized for major European university centers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {destinations.map((dest) => (
          <div
            key={dest.id}
            onClick={() => handleSelectCard(dest.id)}
            className={`group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 cursor-pointer ${
              studentProfile.selectedDestination === dest.id
                ? 'border-red-500 bg-red-500/[0.03] shadow-md shadow-red-500/5 ring-1 ring-red-500/20'
                : 'border-slate-200/60 bg-white hover:border-red-200 hover:shadow-xl'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-red-600 transition-colors">
                {dest.title}
              </h3>
              <span className="text-[10px] uppercase font-black tracking-widest text-red-600 bg-red-50 px-2.5 py-1 rounded-md">
                Active
              </span>
            </div>
            
            <p className="text-xs font-semibold text-slate-400 mb-4">{dest.tagline}</p>
            
            <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[11px] block font-bold text-slate-400 uppercase tracking-wide">Average Fees</span>
              <span className="text-sm font-bold text-slate-700">{dest.tuition}</span>
            </div>

            <ul className="space-y-2 mt-2">
              {dest.requirements.map((req, i) => (
                <li key={i} className="text-xs text-slate-600 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-red-600">
              <span>{studentProfile.isLoggedIn ? 'View Full Blueprint' : 'Unlock Requirements'}</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        ))}
      </div>

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}