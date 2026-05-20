import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateApplicationPDF } from '@/lib/generateApplicationPDF';

export const maxDuration = 300;

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function checkAuth(request: NextRequest) {
  const secret = request.headers.get('authorization')?.replace('Bearer ', '');
  return secret === process.env.INTERNAL_API_SECRET;
}

// GET — list applications that paid but have no PDF yet
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('applications')
    .select('id, application_number, surname, first_name, created_at')
    .eq('form_fee_paid', true)
    .or('application_form_url.is.null,application_form_url.eq.')
    .order('created_at');

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ count: data.length, applications: data });
}

// POST — regenerate PDF for one or all missing
// Body: { applicationId: "..." }  — one specific student
// Body: {}                         — all students missing a PDF
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabase();
  const body = await request.json().catch(() => ({}));
  const specificId: string | undefined = body.applicationId;

  // Build list of applications to process
  let applications: { id: string; application_number: string | null }[] = [];

  if (specificId) {
    const { data, error } = await supabase
      .from('applications')
      .select('id, application_number, form_fee_paid')
      .eq('id', specificId)
      .single();

    if (error || !data) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }
    if (!(data as any).form_fee_paid) {
      return NextResponse.json({ message: 'Form fee not paid for this application' }, { status: 400 });
    }
    applications = [data as any];
  } else {
    const { data, error } = await supabase
      .from('applications')
      .select('id, application_number')
      .eq('form_fee_paid', true)
      .or('application_form_url.is.null,application_form_url.eq.')
      .order('created_at');

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    applications = (data as any[]) || [];
  }

  if (applications.length === 0) {
    return NextResponse.json({ message: 'No applications need PDF regeneration', results: [] });
  }

  const results: { id: string; application_number: string | null; status: 'ok' | 'error'; error?: string }[] = [];

  for (const app of applications) {
    try {
      // Generate PDF
      const pdfBuffer = await generateApplicationPDF(app.id);

      // Upload to student-documents bucket
      const fileName = `${app.id}/application-form.pdf`;
      const { error: uploadError } = await supabase.storage
        .from('student-documents')
        .upload(fileName, pdfBuffer, { contentType: 'application/pdf', upsert: true });

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      // Get public URL and save to application record
      const { data: urlData } = supabase.storage
        .from('student-documents')
        .getPublicUrl(fileName);

      await supabase
        .from('applications')
        .update({ application_form_url: urlData.publicUrl, updated_at: new Date().toISOString() })
        .eq('id', app.id);

      results.push({ id: app.id, application_number: app.application_number, status: 'ok' });
    } catch (err: any) {
      console.error(`PDF generation failed for ${app.id}:`, err);
      results.push({ id: app.id, application_number: app.application_number, status: 'error', error: err?.message });
    }
  }

  const succeeded = results.filter(r => r.status === 'ok').length;
  const failed = results.filter(r => r.status === 'error').length;

  return NextResponse.json({ message: `Done: ${succeeded} succeeded, ${failed} failed`, results });
}
