import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const applicationId = searchParams.get('id');

  if (!applicationId) {
    return NextResponse.json({ error: 'Missing application ID' }, { status: 400 });
  }

  // Use service role to bypass RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('applications')
    .select(`
      id,
      application_number,
      surname,
      first_name,
      middle_name,
      created_at,
      intended_course,
      status,
      assigned_centre:assigned_centre_id(name, state),
      preferred_centre:preferred_centre_id(name, state)
    `)
    .eq('id', applicationId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  // Only return limited fields needed for verification
  return NextResponse.json({
    id: data.id,
    application_number: data.application_number,
    surname: data.surname,
    first_name: data.first_name,
    middle_name: data.middle_name,
    created_at: data.created_at,
    intended_course: data.intended_course,
    status: data.status,
    assigned_centre: data.assigned_centre,
    preferred_centre: data.preferred_centre,
  });
}
