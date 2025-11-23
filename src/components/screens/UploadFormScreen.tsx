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
      console.error('❗ No profile.id on UploadFormScreen');
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
      console.log('👤 using userId =>', userId);

      const safeFileName = file.name.replace(/\s+/g, '_');
      const storagePath = `${userId}/${crypto.randomUUID()}/${safeFileName}`;
      console.log('📁 client storagePath =>', storagePath);
      console.log('⬆️ starting supabase.storage.upload...');

      // --- ⏱ add a timeout around the upload ---
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.warn('⏱ Upload timed out, aborting request');
        controller.abort();
      }, 60000); // 60 seconds

      let uploadData;
      let uploadError;

      try {
        const result = await supabase.storage
          .from('documents')
          .upload(storagePath, file, {
            upsert: false,
            // @ts-expect-error – supabase-js v2 accepts signal
            signal: controller.signal,
          });

        uploadData = result.data;
        uploadError = result.error;
      } catch (err) {
        clearTimeout(timeoutId);

        if (err instanceof DOMException && err.name === 'AbortError') {
          throw new Error(
            'Upload took too long. Please check your internet and try again.'
          );
        }

        if (err instanceof Error) {
          throw err;
        }

        throw new Error('Unexpected upload error');
      }

      clearTimeout(timeoutId);
      console.log('✅ upload finished, result =>', { uploadData, uploadError });

      if (uploadError) {
        console.error('🚫 Upload error =>', uploadError);
        throw new Error(uploadError.message || 'File upload failed');
      }

      console.log('📨 calling /api/documents...');
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
      console.log('📨 /api/documents response status =>', res.status);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message =
          typeof data === 'object' && data && 'error' in data
            ? (data as { error?: string }).error
            : undefined;
        console.error('POST /api/documents failed:', res.status, data);
        throw new Error(message || 'Failed to create document record.');
      }

      await res.json().catch(() => ({}));

      setDocumentName('');
      setExpiryDate('');
      setFile(null);

      // go back to list screen
      showScreen('upload');
    } catch (err) {
      console.error('❗handleSubmit error =>', err);
      if (err instanceof Error) {
        setError(err.message || 'Something went wrong');
      } else {
        setError('Something went wrong');
      }
    } finally {
      setSubmitting(false);
      console.log('⏹ handleSubmit end');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
      <Header
        title="Upload Document"
        onBack={() => showScreen('upload')}
        showProfileIcon={true}
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>

          {/* File input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document File
            </label>
            <input
              type="file"
              className="w-full text-sm"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl shadow-md hover:bg-yellow-500 disabled:opacity-60"
          >
            {submitting ? 'Saving...' : 'Save Document'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadFormScreen;
