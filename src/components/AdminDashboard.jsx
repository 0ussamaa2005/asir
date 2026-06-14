// src/components/AdminDashboard.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx';

export default function AdminDashboard({ lang = 'en', isDarkMode = false }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRoute, setFilterRoute] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingDocs, setViewingDocs] = useState(null); // Stores tracking ID of student being viewed
  const [studentDocs, setStudentDocs] = useState([]);
  const [toast, setToast] = useState(null);
  const isRtl = lang === 'ar';

  const translations = {
    en: {
      title: "Asir Visa Central Office Desk",
      subtitle: "Manage live European applicant portfolios, verify transaction slips, and pull master Excel ledgers.",
      exportBtn: "Export Master Ledger to Excel",
      all: "All",
      trackId: "Track ID",
      profile: "Student Profile",
      target: "Target Hub",
      metrics: "Calculated Metrics",
      receipt: "Payment Receipt Slip",
      action: "Verification Utility",
      viewSlip: "View Slip",
      noSlip: "No slip uploaded",
      verified: "Verified Paid",
      pending: "Click to Approve",
      loading: "Pulling live database profiles...",
      empty: "No student records match selected criteria parameters.",
      searchPlaceholder: "Search by name, email, or ID...",
      statsTotal: "Total Files",
      statsPending: "Pending Payment",
      statsVerified: "Verified",
      toastUpdated: "Payment status synchronized successfully!",
      toastExport: "Excel ledger exported successfully!",
      notesLabel: "Admin Notes",
      addNotes: "+ Add Notes",
      editNotes: "📝 Edit Notes",
      viewDocs: "📁 View Files",
      notesPrompt: "Enter custom instructions/notes for this student:",
      noDocsFound: "No documents submitted yet."
    },
    ar: {
      title: "مكتب أسير فيزا المركزي",
      subtitle: "إدارة ملفات المتقدمين الأوروبيين، التحقق من إيصالات الدفع، واستخراج سجلات Excel الرئيسية.",
      exportBtn: "تصدير السجل الرئيسي إلى Excel",
      all: "الكل",
      trackId: "معرف الملف",
      profile: "الملف الشخصي",
      target: "الوجهة المستهدفة",
      metrics: "المؤشرات المحسوبة",
      receipt: "إيصال الدفع",
      action: "أداة التحقق",
      viewSlip: "عرض الإيصال",
      noSlip: "لم يتم رفع إيصال",
      verified: "تم التحقق",
      pending: "انقر للموافقة",
      loading: "جاري تحميل الملفات من قاعدة البيانات...",
      empty: "لا توجد سجلات مطابقة للمعايير المحددة.",
      searchPlaceholder: "البحث بالاسم أو البريد أو المعرف...",
      statsTotal: "إجمالي الملفات",
      statsPending: "في انتظار الدفع",
      statsVerified: "تم التحقق",
      toastUpdated: "تم تحديث حالة الدفع بنجاح!",
      toastExport: "تم تصدير السجل بنجاح!",
      notesLabel: "ملاحظات الأدمن",
      addNotes: "+ إضافة ملاحظات",
      editNotes: "📝 تعديل الملاحظات",
      viewDocs: "📁 عرض الملفات",
      notesPrompt: "أدخل التعليمات/الملاحظات المخصصة لهذا الطالب:",
      noDocsFound: "لم يتم تقديم أي مستندات بعد."
    }
  };

  const t = translations[lang] || translations.en;

  useEffect(() => {
    const fetchActiveOfficeQueue = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('student_profiles').select('*').order('created_at', { ascending: false });
      if (!error && data) setStudents(data);
      setLoading(false);
    };
    fetchActiveOfficeQueue();
  }, []);

  const handleTogglePaymentStatus = async (id, currentStatus) => {
    const { error } = await supabase
      .from('student_profiles')
      .update({ pre_evaluation_paid: !currentStatus })
      .eq('id', id);
    if (!error) {
      setToast({ message: t.toastUpdated });
      setTimeout(() => setToast(null), 3000);
      // Refresh local state to reflect update
      setStudents(prev => prev.map(s => s.id === id ? { ...s, pre_evaluation_paid: !currentStatus } : s));
    }
  };

  const handleUpdateNotes = async (id, notes) => {
    const { error } = await supabase
      .from('student_profiles')
      .update({ admin_notes: notes })
      .eq('id', id);
    if (!error) {
      setToast({ message: t.toastUpdated });
      setTimeout(() => setToast(null), 3000);
      setStudents(prev => prev.map(s => s.id === id ? { ...s, admin_notes: notes } : s));
    }
  };

  const handleViewDocs = async (trackingId) => {
    setViewingDocs(trackingId);
    setStudentDocs([]);
    const { data, error } = await supabase
      .from('student_documents')
      .select('*')
      .eq('file_tracking_id', trackingId)
      .order('created_at', { ascending: false });
    if (!error && data) setStudentDocs(data);
  };

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
    XLSX.writeFile(workbook, `ASIR_VISA_STUDENT_EXPORT_${new Date().toISOString().split('T')[0]}.xlsx`);
    setToast({ message: t.toastExport });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredStudents = useMemo(() => {
    let result = filterRoute === 'All' ? students : students.filter(s => s.chosen_destination === filterRoute);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        (s.full_name?.toLowerCase().includes(q)) ||
        (s.email?.toLowerCase().includes(q)) ||
        (s.file_tracking_id?.toLowerCase().includes(q))
      );
    }
    return result;
  }, [students, filterRoute, searchQuery]);

  const stats = useMemo(() => ({
    total: students.length,
    pending: students.filter(s => !s.pre_evaluation_paid).length,
    verified: students.filter(s => s.pre_evaluation_paid).length,
  }), [students]);

  const routes = ['All', 'Italy', 'Poland', 'Hungary', 'Germany', 'France'];

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className={`max-w-7xl mx-auto px-4 pt-24 pb-16 min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0b1120]' : 'bg-slate-50'}`}>
      
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 bg-emerald-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-300">
          {toast.message}
        </div>
      )}

      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border p-6 rounded-2xl backdrop-blur-md transition-colors ${isDarkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-white/60 border-slate-200 shadow-sm'}`}>
        <div>
          <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.title}</h2>
          <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.subtitle}</p>
        </div>
        <button onClick={exportToExcelLedger} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 tracking-wide cursor-pointer uppercase active:scale-[0.98]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          {t.exportBtn}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: t.statsTotal, value: stats.total },
          { label: t.statsPending, value: stats.pending },
          { label: t.statsVerified, value: stats.verified },
        ].map((stat) => (
          <div key={stat.label} className={`border rounded-2xl p-4 backdrop-blur-md transition-colors ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white/60 border-slate-200'}`}>
            <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{stat.label}</p>
            <p className={`text-2xl font-black mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <input
            type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 transition-all ${isDarkMode ? 'bg-slate-950/50 border-slate-800 text-slate-200 placeholder-slate-600' : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'}`}
          />
          <svg className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" style={{ [isRtl ? 'left' : 'right']: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {routes.map((route) => (
            <button key={route} onClick={() => setFilterRoute(route)} className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer active:scale-95 ${filterRoute === route ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/10' : isDarkMode ? 'bg-slate-950 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}>
              {route === 'All' ? t.all : route}
            </button>
          ))}
        </div>
      </div>

      <div className={`border rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md transition-colors ${isDarkMode ? 'bg-slate-950/60 border-slate-800/60' : 'bg-white border-slate-200'}`}>
        {loading ? (
          <div className="p-12 space-y-4">
            {[1,2,3].map(i => <div key={i} className={`h-12 rounded-xl animate-pulse ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />)}
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center">
            <svg className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.empty}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className={`border-b font-bold uppercase tracking-wider ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                  <th className="p-4">{t.trackId}</th>
                  <th className="p-4">{t.profile}</th>
                  <th className="p-4">{t.target}</th>
                  <th className="p-4 text-center">{t.metrics}</th>
                  <th className="p-4 text-center">{t.receipt}</th>
                  <th className="p-4">{t.notesLabel}</th>
                  <th className="p-4 text-right">{t.action}</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800/40 text-slate-300' : 'divide-slate-100 text-slate-600'}`}>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-900/40' : 'hover:bg-slate-50/80'}`}>
                    <td className="p-4 font-mono font-bold text-red-400 whitespace-nowrap">{student.file_tracking_id || 'N/A'}</td>
                    <td className="p-4">
                      <p className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{student.full_name}</p>
                      <p className={`font-mono mt-0.5 text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{student.email}</p>
                      <p className={`mt-0.5 text-[11px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{student.phone}</p>
                    </td>
                    <td className="p-4 font-semibold">
                      <span className={`inline-flex items-center gap-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />{student.chosen_destination}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5 items-center justify-center">
                        <span className={`px-2 py-0.5 rounded border text-[10px] ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                          Univ: <b className={isDarkMode ? 'text-white' : 'text-slate-900'}>{student.acceptance_rate || 0}%</b>
                        </span>
                        <span className={`px-2 py-0.5 rounded border text-[10px] ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                          Visa: <b className={isDarkMode ? 'text-white' : 'text-slate-900'}>{student.visa_rate || 0}%</b>
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {student.ccp_receipt_url ? (
                        <a href={student.ccp_receipt_url} target="_blank" rel="noreferrer" className={`px-2.5 py-1 border rounded font-semibold inline-block transition-colors text-[11px] ${isDarkMode ? 'bg-slate-900 border-slate-800 text-red-400 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 text-red-600 hover:bg-slate-100'}`}>
                          {t.viewSlip}
                        </a>
                      ) : (
                        <span className={`font-mono text-[11px] ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>{t.noSlip}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <button 
                          onClick={() => {
                            const newNotes = prompt(t.notesPrompt, student.admin_notes || "");
                            if (newNotes !== null) handleUpdateNotes(student.id, newNotes);
                          }}
                          className={`text-[10px] font-bold uppercase hover:underline text-left ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                        >
                          {student.admin_notes ? t.editNotes : t.addNotes}
                        </button>
                        <button 
                          onClick={() => handleViewDocs(student.file_tracking_id)}
                          className={`text-[10px] font-bold uppercase hover:underline text-left ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}
                        >
                          {t.viewDocs}
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleTogglePaymentStatus(student.id, student.pre_evaluation_paid)} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 ${student.pre_evaluation_paid ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' : 'bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20'}`}>
                        {student.pre_evaluation_paid ? t.verified : t.pending}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Document Viewer Modal */}
      {viewingDocs && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={() => setViewingDocs(null)}>
          <div className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">{t.viewDocs}</h3>
              <button onClick={() => setViewingDocs(null)} className="text-xs font-bold opacity-50 hover:opacity-100 uppercase">✕</button>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {studentDocs.length === 0 ? (
                <p className="text-sm text-center py-10 opacity-50">{t.noDocsFound}</p>
              ) : (
                studentDocs.map(doc => (
                  <div key={doc.id} className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <div>
                      <p className="text-sm font-bold">{doc.document_name}</p>
                      <p className="text-[10px] opacity-50">{new Date(doc.created_at).toLocaleString()}</p>
                    </div>
                    <a 
                      href={doc.file_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider"
                    >
                      View ↗
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}