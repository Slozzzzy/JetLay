import React, { useState } from 'react';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';
import { supabase } from '@/lib/supabaseClient';

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
    <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
      <Header
        title="Upload Document"
        onBack={() => showScreen('upload')}
        showProfileIcon
        showScreen={showScreen}
        profile={profile}
      />

      <div className="p-6 flex-1 max-w-xl mx-auto w-full">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-5 rounded-xl shadow-md border border-gray-200"
        >
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Document type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Type
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm h-12"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
            >
              {documentTypeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Document name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Name
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm h-12"
              placeholder="e.g. Main passport, Schengen visa"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
            />
          </div>

          {/* Expiry date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm h-12"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>

          {/* File input — BEAUTIFUL BOX */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document File
            </label>

            <label className="block cursor-pointer w-full">
              <div
                className="
                  w-full h-12
                  flex items-center justify-between 
                  px-3
                  border border-gray-300 
                  rounded-lg 
                  bg-white 
                  shadow-sm
                  hover:border-purple-400 hover:shadow-md
                  transition-all
                "
              >
                <span className="text-sm text-gray-600">
                  {file ? file.name : "Choose a file..."}
                </span>

                <span className="text-xs font-medium text-purple-600">
                  Browse
                </span>
              </div>

              <input
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="
              w-full mt-2 py-3 
              bg-yellow-400 text-gray-900 font-bold 
              rounded-xl shadow-md 
              hover:bg-yellow-500 
              disabled:opacity-60
            "
          >
            {submitting ? 'Saving...' : 'Save Document'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadFormScreen;
