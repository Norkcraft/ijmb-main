import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { supabaseServer } from '../src/lib/supabaseServer';
import { generateApplicationPDF } from '../src/lib/generateApplicationPDF';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Verify Request Method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // 2. Verify Paystack Signature
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    console.error('PAYSTACK_SECRET_KEY is not defined');
    return res.status(500).json({ message: 'Server Configuration Error' });
  }

  const hash = crypto
    .createHmac('sha512', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(401).json({ message: 'Invalid Signature' });
  }

  const event = req.body;

  // 3. Handle 'charge.success'
  if (event.event === 'charge.success') {
    const { reference, metadata, amount } = event.data;
    const applicationId = metadata?.application_id;
    const paymentType = metadata?.payment_type;

    if (!applicationId) {
      console.warn(`No application_id found in metadata for reference: ${reference}`);
      return res.status(200).json({ message: 'No application ID provided' });
    }

    try {
      // Update Payment Record in DB (if not already done by client)
      // We upsert based on reference to be safe
      const { error: paymentError } = await supabaseServer
        .from('payments')
        .upsert({
          reference,
          user_id: metadata?.user_id, // Ensure user_id is passed in metadata
          application_id: applicationId,
          amount: amount / 100, // Convert kobo to naira
          status: 'success',
          metadata: event.data
        }, { onConflict: 'reference' });

      if (paymentError) {
        console.error('Error recording payment:', paymentError);
      }

      // If it's the Form Fee, update application status and Generate PDF
      if (paymentType === 'form_fee') {
        
        // Update Application Status
        await supabaseServer
          .from('applications')
          .update({ 
            form_fee_paid: true, 
            status: 'submitted',
            updated_at: new Date().toISOString()
          })
          .eq('id', applicationId);

        // Generate PDF
        console.log(`Generating PDF for application: ${applicationId}`);
        try {
          const pdfBuffer = await generateApplicationPDF(applicationId);
          
          // Upload to Supabase Storage
          const fileName = `${applicationId}/application-form.pdf`;
          const { data: uploadData, error: uploadError } = await supabaseServer
            .storage
            .from('student-documents')
            .upload(fileName, pdfBuffer, {
              contentType: 'application/pdf',
              upsert: true
            });

          if (uploadError) {
            console.error('PDF Upload Failed:', uploadError);
          } else {
          // Get Public URL
          const { data: urlData } = supabaseServer
            .storage
            .from('student-documents')
            .getPublicUrl(fileName);

          const publicUrl = urlData.publicUrl;

          // Add a small delay to ensure URL is accessible
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Save URL to Application Record
          const { error: updateError } = await supabaseServer
            .from('applications')
            .update({ application_form_url: publicUrl })
            .eq('id', applicationId);
            
          if (updateError) {
             console.error('Failed to update DB with PDF URL:', updateError);
          } else {
             console.log(`PDF generated and saved: ${publicUrl}`);
          }
          }

        } catch (pdfError) {
          console.error('PDF Generation failed:', pdfError);
          // We swallow the error so we don't fail the webhook response
        }
      }

    } catch (err) {
      console.error('Webhook processing error:', err);
      // Return 200 to acknowledge receipt even if processing failed
      return res.status(200).json({ message: 'Error processing webhook' });
    }
  }

  // Acknowledge receipt
  res.status(200).json({ message: 'Webhook received' });
}
