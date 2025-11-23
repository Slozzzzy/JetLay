import React, { useEffect, useState } from 'react';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';

type DocumentStatus = 'valid' | 'expiring' | 'expired';

interface DocumentItem {
  id: string;
  title: string;
  expiry_date: string;
  document_type: string;
  status: DocumentStatus;
  url: string | null;
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

  useEffect(() => {
    if (!profile?.id) return;

    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/documents?userId=${profile.id}`);
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
    };

    fetchDocuments();
  }, [profile]);

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
                    • Expires: {doc.expiry_date}
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
    </div>
  );
};

export default DocumentListScreen;
