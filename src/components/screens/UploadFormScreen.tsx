// src/components/screens/UploadFormScreen.tsx
import React, { useState } from 'react';
import Header from '@/components/core/Header';
import { supabase } from '@/lib/supabaseClient';
import { ScreenProps } from '@/types';
import { Upload } from 'lucide-react'; // nice upload icon

const UploadFormScreen: React.FC<ScreenProps> = ({ showScreen, showAlert, profile }) => {
  const [docType, setDocType] = useState<string>('Passport');
  const [customName, setCustomName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('No file chosen');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    } else {
      setFile(null);
      setFileName('No file chosen');
    }
  };

  const handleSave = async () => {
    if (!file) {
      showAlert?.('Please choose a file first.', 'error');
      return;
    }
    if (!customName.trim()) {
      showAlert?.('Please enter a document name.', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const userId = profile?.id ?? 'anonymous';
      const ext = file.name.split('.').pop() ?? '';
      const storagePath = `${userId}/${Date.now()}_${customName.replace(/\s+/g, '_')}.${ext}`;

      // Upload file to Supabase storage
      const { error: uploadErr } = await supabase.storage
        .from('documents')
        .upload(storagePath, file, { contentType: file.type, upsert: false });

      if (uploadErr) throw uploadErr;

      // Get public URL
      const { data: pub } = supabase.storage.from('documents').getPublicUrl(storagePath);
      const publicUrl = pub?.publicUrl ?? null;

      // Insert metadata into DB
      const { error: insertErr } = await supabase.from('documents').insert({
        owner_id: userId,
        doc_type: docType,
        custom_name: customName,
        expiry_date: expiryDate || null,
        storage_path: storagePath,
        original_name: file.name,
        mime_type: file.type,
        public_url: publicUrl,
      });

      if (insertErr) throw insertErr;

      showAlert?.('Uploaded successfully ✅', 'success');
      setFile(null);
      setFileName('No file chosen');
      setCustomName('');
      setExpiryDate('');
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        showAlert?.(err.message, 'error');
      } else {
        showAlert?.('Upload failed', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
      <Header
        title="Upload Document"
        onBack={() => showScreen?.('dashboard')}
        showProfileIcon={true}
        showScreen={showScreen}
        profile={profile}
      />

      <div className="p-6 flex-1 max-w-3xl mx-auto w-full">
        <div className="bg-white p-6 rounded-xl shadow-xl border border-purple-200 space-y-5">
          {/* Document type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Document type</label>
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
            >
              <option>Passport</option>
              <option>Visa</option>
              <option>Bank Statement</option>
              <option>Flight Ticket</option>
              <option>Hotel Booking</option>
              <option>Other</option>
            </select>
          </div>

          {/* Document name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Document name</label>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="e.g., Passport - Charles Leclerc"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
          </div>

          {/* Expiry date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Expiry date (optional)</label>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>

          {/* File upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">File</label>
            <div className="flex items-center gap-3">
              {/* Hidden input */}
              <input
                id="fileInput"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Custom choose file button */}
              <label
                htmlFor="fileInput"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-400 text-white text-sm font-medium rounded-lg shadow hover:opacity-90 active:scale-95 cursor-pointer transition-all"
              >
                <Upload className="w-4 h-4" />
                Choose File
              </label>

              {/* File name */}
              <span
                className={`text-sm truncate ${
                  file ? 'text-gray-800 font-medium' : 'text-gray-400'
                }`}
                style={{ maxWidth: '60%' }}
              >
                {fileName}
              </span>
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 transition-all hover:shadow-lg disabled:opacity-60"
          >
            {isSaving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadFormScreen;
