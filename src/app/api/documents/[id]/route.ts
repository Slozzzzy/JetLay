import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { updateCalendarEventForDocument, deleteCalendarEvent } from '@/lib/googleCalendar';


type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { id: docId } = await params;
  const supabase = supabaseServer;
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!docId) {
    return NextResponse.json({ error: 'Missing document id' }, { status: 400 });
  }

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  // 1) Ensure doc belongs to this user
  const { data: doc, error: fetchError } = await supabase
    .from('documents')
    .select('*')
    .eq('id', docId)
    .eq('user_id', userId)
    .single();

  if (fetchError || !doc) {
    console.error('Fetch document before delete error:', fetchError);
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  //Delete calendar event if exists
  if (doc.google_calendar_event_id) {
    await deleteCalendarEvent(doc.google_calendar_event_id);
  }
  // 2) Delete from storage (ignore "not found")
  if (doc.storage_path) {
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([doc.storage_path]);

    if (storageError) {
      console.warn(
        `Failed to delete storage object for doc ${docId}, path ${doc.storage_path}:`,
        storageError
      );
    }
  }

  // 3) Delete DB row
  const { error: deleteError } = await supabase
    .from('documents')
    .delete()
    .eq('id', docId)
    .eq('user_id', userId);

  if (deleteError) {
    console.error('Delete document row error:', deleteError);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

// PATCH /api/documents/[id]?userId=xxxx
// Used to update metadata + (optionally) storage_path for file replace
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { id: docId } = await params;
  const supabase = supabaseServer;
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!docId) {
    return NextResponse.json({ error: 'Missing document id' }, { status: 400 });
  }

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { title, expiryDate, documentType, storagePath } = body as {
    title?: string;
    expiryDate?: string | null;
    documentType?: string;
    storagePath?: string | null;
  };

  const updates: Record<string, unknown> = {};

  if (typeof title === 'string') {
    updates.title = title;
  }
  if (typeof expiryDate === 'string' || expiryDate === null) {
    updates.expiry_date = expiryDate;
  }
  if (typeof documentType === 'string') {
    updates.document_type = documentType;
  }
  if (typeof storagePath === 'string' || storagePath === null) {
    updates.storage_path = storagePath;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: 'No fields to update' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('documents')
    .update(updates)
    .eq('id', docId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error || !data) {
    console.error('Update document error:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
  if (data.google_calendar_event_id && data.expiry_date) {
    await updateCalendarEventForDocument(data.google_calendar_event_id, {
      id: data.id,
      title: data.title,
      expiry_date: data.expiry_date,
      document_type: data.document_type,
    });
  }

  return NextResponse.json(data);
}
