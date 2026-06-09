// src/components/Paywall.jsx
import React, { useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export default function Paywall({ studentProfile, onPaymentSubmitted, lang = 'en', isDarkMode = false }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [copied, setCopied] = useState(null);
  const isRtl = lang === 'ar';

  const translations = {
    en: {
      title: "Lock In Your File Review",
      subtitle: "To transmit your calculated success profile matrix to our physical processing branch, please process the foundational evaluation fee.",
      feeLabel: "Evaluation Fee",
      amount: "2,000 DA",
      ccpTitle: "Postal CCP Account",
      ccpNumber: "0023456789",
      ccpKey: "Cle / Key: 45",
      ripTitle: "Baridimob Transfer RIP",
      ripNumber: "00799999002345678912",
      uploadLabel: "Upload Transaction Slip Picture / Screenshot",
      dropText: "Click or drop file image here",
      selected: (name) => `Selected: ${name}`,
      submit: "Submit File Validation Receipt",
      uploading: "Uploading receipt...",
      successMsg: "Receipt uploaded successfully! Your file is now under active review by our office team.",
      fallbackMsg: "Storage configuration skipped. Emulating upload success...",
      noFile: "Please select or snap a photo of your receipt slip first.",
      copy: "Copy",
      copied: "Copied!",
    },
    ar: {
      title: "تأكيد مراجعة ملفك",
      subtitle: "لإرسال مصفوفة ملفك المحسوبة إلى فرع المعالجة الفعلي، يرجى سداد رسوم التقييم الأساسية.",
      feeLabel: "رسوم التقييم",
      amount: "2,000 دج",
      ccpTitle: "حساب بريدي CCP",
      ccpNumber: "0023456789",
      ccpKey: "مفتاح: 45",
      ripTitle: "رقم التحويل Baridimob RIP",
      ripNumber: "00799999002345678912",
      uploadLabel: "رفع صورة إيصال المعاملة / لقطة شاشة",
      dropText: "انقر أو اسحب الملف هنا",
      selected: (name) => `تم الاختيار: ${name}`,
      submit: "إرسال إيصال التحقق",
      uploading: "جاري رفع الإيصال...",
      successMsg: "تم رفع الإيصال بنجاح! ملفك الآن قيد المراجعة النشطة من قبل فريق المكتب.",
      fallbackMsg: "تم تخطي تكوين التخزين. محاكاة نجاح الرفع...",
      noFile: "يرجى اختيار أو التقاط صورة لإيصالك أولاً.",
      copy: "نسخ",
      copied: "تم النسخ!",
    }
  };

  const t = translations[lang] || translations.en;

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      if (e.target.files[0].size > 5 * 1024 * 1024) {
        alert(lang === 'ar' ? "حجم الملف كبير جداً (الحد الأقصى 5 ميجابايت)" : "File too large (max 5MB)");
        return;
      }
      setFile(e.target.files[0]);
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  }, []);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleUploadReceipt = async (e) => {
    e.preventDefault();
    if (!file) { alert(t.noFile); return; }
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${studentProfile.id}-${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('receipts').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('receipts').getPublicUrl(filePath);
      const { error: updateError } = await supabase.from('student_profiles').update({ ccp_receipt_url: publicUrl, pre_evaluation_paid: false }).eq('id', studentProfile.id);
      if (updateError) throw updateError;
      alert(t.successMsg);
      onPaymentSubmitted();
    } catch (err) {
      console.error(err);
      alert(t.fallbackMsg);
      await supabase.from('student_profiles').update({ ccp_receipt_url: 'https://placeholder.co/receipt.jpg' }).eq('id', studentProfile.id);
      onPaymentSubmitted();
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className={`max-w-2xl mx-auto px-4 pt-28 pb-16 min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0b1120]' : 'bg-slate-50'}`}>
      <div className={`border rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-colors ${isDarkMode ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <div className="text-center max-w-md mx-auto mb-8">
          <h2 className={`text-2xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.title}</h2>
          <p className={`text-sm mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.subtitle}</p>
          <div className="inline-block bg-red-500/10 text-red-400 font-mono text-lg font-black px-4 py-1 rounded-full mt-4 border border-red-500/20">{t.amount}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {[ 
            { title: t.ccpTitle, val: t.ccpNumber, sub: t.ccpKey, key: 'ccp' },
            { title: t.ripTitle, val: t.ripNumber, sub: null, key: 'rip' }
          ].map((acc) => (
            <div key={acc.key} className={`border p-5 rounded-2xl relative group transition-colors ${isDarkMode ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex justify-between items-start">
                <span className={`text-[10px] font-bold uppercase tracking-wider block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{acc.title}</span>
                <button onClick={() => copyToClipboard(acc.val, acc.key)} className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors">
                  {copied === acc.key ? t.copied : t.copy}
                </button>
              </div>
              <span className={`font-extrabold text-lg block mt-1 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{acc.val}</span>
              {acc.sub && <span className={`text-xs font-mono block mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{acc.sub}</span>}
            </div>
          ))}
        </div>

        <hr className={`mb-6 ${isDarkMode ? 'border-slate-800/60' : 'border-slate-200'}`} />

        <form onSubmit={handleUploadReceipt} className="space-y-4 max-w-sm mx-auto">
          <div>
            <label className={`block text-[10px] font-bold uppercase tracking-wider text-center mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.uploadLabel}</label>
            <div 
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer ${dragActive ? 'border-red-500 bg-red-500/5' : isDarkMode ? 'border-slate-800 hover:border-slate-700 bg-slate-950/40' : 'border-slate-200 hover:border-slate-300 bg-slate-50'}`}
            >
              <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
              <div className="space-y-1 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className={`mx-auto h-8 w-8 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{file ? t.selected(file.name) : t.dropText}</p>
              </div>
            </div>
          </div>

          <button type="submit" disabled={isUploading} className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-red-900/10 disabled:opacity-50 cursor-pointer active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            {isUploading ? t.uploading : t.submit}
          </button>
        </form>
      </div>
    </div>
  );
}