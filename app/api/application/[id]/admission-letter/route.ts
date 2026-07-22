import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Verify this application belongs to the requesting student
  const { data: app } = await supabase
    .from('applications')
    .select('id, user_id, admission_letter_path')
    .eq('id', id)
    .single();

  if (!app || app.user_id !== user.id) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  if (!app.admission_letter_path) {
    return NextResponse.json({ message: 'No admission letter uploaded yet' }, { status: 404 });
  }

  // Service role bypasses storage RLS — generate signed URL for 10 minutes
  const { data, error } = await supabase.storage
    .from('student-documents')
    .createSignedUrl(app.admission_letter_path, 600);

  if (error || !data?.signedUrl) {
    return NextResponse.json({ message: 'Could not generate download link' }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl });
}
