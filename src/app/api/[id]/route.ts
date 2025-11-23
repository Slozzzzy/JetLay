import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseRouteClient } from '@/lib/supabaseRouteClient';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function DELETE(
  _req: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;  // ✅ MUST await
  const supabase = getSupabaseRouteClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 1) get doc to know storage_path
  const { data: doc, error: docError } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)                   // ✅ use id, not params.id
    .single();

  if (docError || !doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  // 2) delete file
  const { error: storageError } = await supabase.storage
    .from('documents')
    .remove([doc.storage_path]);

  if (storageError) {
    console.error(storageError);
    return NextResponse.json(
      { error: 'Failed to delete file from storage' },
      { status: 500 }
    );
  }

  // 3) delete row
  const { error: deleteError } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error(deleteError);
    return NextResponse.json(
      { error: 'Failed to delete document record' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
