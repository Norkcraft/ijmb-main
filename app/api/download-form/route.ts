import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ message: 'Missing application ID' }, { status: 400 });
  }

  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // 1. Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // 2. Verify ownership and payment
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('id, user_id, form_fee_paid')
      .eq('id', id)
      .single();

    if (appError || !application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    if (application.user_id !== user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    if (!application.form_fee_paid) {
      return NextResponse.json(
        { message: 'Form fee not paid. Please complete payment to download the form.' },
        { status: 403 }
      );
    }

    // 3. Generate signed URL for the shared application form
    const { data: signedData, error: signedError } = await supabase
      .storage
      .from('protected-forms')
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
