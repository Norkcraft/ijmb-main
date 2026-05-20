import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';


export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ message: 'Missing application ID' }, { status: 400 });
  }

  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 1. Verify user
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // 2. Fetch application — verify ownership and payment status
    const { data: application, error: appError } = await supabaseServer
      .from('applications')
      .select('id, user_id, form_fee_paid, application_number, application_form_url')
      .eq('id', id)
      .single();

    if (appError || !application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    if ((application as any).user_id !== user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // 3. Block access if form fee not paid
    if (!(application as any).form_fee_paid) {
      return NextResponse.json(
        { message: 'Form fee not paid. Please complete payment to download the form.' },
        { status: 403 }
      );
    }

    // 4. Generate a short-lived signed URL for the shared application form
    const { data: signedData, error: signedError } = await supabaseServer
      .storage
      .from('student-documents')
      .createSignedUrl('application-form.pdf', 120, { download: 'IJMB-Application-Form.pdf' });

    if (signedError || !signedData?.signedUrl) {
      console.error('Signed URL error:', signedError);
      return NextResponse.json({ message: 'Could not generate download link. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ url: signedData.signedUrl });

  } catch (error) {
    console.error('Download handler error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
