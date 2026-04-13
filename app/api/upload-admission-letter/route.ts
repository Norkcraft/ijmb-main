import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseServer } from '@/lib/supabaseServer';

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user } } = await anonClient.auth.getUser(token);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    // Verify caller is an admin
    const { data: profile } = await supabaseServer
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'super_admin', 'coordinator'].includes(profile.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const applicationId = formData.get('applicationId') as string | null;

    if (!file || !applicationId) {
      return NextResponse.json({ message: 'Missing file or applicationId' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ message: 'File too large. Max 10 MB.' }, { status: 400 });
    }

    // Only accept PDF
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ message: 'Only PDF files are allowed.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Verify PDF magic bytes (%PDF)
    if (buffer[0] !== 0x25 || buffer[1] !== 0x50 || buffer[2] !== 0x44 || buffer[3] !== 0x46) {
      return NextResponse.json({ message: 'File is not a valid PDF.' }, { status: 400 });
    }

    const storagePath = `admissions/${applicationId}/letter.pdf`;

    const { error: uploadError } = await supabaseServer.storage
      .from('student-documents')
      .upload(storagePath, buffer, { contentType: 'application/pdf', upsert: true });

    if (uploadError) {
      console.error('[upload-admission-letter] Upload error:', uploadError);
      return NextResponse.json({ message: 'Upload failed', error: uploadError.message }, { status: 500 });
    }

    const { error: updateError } = await supabaseServer
      .from('applications')
      .update({ admission_letter_path: storagePath, updated_at: new Date().toISOString() })
      .eq('id', applicationId);

    if (updateError) {
      console.error('[upload-admission-letter] DB update error:', updateError);
      return NextResponse.json({ message: 'Upload succeeded but DB update failed', error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Admission letter uploaded', path: storagePath });
  } catch (err: any) {
    console.error('[upload-admission-letter] Unhandled error:', err);
    return NextResponse.json({ message: err?.message || 'Internal server error' }, { status: 500 });
  }
}
