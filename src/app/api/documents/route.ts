import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { computeStatus } from '@/lib/documentStatus';

export async function GET(req: NextRequest) {
  const supabase = supabaseServer;

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('GET /api/documents error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }

  const docsWithMaybeNulls = await Promise.all(
    (data ?? []).map(async (doc) => {
      let signedUrl: string | null = null;

      if (doc.storage_path) {
        const { data: signed, error: urlError } = await supabase.storage
          .from('documents')
          .createSignedUrl(doc.storage_path, 60 * 60);

        if (urlError) {
          // If the object is missing, just skip this document
          if ((urlError as any).statusCode === '404') {
            console.warn(
              `Object not found for doc ${doc.id}, path ${doc.storage_path} – skipping`
            );
            return null;            // <<-- SKIP THIS ROW
          }

          console.warn(
            `Signed URL error – doc ${doc.id}, path ${doc.storage_path}: ${urlError.message}`
          );
          // for other errors, keep doc but without url
        } else {
          signedUrl = signed?.signedUrl ?? null;
        }
      }

      return {
        id: doc.id,
        title: doc.title,
        expiry_date: doc.expiry_date,
        document_type: doc.document_type,
        status: computeStatus(doc.expiry_date, doc.document_type),
        url: signedUrl,
      };
    })
  );

  const docs = docsWithMaybeNulls.filter(Boolean); // remove nulls

  return NextResponse.json(docs);
}


// ✅ POST /api/documents
// Body: { userId, title, expiryDate, documentType, storagePath }
export async function POST(req: NextRequest) {
  const supabase = supabaseServer;

  const body = await req.json();
  const { userId, title, expiryDate, documentType, storagePath } = body;

  // We now require storagePath (the one used by the client upload)
  if (!userId || !title || !expiryDate || !storagePath) {
    return NextResponse.json(
      { error: 'userId, title, expiryDate, storagePath are required' },
      { status: 400 }
    );
  }

  console.log('📁 POST /api/documents storagePath =>', storagePath);

  const { data: inserted, error: insertError } = await supabase
    .from('documents')
    .insert({
      user_id: userId,
      title,
      expiry_date: expiryDate,
      document_type: documentType,
      storage_path: storagePath, // DO NOT CHANGE – must match upload path
    })
    .select()
    .single();

  if (insertError || !inserted) {
    console.error('Insert document error:', insertError);
    return NextResponse.json(
      { error: 'Failed to create document record' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    id: inserted.id,
    storagePath,
  });
}
