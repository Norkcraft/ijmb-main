import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';
import { supabaseServer as supabase } from './supabaseServer';
import { generateQRCodeBase64 } from './generateQRCode';
import { buildApplicationFormHTML } from './applicationFormTemplate';
import { generateApplicationId } from './generateApplicationId';
import fs from 'fs';
import path from 'path';

/**
 * Generates a PDF buffer for a given application ID.
 * 
 * @param applicationId The UUID of the application
 * @returns Buffer of the generated PDF
 */
export const generateApplicationPDF = async (applicationId: string): Promise<Buffer> => {
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;
  
  try {
    // 1. Fetch Application Data
    const { data: app, error: appError } = await supabase
      .from('applications')
      .select(`
        id, application_number, created_at, status,
        surname, first_name, middle_name, gender, date_of_birth,
        state_of_origin, lga, guardian_phone, residential_address,
        intended_course, passport_path, form_fee_paid,
        profiles:user_id ( email, phone ),
        sessions:session_id ( name, code ),
        assigned_centre:assigned_centre_id ( name, state, location ),
        preferred_centre:preferred_centre_id ( name, state, location ),
        subject_combinations:subject_combination_id ( name, subject1, subject2, subject3 )
      `)
      .eq('id', applicationId)
      .single();

    if (appError || !app) {
      throw new Error(`Failed to fetch application: ${appError?.message || 'Not found'}`);
    }
    const appData = app as any;

    // Fetch O-Level results
    const { data: olevelRows } = await supabase
      .from('olevel_results')
      .select('subject, grade, exam_type, exam_year')
      .eq('application_id', applicationId)
      .order('created_at');

    // Fetch form_fee payment for reference/date
    const { data: feePayment } = await supabase
      .from('payments')
      .select('reference, created_at, amount')
      .eq('application_id', applicationId)
      .eq('type', 'form_fee')
      .eq('status', 'success')
      .order('created_at')
      .limit(1)
      .maybeSingle();

    // 2. Fetch Passport Photo (Convert to Base64)
    let passportBase64 = '';
    if (appData.passport_path) {
      try {
        const { data: photoData, error: photoError } = await supabase.storage
          .from('student-documents')
          .download(appData.passport_path);

        if (photoError) throw photoError;

        if (photoData) {
          const arrayBuffer = await photoData.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const mimeType = photoData.type || 'image/jpeg';
          passportBase64 = `data:${mimeType};base64,${buffer.toString('base64')}`;
        }
      } catch (err) {
        console.warn('Failed to load passport photo:', err);
      }
    }

    // 3. Load Site Logo
    let logoBase64 = '';
    try {
      const logoPath = path.resolve(process.cwd(), 'public', 'ijmb-logo.jpeg');
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        logoBase64 = `data:image/jpeg;base64,${logoBuffer.toString('base64')}`;
      } else {
        const fallbackPath = path.resolve(process.cwd(), 'public', 'placeholder.svg');
        if (fs.existsSync(fallbackPath)) {
          const logoBuffer = fs.readFileSync(fallbackPath);
          logoBase64 = `data:image/svg+xml;base64,${logoBuffer.toString('base64')}`;
        }
      }
    } catch (err) {
      console.warn('Failed to load site logo:', err);
    }

    // 4. Generate QR Code
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ijmb.info';
    const verifyUrl = `${siteUrl}/verify/${applicationId}`;
    const qrCodeBase64 = await generateQRCodeBase64(verifyUrl);

    // 5. Generate Application ID
    const displayId = appData.application_number || generateApplicationId(1000);

    // 6. Build HTML
    const sc = appData.subject_combinations;
    const htmlContent = buildApplicationFormHTML({
      applicationId: displayId,
      registrationDate: new Date(appData.created_at).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'long', year: 'numeric'
      }),
      academicSession: appData.sessions?.name || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
      surname: appData.surname || '',
      firstName: appData.first_name || '',
      middleName: appData.middle_name || '',
      gender: appData.gender || '',
      dateOfBirth: appData.date_of_birth ? new Date(appData.date_of_birth).toLocaleDateString('en-GB') : '',
      stateOfOrigin: appData.state_of_origin || '',
      lga: appData.lga || '',
      phoneNumber: appData.guardian_phone || appData.profiles?.phone || '',
      email: appData.profiles?.email || '',
      residentialAddress: appData.residential_address || '',
      centreOfStudy: (() => { const c = appData.assigned_centre || appData.preferred_centre; return c ? `${c.name}${c.location ? ', ' + c.location : ''}, ${c.state}` : 'Not Assigned'; })(),
      courseOfChoice: appData.intended_course || '',
      subjectCombination: sc ? sc.name : 'Pending',
      subject1: sc?.subject1 || '',
      subject2: sc?.subject2 || '',
      subject3: sc?.subject3 || '',
      olevelResults: (olevelRows || []).map((r: any) => ({
        subject: r.subject || '',
        grade: r.grade || '—',
        examYear: r.exam_year || '—',
        examType: r.exam_type || '—',
      })),
      paymentReference: feePayment?.reference || '',
      paymentDate: feePayment?.created_at
        ? new Date(feePayment.created_at).toLocaleDateString('en-GB')
        : '',
      amountPaid: feePayment?.amount ? `₦${Number(feePayment.amount).toLocaleString()}` : '',
      passportPhotoBase64: passportBase64,
      qrCodeBase64: qrCodeBase64,
      logoBase64: logoBase64,
    });

    // 7. Launch Puppeteer (Optimized for Serverless)
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      // Vercel / AWS Lambda environment
      const executablePath = await chromium.executablePath(
        'https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar'
      );
      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: executablePath || undefined,
        headless: true,
      });
    } else {
      // Local development
      // We need to use the full puppeteer here or point to local chrome
      // Since we switched to puppeteer-core, we must provide executablePath locally too
      // or assume the user has chrome installed.
      // To simplify, we can try to find a local chrome installation or use a hardcoded path for dev
      // OR better: In dev, we can import 'puppeteer' dynamically if available, but that's messy.
      
      // Recommendation: For dev, use a fixed path to Chrome or install full puppeteer as dev dependency
      // and use its executable path.
      
      // Let's try to locate Chrome automatically or fallback to a known path
      const localChrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"; // Windows default
      
      browser = await puppeteer.launch({
        executablePath: fs.existsSync(localChrome) ? localChrome : undefined,
        channel: 'chrome', // Try to use installed chrome
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // 8. Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0px',
        bottom: '0px',
        left: '0px',
        right: '0px'
      }
    });

    return Buffer.from(pdfBuffer);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
