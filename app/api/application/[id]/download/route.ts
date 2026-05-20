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

    // 4. Return the PDF URL saved by the webhook
    const formUrl = (application as any).application_form_url;
    if (!formUrl) {
      return NextResponse.json(
        { message: 'Your application form is not ready yet. Please contact support.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ url: formUrl });

  } catch (error) {
    console.error('Download handler error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
