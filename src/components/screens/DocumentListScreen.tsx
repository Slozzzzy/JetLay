// src/components/screens/DocumentListScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import { 
  FileText, 
  Calendar, 
  Trash2, 
  Edit2, 
  Plus, 
  ExternalLink, 
  X, 
  AlertCircle, 
  Loader2, 
  UploadCloud 
} from 'lucide-react';

type DocumentStatus = 'valid' | 'expiring' | 'expired';

interface DocumentItem {
  id: string;
  title: string;
  expiry_date: string | null;
  document_type: string;
  status: DocumentStatus;
  url: string | null;
  storage_path: string | null;
}

const statusStyles: Record<
  DocumentStatus,
  { bg: string; text: string; border: string; label: string }
> = {
  valid: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Valid' },
  expiring: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    label: 'Expiring soon',
  },
  expired: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Expired' },
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
          throw new Error(data.error || 'Failed to load documents');
        }

        const data = (await res.json()) as DocumentItem[];
        setDocuments(data);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Something went wrong');
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
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      const res = await fetch(`/api/documents/${id}?userId=${profile.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete document');
      }

      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Failed to delete document');
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

  // 💾 Save edit
  const handleSaveEdit = async () => {
    if (!profile?.id || !editingDoc) return;

    try {
      setSavingEdit(true);
      setEditError(null);

      let newStoragePath = editingDoc.storage_path;

      if (editFile) {
        const userId = profile.id;
        const safeFileName = editFile.name.replace(/\s+/g, '_');
        newStoragePath = `${userId}/${crypto.randomUUID()}/${safeFileName}`;

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(newStoragePath, editFile, { upsert: false });

        if (uploadError) throw new Error(uploadError.message || 'File upload failed');
      }

      const res = await fetch(
        `/api/documents/${editingDoc.id}?userId=${profile.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: editTitle,
            expiryDate: editExpiryDate,
            storagePath: newStoragePath,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update document');
      }

      await fetchDocuments(profile.id);
      setEditingDoc(null);
    } catch (err) {
      console.error('handleSaveEdit error =>', err);
      setEditError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-20">
      <Header
        title="Your Documents"
        onBack={() => showScreen('dashboard')}
        showProfileIcon={true}
        showScreen={showScreen}
        profile={profile}
      />

      <div className="p-6 flex-1 max-w-3xl mx-auto w-full">
        {/* Glass Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-6 shadow-xl ring-1 ring-white/60 mb-8 min-h-[300px]">
            
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FileText className="text-purple-600" />
                    Stored Files
                </h3>
                <span className="text-sm text-gray-500 font-medium bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                    {documents.length} Items
                </span>
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin mb-2 text-purple-500" />
                    <p>Loading documents...</p>
                </div>
            )}

            {error && !loading && (
             <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
             </div>
            )}

            {!loading && documents.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                    <UploadCloud className="w-8 h-8 text-purple-300" />
                </div>
                <p className="text-gray-900 font-semibold text-lg">No documents yet</p>
                <p className="text-gray-500 text-sm mt-1 max-w-xs">
                Upload your passports, visas, or tickets to keep them safe and handy.
                </p>
            </div>
            )}

            <div className="space-y-4">
            {documents.map((doc) => {
                const styles = statusStyles[doc.status];
                return (
                <div
                    key={doc.id}
                    className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-purple-100"
                >
                    <div className="flex items-start gap-4 mb-4 sm:mb-0">
                        {/* Icon Box */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${doc.status === 'valid' ? 'bg-purple-50 text-purple-600' : styles.bg}`}>
                            <FileText className={`w-6 h-6 ${doc.status === 'valid' ? 'text-purple-600' : styles.text}`} />
                        </div>
                        
                        <div>
                            <h4 className="font-bold text-gray-900 text-lg leading-tight mb-1">{doc.title}</h4>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles.bg} ${styles.text} ${styles.border}`}>
                                    {styles.label}
                                </span>
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Expires: {doc.expiry_date || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center self-end">
                        {doc.url && (
                            <button
                            onClick={() => window.open(doc.url!, '_blank')}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="View"
                            >
                                <ExternalLink className="w-5 h-5" />
                            </button>
                        )}

                        <button
                            onClick={() => startEdit(doc)}
                            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <Edit2 className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => handleDelete(doc.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                );
            })}
            </div>
        </div>

        {/* Upload Button */}
        <button
            className="
            group relative w-full overflow-hidden rounded-[24px] 
            bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
            bg-[length:200%_auto] p-5 shadow-xl shadow-indigo-500/30 
            transition-all duration-500 
            hover:bg-right hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-1 
            active:scale-[0.98]
            "
            onClick={() => showScreen('uploadForm')}
        >
             <div className="relative flex items-center justify-center gap-3">
                 <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                    <Plus className="w-6 h-6 text-white" strokeWidth={3} />
                 </div>
                 <span className="text-xl font-bold text-white tracking-wide">
                    Upload New Document
                 </span>
            </div>
        </button>
      </div>

      {/* ✏️ Edit Modal */}
      {editingDoc && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md border border-white/50 overflow-hidden animation-fade-in-up">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-800">Edit Document</h2>
                <button 
                    onClick={() => setEditingDoc(null)}
                    className="p-2 bg-white rounded-full text-gray-400 hover:text-gray-600 shadow-sm border border-gray-100 hover:bg-gray-50"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-6 space-y-5">
                {editError && (
                 <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {editError}
                 </div>
                )}

                {/* Title */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Document Name</label>
                    <input
                    type="text"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="e.g. My Passport"
                    />
                </div>

                {/* Expiry date */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Expiry Date</label>
                    <input
                    type="date"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    value={editExpiryDate || ''}
                    onChange={(e) => setEditExpiryDate(e.target.value)}
                    />
                </div>

                {/* File Replace */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Replace File (Optional)</label>
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {editFile ? (
                                <p className="text-sm text-purple-600 font-semibold">{editFile.name}</p>
                            ) : (
                                <>
                                    <UploadCloud className="w-6 h-6 text-gray-400 mb-1" />
                                    <p className="text-xs text-gray-500">Click to replace file</p>
                                </>
                            )}
                        </div>
                        <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                        />
                    </label>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 pt-2 flex gap-3">
              <button
                className="flex-1 py-3.5 text-sm font-bold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={() => setEditingDoc(null)}
                disabled={savingEdit}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3.5 text-sm font-bold rounded-xl bg-gray-900 text-white shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={handleSaveEdit}
                disabled={savingEdit}
              >
                {savingEdit ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </span>
                ) : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentListScreen;