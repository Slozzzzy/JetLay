import React, { useEffect, useState, useCallback } from 'react';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';
import { supabase } from '@/lib/supabaseClient';

type DocumentStatus = 'valid' | 'expiring' | 'expired';

interface DocumentItem {
  id: string;
  title: string;
  expiry_date: string | null;
  document_type: string;
  status: DocumentStatus;
  url: string | null;
  storage_path: string | null; // ⬅️ we now have this from API
}

const statusStyles: Record<
  DocumentStatus,
  { bg: string; text: string; label: string }
> = {
  valid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Valid' },
  expiring: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    label: 'Expiring soon',
  },
  expired: { bg: 'bg-red-100', text: 'text-red-800', label: 'Expired' },
};

const DocumentListScreen: React.FC<ScreenProps> = ({ showScreen, profile }) => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit modal state
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editExpiryDate, setEditExpiryDate] = useState('');
  const [editFile, setEditFile] = useState<File | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const fetchDocuments = useCallback(
    async (userId: string) => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/documents?userId=${userId}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          const message =
            typeof data === 'object' && data && 'error' in data
              ? (data as { error?: string }).error
              : undefined;
          throw new Error(message || 'Failed to load documents');
        }

        const data = (await res.json()) as DocumentItem[];
        setDocuments(data);
      } catch (err) {
        console.error(err);
        if (err instanceof Error) {
          setError(err.message || 'Something went wrong');
        } else {
          setError('Something went wrong');
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!profile?.id) return;
    fetchDocuments(profile.id);
  }, [profile?.id, fetchDocuments]);

  // 🗑️ Delete handler
  const handleDelete = async (id: string) => {
    if (!profile?.id) return;

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this document?'
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/documents/${id}?userId=${profile.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message =
          typeof data === 'object' && data && 'error' in data
            ? (data as { error?: string }).error
            : undefined;
        throw new Error(message || 'Failed to delete document');
      }

      // Remove from local state
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : 'Failed to delete document';
      alert(message);
    }
  };

  // ✏️ Start editing
  const startEdit = (doc: DocumentItem) => {
    setEditingDoc(doc);
    setEditTitle(doc.title);
    setEditExpiryDate(doc.expiry_date || '');
    setEditFile(null);
    setEditError(null);
  };

  // 💾 Save edit (metadata + optional new file)
  const handleSaveEdit = async () => {
    if (!profile?.id || !editingDoc) return;

    try {
      setSavingEdit(true);
      setEditError(null);

      let newStoragePath = editingDoc.storage_path;

      // If user picked a new file → upload to Supabase and get new storagePath
      if (editFile) {
        const userId = profile.id;
        const safeFileName = editFile.name.replace(/\s+/g, '_');
        newStoragePath = `${userId}/${crypto.randomUUID()}/${safeFileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(newStoragePath, editFile, {
            upsert: false,
          });

        if (uploadError) {
          console.error('Replace upload error =>', uploadError);
          throw new Error(uploadError.message || 'File upload failed');
        }

        console.log('✅ replace upload finished =>', uploadData);
      }

      // Call PATCH API to update document
      const res = await fetch(
        `/api/documents/${editingDoc.id}?userId=${profile.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: editTitle,
            expiryDate: editExpiryDate,
            // keep same document_type for now; you can add a field if you want to edit it
            storagePath: newStoragePath,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message =
          typeof data === 'object' && data && 'error' in data
            ? (data as { error?: string }).error
            : undefined;
        throw new Error(message || 'Failed to update document');
      }

      // Refresh from server so status + signedUrl are correct
      await fetchDocuments(profile.id);
      setEditingDoc(null);
    } catch (err) {
      console.error('❗ handleSaveEdit error =>', err);
      if (err instanceof Error) {
        setEditError(err.message || 'Something went wrong');
      } else {
        setEditError('Something went wrong');
      }
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
      <Header
        title="Your Documents"
        onBack={() => showScreen('dashboard')}
        showProfileIcon={true}
        showScreen={showScreen}
        profile={profile}
      />

      <div className="p-6 flex-1 max-w-3xl mx-auto w-full">
        {loading && <p className="text-gray-600">Loading documents...</p>}
        {error && !loading && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        {!loading && documents.length === 0 && !error && (
          <p className="text-gray-600 text-sm">
            You don&apos;t have any documents yet. Upload one to get started.
          </p>
        )}

        <div className="space-y-3 mt-2">
          {documents.map((doc) => {
            const styles = statusStyles[doc.status];
            const dateColor =
              doc.status === 'expired'
                ? 'text-red-600'
                : doc.status === 'expiring'
                ? 'text-orange-600'
                : 'text-green-600';

            return (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md border border-gray-200"
              >
                <div className="flex flex-col">
                  <strong className="text-gray-900">{doc.title}</strong>
                  <span className={`text-sm mt-1 ${dateColor}`}>
                    • Expires: {doc.expiry_date || 'N/A'}
                  </span>
                  {doc.url && (
                    <button
                      className="mt-2 text-xs underline text-blue-600 hover:text-blue-800 text-left"
                      onClick={() => {
                        if (doc.url) {
                          window.open(doc.url, '_blank');
                        }
                      }}
                    >
                      View document
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${styles.bg} ${styles.text}`}
                  >
                    {styles.label}
                  </span>

                  <button
                    onClick={() => startEdit(doc)}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-xs text-red-600 hover:text-red-800 underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button
          className="w-full mt-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl shadow-md hover:bg-yellow-500"
          onClick={() => showScreen('uploadForm')}
        >
          Upload New Document
        </button>
      </div>

      {/* ✏️ Edit Modal */}
      {editingDoc && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Edit Document
            </h2>

            {editError && (
              <p className="text-red-600 text-sm mb-2">{editError}</p>
            )}

            <div className="space-y-3">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Name
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
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
                  value={editExpiryDate || ''}
                  onChange={(e) => setEditExpiryDate(e.target.value)}
                />
              </div>

              {/* Optional new file */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Replace File (optional)
                </label>
                <input
                  type="file"
                  className="w-full text-sm"
                  onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave this empty if you only want to change the name or expiry
                  date.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => setEditingDoc(null)}
                disabled={savingEdit}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm rounded-lg bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-500 disabled:opacity-60"
                onClick={handleSaveEdit}
                disabled={savingEdit}
              >
                {savingEdit ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentListScreen;
