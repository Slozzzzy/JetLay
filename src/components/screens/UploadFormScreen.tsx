// src/components/screens/UploadFormScreen.tsx
import React, { useState } from 'react';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import { 
  UploadCloud, 
  FileText, 
  Calendar, 
  Type, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  File
} from 'lucide-react';

const documentTypeOptions = [
  'Passport',
  'Visa',
  'ID Card',
  'Travel Insurance',
  'Flight Ticket',
  'Hotel Booking',
];

const UploadFormScreen: React.FC<ScreenProps> = ({ showScreen, profile }) => {
  const [documentType, setDocumentType] = useState('Passport');
  const [documentName, setDocumentName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('▶️ handleSubmit start');
    setError(null);

    if (!profile?.id) {
      setError('User profile not loaded.');
      return;
    }
    if (!documentName.trim()) {
      setError('Please enter a document name.');
      return;
    }
    if (!expiryDate) {
      setError('Please choose an expiry date.');
      return;
    }
    if (!file) {
      setError('Please select a file.');
      return;
    }

    try {
      setSubmitting(true);

      const userId = profile.id;
      const safeFileName = file.name.replace(/\s+/g, '_');
      const storagePath = `${userId}/${crypto.randomUUID()}/${safeFileName}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const result = await supabase.storage
        .from('documents')
        .upload(storagePath, file, {
          upsert: false,
          // @ts-expect-error – supabase-js v2 accepts signal
          signal: controller.signal,
        });

      clearTimeout(timeoutId);

      if (result.error) throw new Error(result.error.message);

      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title: `${documentType} - ${documentName}`,
          expiryDate,
          documentType,
          storagePath,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create document record.');
      }

      setDocumentName('');
      setExpiryDate('');
      setFile(null);

      showScreen('upload');
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-20">
      <Header
        title="Upload Document"
        onBack={() => showScreen('upload')}
        showProfileIcon
        showScreen={showScreen}
        profile={profile}
      />

      <div className="p-6 flex-1 max-w-xl mx-auto w-full flex flex-col justify-center">
        
        {/* Glassmorphism Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl ring-1 ring-white/60">
          
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
               <UploadCloud className="w-6 h-6" />
            </div>
            New Upload
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error Alert */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-pulse">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Document type */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                <FileText className="w-4 h-4 text-purple-500" />
                Document Type
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-2xl border-0 ring-1 ring-gray-200 bg-gray-50 px-5 py-4 text-gray-900 shadow-sm focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer font-medium"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                >
                  {documentTypeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {/* Custom Arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                   <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>

            {/* Document name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                <Type className="w-4 h-4 text-indigo-500" />
                Document Name
              </label>
              <input
                type="text"
                className="w-full rounded-2xl border-0 ring-1 ring-gray-200 bg-gray-50 px-5 py-4 text-gray-900 shadow-sm focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all outline-none font-medium placeholder:text-gray-400"
                placeholder="e.g. Main Passport, Schengen Visa"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
              />
            </div>

            {/* Expiry date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                <Calendar className="w-4 h-4 text-pink-500" />
                Expiry Date
              </label>
              <input
                type="date"
                className="w-full rounded-2xl border-0 ring-1 ring-gray-200 bg-gray-50 px-5 py-4 text-gray-900 shadow-sm focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all outline-none font-medium"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>

            {/* File input — BEAUTIFUL DROPZONE */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                <File className="w-4 h-4 text-orange-500" />
                Document File
              </label>

              <label className="relative group flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50/50 hover:bg-white hover:border-purple-400 transition-all duration-300">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  {file ? (
                     <>
                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 animate-bounce">
                           <CheckCircle className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-semibold text-gray-900 truncate max-w-[250px]">{file.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Click to change file</p>
                     </>
                  ) : (
                      <>
                        <UploadCloud className="w-8 h-8 text-gray-400 mb-2 group-hover:text-purple-500 transition-colors" />
                        <p className="text-sm text-gray-500 group-hover:text-gray-700">
                          <span className="font-bold text-purple-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (MAX. 5MB)</p>
                      </>
                  )}
                </div>

                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="
                group relative w-full overflow-hidden rounded-[24px] mt-4
                bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
                bg-[length:200%_auto] p-4 shadow-xl shadow-indigo-500/30 
                transition-all duration-500 
                hover:bg-right hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-1 
                active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed
              "
            >
              <div className="relative flex items-center justify-center gap-2">
                 {submitting ? (
                    <>
                       <Loader2 className="w-6 h-6 text-white animate-spin" />
                       <span className="text-lg font-bold text-white">Saving...</span>
                    </>
                 ) : (
                    <span className="text-lg font-bold text-white tracking-wide">Save Document</span>
                 )}
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadFormScreen;