import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';
import { createClient } from '@supabase/supabase-js';
import { generateQRCodeBase64 } from './generateQRCode';
import { buildApplicationFormHTML } from './applicationFormTemplate';
import { generateApplicationId } from './generateApplicationId';
import fs from 'fs';
import path from 'path';

/**
 * Generates a PDF buffer for a given application ID.
 *
 * @param applicationId The UUID of the application
 * @param userToken The user's auth token (used to access data through RLS)
 * @returns Buffer of the generated PDF
 */
export const generateApplicationPDF = async (applicationId: string, userToken?: string): Promise<Buffer> => {
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;

  // Build a supabase client: prefer service role (bypasses RLS), fall back to user token
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey)
    : createClient(supabaseUrl, anonKey, {
        global: { headers: userToken ? { Authorization: `Bearer ${userToken}` } : {} },
      });

  try {
    // 1. Fetch Application Data (flat columns only — no embedded joins to avoid PostgREST coercion errors)
    const { data: app, error: appError } = await supabase
      .from('applications')
      .select('id, application_number, created_at, status, user_id, session_id, assigned_centre_id, preferred_centre_id, subject_combination_id, surname, first_name, middle_name, gender, date_of_birth, state_of_origin, lga, guardian_phone, residential_address, intended_course, passport_path, form_fee_paid')
      .eq('id', applicationId)
      .single();

    if (appError || !app) {
      throw new Error(`Failed to fetch application: ${appError?.message || 'Not found'}`);
    }
    const appData = app as any;

    // Fetch all related records in parallel (including O-level and payment)
    const [profileRes, sessionRes, assignedCentreRes, preferredCentreRes, subjectComboRes, olevelRes, paymentRes] = await Promise.all([
      appData.user_id
        ? supabase.from('profiles').select('email, phone').eq('id', appData.user_id).single()
        : Promise.resolve({ data: null }),
      appData.session_id
        ? supabase.from('sessions').select('name, code').eq('id', appData.session_id).single()
        : Promise.resolve({ data: null }),
      appData.assigned_centre_id
        ? supabase.from('centres').select('name, state, location').eq('id', appData.assigned_centre_id).single()
        : Promise.resolve({ data: null }),
      appData.preferred_centre_id
        ? supabase.from('centres').select('name, state, location').eq('id', appData.preferred_centre_id).single()
        : Promise.resolve({ data: null }),
      appData.subject_combination_id
        ? supabase.from('subject_combinations').select('name, track').eq('id', appData.subject_combination_id).single()
        : Promise.resolve({ data: null }),
      supabase.from('olevel_results').select('subject, grade, exam_type, exam_year').eq('application_id', applicationId).order('created_at'),
      supabase.from('payments').select('reference, created_at, amount').eq('application_id', applicationId).eq('type', 'form_fee').eq('status', 'success').order('created_at').limit(1).maybeSingle(),
    ]);

    const profile = profileRes.data as any;
    const session = sessionRes.data as any;
    const assignedCentre = assignedCentreRes.data as any;
    const preferredCentre = preferredCentreRes.data as any;
    const subjectCombo = subjectComboRes.data as any;
    const olevelRows = olevelRes.data as any;
    const feePayment = paymentRes.data as any;

    // 2. Load logo (sync, fast), fetch passport photo and generate QR in parallel
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

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ijmb.info';
    const verifyUrl = `${siteUrl}/verify/${applicationId}`;

    const [passportBase64, qrCodeBase64] = await Promise.all([
      // 3. Fetch Passport Photo (Convert to Base64)
      appData.passport_path
        ? supabase.storage.from('student-documents').download(appData.passport_path).then(async ({ data: photoData, error: photoError }) => {
            if (photoError || !photoData) { console.warn('Failed to load passport photo:', photoError); return ''; }
            const buffer = Buffer.from(await photoData.arrayBuffer());
            return `data:${photoData.type || 'image/jpeg'};base64,${buffer.toString('base64')}`;
          }).catch((err) => { console.warn('Failed to load passport photo:', err); return ''; })
        : Promise.resolve(''),
      // 4. Generate QR Code
      generateQRCodeBase64(verifyUrl),
    ]);

    // 5. Generate Application ID
    const displayId = appData.application_number || generateApplicationId(1000);

    // 6. Build HTML
    const sc = subjectCombo;
    const htmlContent = buildApplicationFormHTML({
      applicationId: displayId,
      registrationDate: new Date(appData.created_at).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'long', year: 'numeric'
      }),
      academicSession: session?.name || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
      surname: appData.surname || '',
      firstName: appData.first_name || '',
      middleName: appData.middle_name || '',
      gender: appData.gender || '',
      dateOfBirth: appData.date_of_birth ? new Date(appData.date_of_birth).toLocaleDateString('en-GB') : '',
      stateOfOrigin: appData.state_of_origin || '',
      lga: appData.lga || '',
      phoneNumber: appData.guardian_phone || profile?.phone || '',
      email: profile?.email || '',
      residentialAddress: appData.residential_address || '',
      centreOfStudy: (() => { const c = assignedCentre || preferredCentre; return c ? `${c.name}${c.location ? ', ' + c.location : ''}, ${c.state}` : 'Not Assigned'; })(),
      courseOfChoice: appData.intended_course || '',
      subjectCombination: sc ? `${sc.name}${sc.track ? ' (' + sc.track + ')' : ''}` : 'Pending',
      subject1: '',
      subject2: '',
      subject3: '',
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
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

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
