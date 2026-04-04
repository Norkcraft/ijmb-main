import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseServer } from '@/lib/supabaseServer';
import { generateApplicationPDF } from '@/lib/generateApplicationPDF';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // 1. Verify Admin Auth
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Verify the user has an admin role before proceeding
  const { data: profile, error: profileError } = await supabaseServer
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || !['super_admin', 'coordinator'].includes(profile.role)) {
    return res.status(403).json({ message: 'Forbidden: admin access required' });
  }

  const { applicationId } = req.body;
  if (!applicationId) {
    return res.status(400).json({ message: 'Missing applicationId' });
  }

  try {
    console.log(`Manually generating PDF for: ${applicationId}`);
    const pdfBuffer = await generateApplicationPDF(applicationId);
    
    // Upload
    const fileName = `${applicationId}/application-form.pdf`;
    const { error: uploadError } = await supabaseServer
      .storage
      .from('student-documents')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Get URL
    const { data: urlData } = supabaseServer
      .storage
      .from('student-documents')
      .getPublicUrl(fileName);

    // Save to DB
    await supabaseServer
      .from('applications')
      .update({ application_form_url: urlData.publicUrl })
      .eq('id', applicationId);

    return res.status(200).json({ url: urlData.publicUrl });

  } catch (error: any) {
    console.error('Manual generation failed:', error);
    return res.status(500).json({ message: error.message });
  }
}
