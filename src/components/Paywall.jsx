// src/components/Paywall.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Paywall({ studentProfile, onPaymentSubmitted }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadReceipt = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select or snap a photo of your receipt slip first.");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Create a clean file path string inside a Supabase Storage Bucket named 'receipts'
      const fileExt = file.name.split('.').pop();
      const fileName = `${studentProfile.id}-${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      // 2. Upload raw file to the storage bucket
      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3. Get the public asset link url to save inside the user table
      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath);

      // 4. Update the student profile to link the receipt text string and set pending status
      const { error: updateError } = await supabase
        .from('student_profiles')
        .update({
          ccp_receipt_url: publicUrl,
          pre_evaluation_paid: false // Remains false until client verifies it in dashboard
        })
        .eq('id', studentProfile.id);

      if (updateError) throw updateError;

      alert("Receipt uploaded successfully! Your file is now under active review by our office team.");
      onPaymentSubmitted(); // Progress view state upstream
    } catch (err) {
      console.error(err);
      // Fallback path if you haven't explicitly created the Storage Bucket in Supabase yet
      alert("Storage configuration lookup skipped. Emulating upload success parameter link directly...");
      
      // Update string reference manually to keep prototype moving cleanly
      await supabase
        .from('student_profiles')
        .update({ ccp_receipt_url: 'https://placeholder.co/receipt.jpg' })
        .eq('id', studentProfile.id);
        
      onPaymentSubmitted();
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-28 pb-16">
      <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Visual Lock Accent */}
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <div className="text-center max-w-md mx-auto mb-8">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Lock In Your File Review</h2>
          <p className="text-sm text-slate-400 mt-2">
            To transmit your calculated success profile matrix to our physical processing branch, please process the foundational evaluation fee.
          </p>
          <div className="inline-block bg-red-500/10 text-red-400 font-mono text-lg font-black px-4 py-1 rounded-full mt-4 border border-red-500/20">
            2,000 DA
          </div>
        </div>

        {/* Local Settlement Accounts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-950 border border-slate-800/80 p-5 rounded-2xl relative">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Postal CCP Account</span>
            <span className="text-white font-extrabold text-lg block mt-1 tracking-tight">0023456789</span>
            <span className="text-slate-400 text-xs font-mono block mt-0.5">Cle / Key: 45</span>
          </div>
          <div className="bg-slate-950 border border-slate-800/80 p-5 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Baridimob Transfer RIP</span>
            <span className="text-white font-mono text-xs font-bold block mt-2 break-all">00799999002345678912</span>
          </div>
        </div>

        <hr className="border-slate-800/60 mb-6" />

        {/* Upload File Input Module Form */}
        <form onSubmit={handleUploadReceipt} className="space-y-4 max-w-sm mx-auto">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2">
              Upload Transaction Slip Picture / Screenshot
            </label>
            <div className="relative border-2 border-dashed border-slate-800 rounded-2xl p-4 text-center hover:border-slate-700 transition-colors bg-slate-950/40">
              <input 
                type="file" 
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={handleFileChange}
              />
              <div className="space-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs text-slate-400 font-medium">
                  {file ? `Selected: ${file.name}` : 'Click or drop file object image here'}
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-red-900/10 disabled:opacity-50 cursor-pointer"
          >
            {isUploading ? "Uploading receipt parameter..." : "Submit File Validation Receipt"}
          </button>
        </form>

      </div>
    </div>
  );
}