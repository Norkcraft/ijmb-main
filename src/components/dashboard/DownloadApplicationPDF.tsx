'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { buildApplicationFormHTML } from '@/lib/applicationFormTemplate';
import QRCode from 'qrcode';

interface Props {
  applicationId: string;
}

export const DownloadApplicationPDF = ({ applicationId }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      // 1. Fetch full application data
      const [appRes, olevelRes, paymentRes] = await Promise.all([
        supabase
          .from('applications')
          .select('*, profiles:user_id(email,phone), sessions:session_id(name,code), centres:preferred_centre_id(name,state,location), subject_combinations:subject_combination_id(name,subject1,subject2,subject3)')
          .eq('id', applicationId)
          .single(),
        supabase
          .from('olevel_results')
          .select('subject, grade, exam_type, exam_year')
          .eq('application_id', applicationId)
          .order('created_at'),
        supabase
          .from('payments')
          .select('reference, created_at, amount')
          .eq('application_id', applicationId)
          .eq('type', 'form_fee')
          .eq('status', 'success')
          .order('created_at')
          .limit(1)
          .maybeSingle(),
      ]);

      const app = appRes.data;
      const error = appRes.error;
      if (error || !app) throw new Error('Could not load application data.');
      const olevelRows = olevelRes.data || [];
      const feePayment = paymentRes.data;

      // 2. Get passport photo as a signed URL (instant — no download/encode)
      let passportBase64 = '';
      if (app.passport_path) {
        const { data: signed } = await supabase.storage
          .from('student-documents')
          .createSignedUrl(app.passport_path, 300);
        if (signed?.signedUrl) passportBase64 = signed.signedUrl;
      }

      // 3. Skip logo fetch — template falls back to the public URL automatically

      // 4. Generate QR code
      const verifyUrl = `https://www.ijmb.info/verify/${applicationId}`;
      const qrCodeBase64 = await QRCode.toDataURL(verifyUrl, { width: 160, margin: 1 });

      // 5. Build display values
      const displayId = app.application_number || applicationId.split('-')[0].toUpperCase();
      const registrationDate = new Date(app.created_at).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
      });
      const subjectCombo = app.subject_combinations
        ? `${app.subject_combinations.name} (${[
            app.subject_combinations.subject1,
            app.subject_combinations.subject2,
            app.subject_combinations.subject3,
          ]
            .filter(Boolean)
            .join(', ')})`
        : app.intended_course || '-';
      const centreName = app.centres
        ? `${app.centres.name}, ${app.centres.state}`
        : 'Not Assigned';

      // 6. Build HTML and open print window
      const sc = app.subject_combinations;
      const html = buildApplicationFormHTML({
        applicationId: displayId,
        registrationDate,
        surname: app.surname || '',
        firstName: app.first_name || '',
        middleName: app.middle_name || '',
        gender: app.gender || '',
        dateOfBirth: app.date_of_birth
          ? new Date(app.date_of_birth).toLocaleDateString('en-GB')
          : '',
        stateOfOrigin: app.state_of_origin || '',
        lga: app.lga || '',
        phoneNumber: app.profiles?.phone || app.guardian_phone || '',
        email: app.profiles?.email || '',
        residentialAddress: app.residential_address || '',
        centreOfStudy: centreName,
        courseOfChoice: app.intended_course || '',
        subjectCombination: sc ? sc.name : '',
        subject1: sc?.subject1 || '',
        subject2: sc?.subject2 || '',
        subject3: sc?.subject3 || '',
        academicSession: app.sessions?.name || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
        olevelResults: olevelRows.map((r: any) => ({
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
        qrCodeBase64,
        logoBase64: '',
      });

      const win = window.open('', '_blank', 'width=900,height=700');
      if (!win) {
        alert('Please allow pop-ups for this site to download your form.');
        return;
      }
      win.document.write(html);
      win.document.close();
      win.focus();
      // Wait for passport image (signed URL) and fonts to load before printing
      setTimeout(() => {
        win.print();
      }, 1500);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      {loading ? (
        <>
          <Loader2 size={16} className="mr-2 animate-spin" /> Generating PDF...
        </>
      ) : (
        <>
          <FileText size={16} className="mr-2" /> Download Application Form (PDF)
        </>
      )}
    </Button>
  );
};

export default DownloadApplicationPDF;
