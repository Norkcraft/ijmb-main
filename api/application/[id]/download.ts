import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseServer } from '../../../src/lib/supabaseServer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Verify Request Method
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // 2. Extract Application ID
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Missing application ID' });
  }

  // 3. Verify Authentication
  // We need to extract the JWT token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 4. Verify User Token with Supabase
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);

    if (authError || !user) {
      console.error('Auth error:', authError);
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    // 5. Fetch Application and Verify Ownership
    const { data: application, error: appError } = await supabaseServer
      .from('applications')
      .select('id, user_id, application_form_url, application_number')
      .eq('id', id)
      .single();

    if (appError || !application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.user_id !== user.id) {
      return res.status(403).json({ message: 'Forbidden: You do not own this application' });
    }

    // 6. Check if PDF URL exists
    if (!application.application_form_url) {
      return res.status(404).json({ message: 'Application form not yet generated' });
    }

    // 7. Fetch the PDF file
    // Since it's a public URL in Supabase, we can just fetch it
    const response = await fetch(application.application_form_url);
    
    if (!response.ok) {
      console.error('Failed to fetch PDF from storage:', response.statusText);
      return res.status(500).json({ message: 'Failed to retrieve PDF file' });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 8. Stream the file back to the client
    const displayId = application.application_number || id.substring(0, 8);
    const filename = `IJMB-Application-${displayId}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length.toString());
    
    return res.status(200).send(buffer);

  } catch (error) {
    console.error('Download handler error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
