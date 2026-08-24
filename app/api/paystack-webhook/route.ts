import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseServer } from '@/lib/supabaseServer';
import { sendEmail } from '@/lib/resendClient';
import { paymentConfirmationEmail, applicationSubmittedEmail } from '@/lib/emailTemplates';

// Allow GET so Paystack can verify the endpoint URL is reachable
export async function GET() {
  return NextResponse.json({ message: 'Webhook endpoint active' });
}

export async function POST(request: NextRequest) {
  // 1. Verify Paystack Signature
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    console.error('PAYSTACK_SECRET_KEY is not defined');
    return NextResponse.json({ message: 'Server Configuration Error' }, { status: 500 });
  }

  const body = await request.text();
  const hash = crypto
    .createHmac('sha512', secret)
    .update(body)
    .digest('hex');

  const signature = request.headers.get('x-paystack-signature') || '';
  let signaturesMatch = false;
  try {
    signaturesMatch = crypto.timingSafeEqual(
      Buffer.from(hash, 'hex'),
      Buffer.from(signature, 'hex')
    );
  } catch {
    signaturesMatch = false;
  }
  if (!signaturesMatch) {
    return NextResponse.json({ message: 'Invalid Signature' }, { status: 401 });
  }

  const event = JSON.parse(body);

  // 2. Handle 'charge.success'
  if (event.event === 'charge.success') {
    const { reference, metadata, amount } = event.data;
    const applicationId = metadata?.application_id;
    const paymentType = metadata?.payment_type;

    if (!applicationId) {
      console.warn(`No application_id found in metadata for reference: ${reference}`);
      return NextResponse.json({ message: 'No application ID provided' });
    }

    try {
      // Record payment
      const { error: paymentError } = await supabaseServer
        .from('payments')
        .upsert({
          reference,
          user_id: metadata?.user_id,
          application_id: applicationId,
          amount: amount / 100,
          type: paymentType || 'form_fee',
          fee_type: paymentType || 'form_fee',
          status: 'success',
          metadata: event.data
        }, { onConflict: 'reference' });

      if (paymentError) {
        console.error('Error recording payment:', paymentError);
      }

      // Fetch user profile for email notifications
      let userEmail = '';
      let userFullName = '';
      if (metadata?.user_id) {
        const { data: profile } = await supabaseServer
          .from('profiles')
          .select('full_name')
          .eq('id', metadata.user_id)
          .single();
        userFullName = profile?.full_name || 'Student';

        const { data: authUser } = await supabaseServer.auth.admin.getUserById(metadata.user_id);
        userEmail = authUser?.user?.email || '';
      }

      // Send payment confirmation email
      if (userEmail) {
        const amountNaira = Math.round(amount / 100);
        const { html, subject } = paymentConfirmationEmail(
          userFullName,
          amountNaira,
          reference,
          paymentType || 'payment'
        );
        await sendEmail({ to: userEmail, subject, html });
      }

      // Update application fields based on payment type
      if (paymentType === 'acceptance_fee') {
        await supabaseServer
          .from('applications')
          .update({ status: 'fees_pending', updated_at: new Date().toISOString() })
          .eq('id', applicationId);
      }

      if (paymentType === 'hostel_fee') {
        await supabaseServer
          .from('applications')
          .update({ hostel_fee_paid: true, updated_at: new Date().toISOString() })
          .eq('id', applicationId);
      }

      if (paymentType === 'tuition_fee') {
        const amountNaira = amount / 100;
        await supabaseServer
          .from('applications')
          .update({
            tuition_payment_status: 'fully_paid',
            tuition_amount_paid: amountNaira,
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('id', applicationId);
      }

      // If it's the Form Fee, update application and generate PDF
      if (paymentType === 'form_fee') {
        await supabaseServer
          .from('applications')
          .update({
            form_fee_paid: true,
            status: 'submitted',
            updated_at: new Date().toISOString()
          })
          .eq('id', applicationId);

        // Generate PDF (lazy-load to avoid heavy puppeteer import)
        console.log(`Generating PDF for application: ${applicationId}`);
        try {
          const { generateApplicationPDF } = await import('@/lib/generateApplicationPDF');
          const pdfBuffer = await generateApplicationPDF(applicationId);

          const fileName = `${applicationId}/application-form.pdf`;
          const { error: uploadError } = await supabaseServer
            .storage
            .from('student-documents')
            .upload(fileName, pdfBuffer, { contentType: 'application/pdf', upsert: true });

          if (uploadError) {
            console.error('PDF Upload Failed:', uploadError);
          } else {
            const { data: urlData } = supabaseServer
              .storage
              .from('student-documents')
              .getPublicUrl(fileName);

            await new Promise(resolve => setTimeout(resolve, 1000));

            const { error: updateError } = await supabaseServer
              .from('applications')
              .update({ application_form_url: urlData.publicUrl })
              .eq('id', applicationId);

            if (updateError) console.error('Failed to update DB with PDF URL:', updateError);
            else console.log(`PDF generated and saved: ${urlData.publicUrl}`);
          }
        } catch (pdfError) {
          console.error('PDF Generation failed:', pdfError);
        }

        // Send application submitted email
        if (userEmail) {
          try {
            const { data: appData } = await supabaseServer
              .from('applications')
              .select('id, preferred_centre_id, subject_combination_id, centres(name), subject_combinations(name)')
              .eq('id', applicationId)
              .single();

            const centreName = (appData as any)?.centres?.name || 'To be assigned';
            const subjectsName = (appData as any)?.subject_combinations?.name || 'As selected';

            const { html, subject } = applicationSubmittedEmail(
              userFullName,
              applicationId,
              centreName,
              subjectsName
            );
            await sendEmail({ to: userEmail, subject, html });
          } catch (emailErr) {
            console.error('Failed to send application submitted email:', emailErr);
          }
        }
      }

    } catch (err) {
      console.error('Webhook processing error:', err);
      return NextResponse.json({ message: 'Error processing webhook' });
    }
  }

  return NextResponse.json({ message: 'Webhook received' });
}
