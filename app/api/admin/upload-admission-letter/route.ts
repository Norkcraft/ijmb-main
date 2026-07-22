import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
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
  if (authError || !user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['super_admin', 'admin', 'coordinator'].includes(profile.role)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const applicationId = formData.get('applicationId') as string | null;

  if (!file || !applicationId) {
    return NextResponse.json({ message: 'Missing file or applicationId' }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ message: 'File too large (max 10MB)' }, { status: 400 });
  }

  const path = `${applicationId}/admission-letter.pdf`;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error: uploadError } = await supabase.storage
    .from('student-documents')
    .upload(path, buffer, { contentType: 'application/pdf', upsert: true });

  if (uploadError) {
    return NextResponse.json({ message: uploadError.message }, { status: 500 });
  }

  const { error: updateError } = await supabase
    .from('applications')
    .update({ admission_letter_path: path, updated_at: new Date().toISOString() })
    .eq('id', applicationId);

  if (updateError) {
    return NextResponse.json({ message: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ path });
}
