import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 15;

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

    const { applicationId } = await request.json();
    if (!applicationId) return NextResponse.json({ message: 'Missing applicationId' }, { status: 400 });

    // Use service role if available, otherwise user token
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const db = serviceRoleKey
      ? createClient(supabaseUrl, serviceRoleKey)
      : createClient(supabaseUrl, anonKey, {
          global: { headers: { Authorization: `Bearer ${token}` } },
        });

    // Fetch flat application data
    const { data: app, error: appErr } = await db
      .from('applications')
      .select('id, application_number, created_at, user_id, session_id, assigned_centre_id, preferred_centre_id, subject_combination_id, surname, first_name, middle_name, gender, date_of_birth, state_of_origin, lga, guardian_phone, residential_address, intended_course, passport_path')
      .eq('id', applicationId)
      .single();

    if (appErr || !app) return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    if ((app as any).user_id !== user.id) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const a = app as any;

    // Parallel lookups
    const [profileRes, sessionRes, assignedRes, preferredRes, subjectRes, olevelRes, feeRes] = await Promise.all([
      a.user_id ? db.from('profiles').select('email, phone').eq('id', a.user_id).single() : Promise.resolve({ data: null }),
      a.session_id ? db.from('sessions').select('name').eq('id', a.session_id).single() : Promise.resolve({ data: null }),
      a.assigned_centre_id ? db.from('centres').select('name, state, location').eq('id', a.assigned_centre_id).single() : Promise.resolve({ data: null }),
      a.preferred_centre_id ? db.from('centres').select('name, state, location').eq('id', a.preferred_centre_id).single() : Promise.resolve({ data: null }),
      a.subject_combination_id ? db.from('subject_combinations').select('name, track').eq('id', a.subject_combination_id).single() : Promise.resolve({ data: null }),
      db.from('olevel_results').select('subject, grade, exam_type, exam_year').eq('application_id', applicationId).order('created_at'),
      db.from('payments').select('reference, created_at, amount').eq('application_id', applicationId).eq('type', 'form_fee').eq('status', 'success').order('created_at').limit(1).maybeSingle(),
    ]);

    // Passport photo as base64
    let passportBase64 = '';
    if (a.passport_path) {
      try {
        const { data: photoData } = await db.storage.from('student-documents').download(a.passport_path);
        if (photoData) {
          const buf = Buffer.from(await photoData.arrayBuffer());
          passportBase64 = `data:${photoData.type || 'image/jpeg'};base64,${buf.toString('base64')}`;
        }
      } catch { /* skip if unavailable */ }
    }

    const profile = (profileRes.data as any) || {};
    const session = (sessionRes.data as any) || {};
    const centre = (assignedRes.data as any) || (preferredRes.data as any) || null;
    const sc = (subjectRes.data as any) || null;
    const olevel = (olevelRes.data as any[]) || [];
    const fee = (feeRes.data as any) || null;

    return NextResponse.json({
      applicationId: a.application_number || a.id.split('-')[0].toUpperCase(),
      rawId: a.id,
      registrationDate: a.created_at,
      academicSession: session.name || '',
      surname: a.surname || '',
      firstName: a.first_name || '',
      middleName: a.middle_name || '',
      gender: a.gender || '',
      dateOfBirth: a.date_of_birth || '',
      stateOfOrigin: a.state_of_origin || '',
      lga: a.lga || '',
      phoneNumber: a.guardian_phone || profile.phone || '',
      email: profile.email || '',
      residentialAddress: a.residential_address || '',
      centreOfStudy: centre ? `${centre.name}${centre.location ? ', ' + centre.location : ''}, ${centre.state}` : 'Not Assigned',
      courseOfChoice: a.intended_course || '',
      subjectCombination: sc ? `${sc.name}${sc.track ? ' (' + sc.track + ')' : ''}` : 'Pending',
      olevelResults: olevel.map((r: any) => ({ subject: r.subject, grade: r.grade, examYear: r.exam_year, examType: r.exam_type })),
      paymentReference: fee?.reference || '',
      paymentDate: fee?.created_at || '',
      amountPaid: fee?.amount ? `₦${Number(fee.amount).toLocaleString()}` : '',
      passportPhotoBase64: passportBase64,
    });
  } catch (err: any) {
    console.error('[application-pdf] Error:', err);
    return NextResponse.json({ message: err?.message || 'Failed to load data' }, { status: 500 });
  }
}
