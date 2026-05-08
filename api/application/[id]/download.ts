import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseServer } from '../../../src/lib/supabaseServer';

const BLANK_FORM_BUCKET = 'protected-forms';
const BLANK_FORM_PATH   = 'application-form.pdf';
const SIGNED_URL_EXPIRY = 60; // seconds

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Missing application ID' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 1. Verify user
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    // 2. Fetch application — verify ownership and payment status
    const { data: application, error: appError } = await supabaseServer
      .from('applications')
      .select('id, user_id, form_fee_paid, application_number')
      .eq('id', id)
      .single();

    if (appError || !application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.user_id !== user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // 3. Block access if form fee not paid
    if (!application.form_fee_paid) {
      return res.status(403).json({ message: 'Form fee not paid. Please complete payment to download the form.' });
    }

    // 4. Generate a short-lived signed URL for the blank form in private storage
    const { data: signedData, error: signedError } = await supabaseServer
      .storage
      .from(BLANK_FORM_BUCKET)
      .createSignedUrl(BLANK_FORM_PATH, SIGNED_URL_EXPIRY, { download: 'IJMB-Application-Form.pdf' });

    if (signedError || !signedData?.signedUrl) {
      console.error('Signed URL error:', signedError);
      return res.status(500).json({ message: 'Could not generate download link. Please try again.' });
    }

    return res.status(200).json({ url: signedData.signedUrl });

  } catch (error) {
    console.error('Download handler error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
