'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { buildApplicationFormHTML } from '@/lib/applicationFormTemplate';
import { generateQRCodeBase64 } from '@/lib/generateQRCode';

interface Props {
  applicationId: string;
}

async function toBase64FromUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return '';
  }
}

export const DownloadApplicationPDF = ({ applicationId }: Props) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleDownload = async () => {
    setLoading(true);
    setStatus('Loading data…');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error('Not signed in.');

      // 1. Fetch application data as JSON
      const res = await fetch('/api/application-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ applicationId }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || 'Failed to load application data.');
      }
      const data = await res.json();

      setStatus('Building form…');

      // 2. Generate QR code and fetch logo (client-side)
      const siteUrl = window.location.origin;
      const [qrCodeBase64, logoBase64] = await Promise.all([
        generateQRCodeBase64(`${siteUrl}/verify/${data.rawId}`).catch(() => ''),
        toBase64FromUrl('/ijmb-logo.jpeg'),
      ]);

      // 3. Format dates
      const registrationDate = data.registrationDate
        ? new Date(data.registrationDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
        : '';
      const paymentDate = data.paymentDate
        ? new Date(data.paymentDate).toLocaleDateString('en-GB')
        : '';
      const dateOfBirth = data.dateOfBirth
        ? new Date(data.dateOfBirth).toLocaleDateString('en-GB')
        : '';

      // 4. Build full HTML
      const html = buildApplicationFormHTML({
        applicationId: data.applicationId,
        registrationDate,
        academicSession: data.academicSession || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
        surname: data.surname,
        firstName: data.firstName,
        middleName: data.middleName,
        gender: data.gender,
        dateOfBirth,
        stateOfOrigin: data.stateOfOrigin,
        lga: data.lga,
        phoneNumber: data.phoneNumber,
        email: data.email,
        residentialAddress: data.residentialAddress,
        centreOfStudy: data.centreOfStudy,
        courseOfChoice: data.courseOfChoice,
        subjectCombination: data.subjectCombination,
        olevelResults: data.olevelResults || [],
        paymentReference: data.paymentReference,
        paymentDate,
        amountPaid: data.amountPaid,
        passportPhotoBase64: data.passportPhotoBase64 || '',
        qrCodeBase64,
        logoBase64,
      });

      setStatus('Generating PDF…');

      // 5. Render in hidden iframe
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:794px;height:1123px;border:none;visibility:hidden;';
      document.body.appendChild(iframe);

      await new Promise<void>((resolve) => {
        iframe.onload = () => resolve();
        iframe.contentDocument!.open();
        iframe.contentDocument!.write(html);
        iframe.contentDocument!.close();
      });

      // Wait for images to render
      await new Promise(r => setTimeout(r, 800));

      // 6. Capture with html2canvas
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(iframe.contentDocument!.body, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: 794,
        height: 1123,
        windowWidth: 794,
        windowHeight: 1123,
        backgroundColor: '#ffffff',
      });

      document.body.removeChild(iframe);

      // 7. Build PDF and download
      const { default: jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgData = canvas.toDataURL('image/jpeg', 0.96);
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      pdf.save(`IJMB-Application-${data.applicationId}.pdf`);

    } catch (err: any) {
      console.error('PDF download error:', err);
      alert(err.message || 'Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      {loading ? (
        <><Loader2 size={16} className="mr-2 animate-spin" /> {status || 'Generating PDF…'}</>
      ) : (
        <><FileText size={16} className="mr-2" /> Download Application Form (PDF)</>
      )}
    </Button>
  );
};

export default DownloadApplicationPDF;
