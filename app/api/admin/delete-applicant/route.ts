import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

  // Verify the caller is an admin
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['super_admin', 'admin'].includes(profile.role)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const { applicationId, userId } = await req.json();
  if (!applicationId || !userId) {
    return NextResponse.json({ message: 'Missing applicationId or userId' }, { status: 400 });
  }

  // Prevent admin from deleting themselves
  if (userId === user.id) {
    return NextResponse.json({ message: 'You cannot delete your own account' }, { status: 400 });
  }

  try {
    // Delete related records (cascade may handle some, but be explicit)
    await supabase.from('document_requests').delete().eq('application_id', applicationId);
    await supabase.from('olevel_results').delete().eq('application_id', applicationId);
    await supabase.from('payments').delete().eq('application_id', applicationId);
    await supabase.from('applications').delete().eq('id', applicationId);

    // Delete files from storage
    const { data: files } = await supabase.storage.from('student-documents').list(userId);
    if (files && files.length > 0) {
      const paths = files.map(f => `${userId}/${f.name}`);
      await supabase.storage.from('student-documents').remove(paths);
    }
    // Also delete application-specific folder
    const { data: appFiles } = await supabase.storage.from('student-documents').list(applicationId);
    if (appFiles && appFiles.length > 0) {
      const appPaths = appFiles.map(f => `${applicationId}/${f.name}`);
      await supabase.storage.from('student-documents').remove(appPaths);
    }

    // Delete profile and auth user
    await supabase.from('profiles').delete().eq('id', userId);
    await supabase.auth.admin.deleteUser(userId);

    return NextResponse.json({ message: 'Applicant deleted successfully' });
  } catch (err: any) {
    console.error('[delete-applicant] Error:', err);
    return NextResponse.json({ message: err?.message || 'Failed to delete applicant' }, { status: 500 });
  }
}
