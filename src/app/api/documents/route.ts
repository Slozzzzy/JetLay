// src/app/api/documents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { computeStatus } from '@/lib/documentStatus'; 
import { createCalendarEventForDocument } from '@/lib/googleCalendar';


// Keep this in sync with your DB schema
interface DocumentRow {
  id: string;
  user_id: string;
  title: string;
  expiry_date: string | null;
  document_type: string;
  storage_path: string | null;
  created_at: string;
  google_calendar_event_id?: string | null;
}

type DocumentStatus = 'valid' | 'expiring' | 'expired';

interface DocumentResponse {
  id: string;
  title: string;
  expiry_date: string | null;
  document_type: string;
  status: DocumentStatus;
  url: string | null;
}

// GET /api/documents?userId=xxxx
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

  if (error || !data) {
    console.error('Fetch documents error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }

  const rows = data as DocumentRow[];

  const docs: DocumentResponse[] = await Promise.all(
    rows.map(async (doc) => {
      let signedUrl: string | null = null;

      if (doc.storage_path) {
        const { data: signed, error: signedError } = await supabase.storage
          .from('documents')
          .createSignedUrl(doc.storage_path, 60 * 60); // 1 hour

        if (!signedError && signed) {
          signedUrl = signed.signedUrl;
        } else if (signedError) {
          console.warn(
            `Failed to create signed URL for doc ${doc.id}:`,
            signedError
          );
        }
      }

      return {
        id: doc.id,
        title: doc.title,
        expiry_date: doc.expiry_date,
        document_type: doc.document_type,
        // ⬇️ pass BOTH arguments that computeStatus expects
        status: computeStatus(doc.expiry_date, doc.document_type) as DocumentStatus,
        url: signedUrl,
      };
    })
  );

  return NextResponse.json(docs);
}

// POST /api/documents
export async function POST(req: NextRequest) {
  const supabase = supabaseServer;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const {
    userId,
    title,
    expiryDate,
    documentType,
    storagePath,
  } = body as {
    userId?: string;
    title?: string;
    expiryDate?: string;
    documentType?: string;
    storagePath?: string;
  };

  if (!userId || !title || !expiryDate || !documentType || !storagePath) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('documents')
    .insert({
      user_id: userId,
      title,
      expiry_date: expiryDate,
      document_type: documentType,
      storage_path: storagePath,
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Insert document error:', error);
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }

  // 👇 NEW: create event in Google Calendar
  const eventId = await createCalendarEventForDocument({
    id: data.id,
    title: data.title,
    expiry_date: data.expiry_date,
    document_type: data.document_type,
  });

  if (eventId) {
    await supabase
      .from('documents')
      .update({ google_calendar_event_id: eventId })
      .eq('id', data.id);
  }

  return NextResponse.json(data, { status: 201 });
}



