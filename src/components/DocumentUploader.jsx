// src/components/DocumentUploader.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export default function DocumentUploader({ studentProfile, lang = 'en', isDarkMode = false, onLogout }) {
  const [adminNotes, setAdminNotes] = useState('');
  const [docLabel, setDocLabel] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [history, setHistory] = useState([]);
  const isRtl = lang === 'ar';

  const translations = {
    en: {
      title: "Document Submission Portal",
      welcome: "Welcome back,",
      trackingId: "File ID",
      adminNotesTitle: "Instructions from Admissions Office",
      uploadTitle: "Upload New Document",
      labelPlaceholder: "Document Name (e.g. Passport Copy)",
      filePlaceholder: "Click to select or drag scanned file",
      submitBtn: "Upload & Verify Document",
      uploading: "Processing Asset...",
      historyTitle: "Submission History",
      viewLink: "View Asset ↗",
      noDocs: "No documents uploaded yet.",
      logoutBtn: "Secure Session & Exit Dashboard",
      success: "Document uploaded and logged successfully!"
    },
    ar: {
      title: "بوابة تقديم المستندات",
      welcome: "مرحباً بك،",
      trackingId: "رمز الملف",
      adminNotesTitle: "تعليمات مكتب القبول",
      uploadTitle: "رفع مستند جديد",
      labelPlaceholder: "اسم المستند (مثلاً: نسخة جواز السفر)",
      filePlaceholder: "انقر لاختيار الملف أو اسحبه هنا",
      submitBtn: "رفع وتوثيق المستند",
      uploading: "جاري المعالجة...",
      historyTitle: "سجل التقديمات",
      viewLink: "عرض الملف ↗",
      noDocs: "لم يتم رفع أي مستندات بعد.",
      logoutBtn: "تأمين الجلسة والخروج من لوحة التحكم",
      success: "تم رفع المستند وتسجيله بنجاح!"
    }
  };

  const t = translations[lang] || translations.en;

  const fetchData = useCallback(async () => {
    if (!studentProfile?.file_tracking_id) return;

    // Fetch freshest Admin Notes
    const { data: profile } = await supabase
      .from('student_profiles')
      .select('admin_notes')
      .eq('file_tracking_id', studentProfile.file_tracking_id)
      .maybeSingle();
    
    if (profile?.admin_notes) setAdminNotes(profile.admin_notes);

    // Fetch Submission History
    const { data: docs } = await supabase
      .from('student_documents')
      .select('*')
      .eq('file_tracking_id', studentProfile.file_tracking_id)
      .order('created_at', { ascending: false });
    
    if (docs) setHistory(docs);
  }, [studentProfile?.file_tracking_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !docLabel.trim()) return;
    
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const sanitizedLabel = docLabel.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fileName = `${Date.now()}_${sanitizedLabel}.${fileExt}`;
      const filePath = `${studentProfile.file_tracking_id}/${fileName}`;

      // A. Storage Upload
      const { error: uploadError } = await supabase.storage
        .from('student-docs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // B. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('student-docs')
        .getPublicUrl(filePath);

      // C. Database Metadata Insert
      const { error: dbError } = await supabase
        .from('student_documents')
        .insert([{
          file_tracking_id: studentProfile.file_tracking_id,
          document_name: docLabel.trim(),
          file_url: publicUrl
        }]);

      if (dbError) throw dbError;

      alert(t.success);
      setDocLabel('');
      setFile(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className={`max-w-4xl mx-auto px-4 pt-32 pb-16 min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-[#0b1120]' : 'bg-slate-50'}`}>
      
      <div className="text-center mb-10">
        <h2 className={`text-3xl font-black tracking-tight uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.title}</h2>
        <p className={`text-sm mt-2 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {t.welcome} <span className="text-red-500 font-bold">{studentProfile?.full_name}</span> • {t.trackingId}: <span className="font-mono text-red-500">{studentProfile?.file_tracking_id}</span>
        </p>
      </div>

      {/* Admin Notes Section */}
      {adminNotes && (
        <div className={`mb-8 p-6 rounded-2xl border backdrop-blur-md animate-in fade-in transition-all ${
          isDarkMode ? 'bg-red-500/5 border-red-500/20 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'bg-white border-red-200 text-slate-800 shadow-sm'
        }`}>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> {t.adminNotesTitle}
          </h4>
          <p className="text-sm leading-relaxed italic opacity-90">{adminNotes}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Form */}
        <div className={`p-8 rounded-3xl border backdrop-blur-xl shadow-2xl transition-all duration-300 ${
          isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.uploadTitle}</h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <input
              type="text"
              value={docLabel}
              onChange={(e) => setDocLabel(e.target.value)}
              placeholder={t.labelPlaceholder}
              className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all ${
                isDarkMode ? 'bg-slate-950/50 border-slate-800 text-white focus:border-red-500/50' : 'bg-slate-50 border-slate-200 focus:ring-4 focus:ring-red-500/10'
              }`}
              required
            />
            <div className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${file ? 'border-emerald-500/50 bg-emerald-500/5' : isDarkMode ? 'border-slate-800 hover:border-slate-700' : 'border-slate-200 hover:border-red-200'}`}>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
              <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{file ? file.name : t.filePlaceholder}</p>
            </div>
            <button type="submit" disabled={isUploading} className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg active:scale-[0.98] disabled:opacity-50 cursor-pointer">
              {isUploading ? t.uploading : t.submitBtn}
            </button>
          </form>
        </div>

        {/* History Grid */}
        <div className={`p-8 rounded-3xl border backdrop-blur-md transition-all duration-300 ${isDarkMode ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.historyTitle}</h3>
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {history.length === 0 ? <p className="text-xs text-slate-500 text-center py-20 font-bold opacity-60">{t.noDocs}</p> : 
              history.map((doc) => (
                <div key={doc.id} className={`p-4 rounded-xl border flex items-center justify-between group transition-all hover:translate-x-1 ${isDarkMode ? 'bg-slate-950/40 border-slate-800 hover:border-red-500/30' : 'bg-slate-50 border-slate-100 hover:border-red-200'}`}>
                  <div className="min-w-0">
                    <p className={`text-sm font-bold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{doc.document_name}</p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase mt-0.5">{new Date(doc.created_at).toLocaleDateString()}</p>
                  </div>
                  <a href={doc.file_url} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase text-red-500 hover:underline ml-4 flex-shrink-0">{t.viewLink}</a>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-800/50 text-center">
        <button onClick={onLogout} className={`px-8 py-3 rounded-xl text-xs font-bold transition-all border ${isDarkMode ? 'text-slate-500 border-slate-800 hover:text-white hover:border-slate-600' : 'text-slate-400 border-slate-200 hover:text-slate-900'}`}>{t.logoutBtn}</button>
      </div>
    </div>
  );
}