// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx';

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRoute, setFilterRoute] = useState('All');

  useEffect(() => {
    fetchActiveOfficeQueue();
  }, []);

  const fetchActiveOfficeQueue = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('student_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setStudents(data);
    setLoading(false);
  };

  // Toggle Payment verification parameters straight inside the ledger
  const handleTogglePaymentStatus = async (id, currentStatus) => {
    const { error } = await supabase
      .from('student_profiles')
      .update({ pre_evaluation_paid: !currentStatus })
      .eq('id', id);

    if (!error) {
      alert("Payment parameters synchronized successfully!");
      fetchActiveOfficeQueue();
    }
  };

  // Automated Excel sheets engine builder exporter
  const exportToExcelLedger = () => {
    const exportData = students.map((s, index) => ({
      Index: index + 1,
      'File Track ID': s.file_tracking_id,
      'Full Name': s.full_name,
      Email: s.email,
      Phone: s.phone,
      Destination: s.chosen_destination,
      'Acceptance Rate %': `${s.acceptance_rate || 0}%`,
      'Visa Probability %': `${s.visa_rate || 0}%`,
      '2000 DA Cleared': s.pre_evaluation_paid ? 'YES' : 'PENDING',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Asir Visa Master Records');
    
    // Trigger download execution directly in browser
    XLSX.writeFile(workbook, `ASIR_VISA_STUDENT_EXPORT_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filteredStudents = filterRoute === 'All' 
    ? students 
    : students.filter(s => s.chosen_destination === filterRoute);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
      
      {/* Dashboard Headline Controller Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 bg-slate-900/30 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Asir Visa Central Office Desk</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage live European applicant portfolios, verify transaction slips, and pull master Excel ledgers.</p>
        </div>
        
        <button
          onClick={exportToExcelLedger}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 tracking-wide cursor-pointer uppercase"
        >
          📊 Export Master Ledger to Excel
        </button>
      </div>

      {/* Filter Toolbar Component */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {['All', 'Italy', 'Poland', 'Hungary', 'Germany', 'France'].map((route) => (
          <button
            key={route}
            onClick={() => setFilterRoute(route)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
              filterRoute === route 
                ? 'bg-red-600 border-red-500 text-white' 
                : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            {route}
          </button>
        ))}
      </div>

      {/* Primary Main Data Table */}
      <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500 font-mono animate-pulse">Pulling live database profiles...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500 font-mono">No student records match selected criteria parameters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Track ID</th>
                  <th className="p-4">Student Profile</th>
                  <th className="p-4">Target Hub</th>
                  <th className="p-4 text-center">Calculated Metrics</th>
                  <th className="p-4 text-center">Payment Receipt Slip</th>
                  <th className="p-4 text-right">Verification Utility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-900/40 transition-colors">
                    
                    {/* Unique ID tracking badge info */}
                    <td className="p-4 font-mono font-bold text-red-400 whitespace-nowrap">
                      {student.file_tracking_id || 'N/A'}
                    </td>
                    
                    {/* Basic personal identity parameters info */}
                    <td className="p-4">
                      <p className="font-bold text-white text-sm">{student.full_name}</p>
                      <p className="text-slate-400 font-mono mt-0.5">{student.email}</p>
                      <p className="text-slate-500 mt-0.5">{student.phone}</p>
                    </td>

                    <td className="p-4 font-semibold text-slate-200">
                      📍 {student.chosen_destination}
                    </td>

                    {/* Algorithmic calculations readout display */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1 items-center justify-center">
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[10px]">
                          Univ: <b className="text-white">{student.acceptance_rate || 0}%</b>
                        </span>
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[10px]">
                          Visa: <b className="text-white">{student.visa_rate || 0}%</b>
                        </span>
                      </div>
                    </td>

                    {/* Live Receipt Picture asset click lookup loader column */}
                    <td className="p-4 text-center">
                      {student.ccp_receipt_url ? (
                        <a 
                          href={student.ccp_receipt_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-red-400 font-semibold inline-block hover:underline"
                        >
                          👁️ View Slip
                        </a>
                      ) : (
                        <span className="text-slate-600 font-mono">No slip uploaded</span>
                      )}
                    </td>

                    {/* Verification confirmation toggle parameter command click interface button */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleTogglePaymentStatus(student.id, student.pre_evaluation_paid)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          student.pre_evaluation_paid 
                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' 
                            : 'bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                        }`}
                      >
                        {student.pre_evaluation_paid ? '✅ Verified Paid' : '⏳ Click to Approve'}
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}