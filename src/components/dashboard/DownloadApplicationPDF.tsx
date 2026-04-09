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
      const { data: app, error } = await supabase
        .from('applications')
        .select(`
          *,
          profiles ( email, phone ),
          sessions ( name, code ),
          centres ( name, state, address ),
          subject_combinations ( name, subject1, subject2, subject3 )
        `)
        .eq('id', applicationId)
        .single();

      if (error || !app) throw new Error('Could not load application data.');

      // 2. Load passport photo as base64
      let passportBase64 = '';
      if (app.passport_path) {
        const { data: photoBlob } = await supabase.storage
          .from('student-documents')
          .download(app.passport_path);
        if (photoBlob) {
          const ab = await photoBlob.arrayBuffer();
          const bytes = new Uint8Array(ab);
          let binary = '';
          bytes.forEach((b) => (binary += String.fromCharCode(b)));
          const b64 = btoa(binary);
          passportBase64 = `data:${photoBlob.type || 'image/jpeg'};base64,${b64}`;
        }
      }

      // 3. Load logo as base64
      let logoBase64 = '';
      try {
        const resp = await fetch('/ijmb-logo.jpeg');
        const blob = await resp.blob();
        const ab = await blob.arrayBuffer();
        const bytes = new Uint8Array(ab);
        let binary = '';
        bytes.forEach((b) => (binary += String.fromCharCode(b)));
        logoBase64 = `data:image/jpeg;base64,${btoa(binary)}`;
      } catch {
        // logo optional
      }

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
      const html = buildApplicationFormHTML({
        applicationId: displayId,
        registrationDate,
        surname: app.surname || '',
        firstName: app.first_name || '',
        middleName: app.middle_name || '',
        gender: app.gender || '-',
        dateOfBirth: app.date_of_birth
          ? new Date(app.date_of_birth).toLocaleDateString('en-GB')
          : '-',
        stateOfOrigin: app.state_of_origin || '-',
        lga: app.lga || '-',
        phoneNumber: app.profiles?.phone || app.phone_number || '-',
        email: app.profiles?.email || '-',
        residentialAddress: app.residential_address || '-',
        centreOfStudy: centreName,
        courseOfChoice: app.intended_course || '-',
        subjectCombination: subjectCombo,
        academicSession: app.sessions?.name || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
        passportPhotoBase64: passportBase64,
        qrCodeBase64,
        logoBase64,
      });

      const win = window.open('', '_blank', 'width=900,height=700');
      if (!win) {
        alert('Please allow pop-ups for this site to download your form.');
        return;
      }
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => {
        win.print();
      }, 800);
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
