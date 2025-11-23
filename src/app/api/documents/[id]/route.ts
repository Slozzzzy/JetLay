// src/app/api/documents/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } 
) {
  const { id: docId } = await context.params;   
  const supabase = supabaseServer;            
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!docId) {
    return NextResponse.json({ error: 'Missing document id' }, { status: 400 });
  }

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  // 1) Load the document, ensure it belongs to this user
  const { data: doc, error: fetchError } = await supabase
    .from('documents')
    .select('*')
    .eq('id', docId)
    .eq('user_id', userId)
    .single();

  if (fetchError || !doc) {
    console.error('Fetch document before delete error:', fetchError);
    return NextResponse.json(
      { error: 'Document not found' },
      { status: 404 }
    );
  }

  // 2) Delete from storage (ignore not-found errors)
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

  // 3) Delete from database
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
