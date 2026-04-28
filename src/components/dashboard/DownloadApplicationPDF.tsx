'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleDownload = async () => {
    setLoading(true);
    setStatus('Loading data…');

    let container: HTMLDivElement | null = null;
    let styleEl: HTMLStyleElement | null = null;

    try {
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

      // 2. Generate QR code and fetch logo client-side
      const siteUrl = window.location.origin;
      const [qrCodeBase64, logoBase64] = await Promise.all([
        generateQRCodeBase64(`${siteUrl}/verify/${data.rawId}`).catch(() => ''),
        toBase64FromUrl('/ijmb-logo.jpeg'),
      ]);

      // 3. Format dates
      const fmt = (d: string) => d ? new Date(d).toLocaleDateString('en-GB') : '';
      const fmtLong = (d: string) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '';

      // 4. Build full HTML string
      const html = buildApplicationFormHTML({
        applicationId: data.applicationId,
        registrationDate: fmtLong(data.registrationDate),
        academicSession: data.academicSession || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
        surname: data.surname,
        firstName: data.firstName,
        middleName: data.middleName,
        gender: data.gender,
        dateOfBirth: fmt(data.dateOfBirth),
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
        paymentDate: fmt(data.paymentDate),
        amountPaid: data.amountPaid,
        passportPhotoBase64: data.passportPhotoBase64 || '',
        qrCodeBase64,
        logoBase64,
      });

      setStatus('Generating PDF…');

      // 5. Extract <style> and <body> from the HTML string and inject into main document
      const cssMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      const css = cssMatch?.[1] ?? '';
      const bodyContent = bodyMatch?.[1] ?? '';

      styleEl = document.createElement('style');
      styleEl.id = '__pdf-style';
      styleEl.textContent = css;
      document.head.appendChild(styleEl);

      container = document.createElement('div');
      container.style.cssText = 'position:absolute;left:-9999px;top:0;width:794px;height:1123px;overflow:visible;background:#fff;';
      container.innerHTML = bodyContent;
      document.body.appendChild(container);

      // Wait for all images to load
      const images = Array.from(container.querySelectorAll('img'));
      await Promise.all(
        images.map(img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; }))
      );
      // Allow CSS to settle
      await new Promise(r => setTimeout(r, 200));

      // 6. Capture with html2canvas — target first child (the form root div)
      const { default: html2canvas } = await import('html2canvas');
      const pageEl = (container.firstElementChild as HTMLElement) || container;

      const canvas = await html2canvas(pageEl, {
        scale: 1.2,
        useCORS: true,
        allowTaint: true,
        width: 794,
        height: 1123,
        scrollX: 0,
        scrollY: 0,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 5000,
      });

      // 7. Build PDF and trigger download
      const { default: jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

      // Force file download via anchor click — avoids browser PDF-viewer popup
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `IJMB-Application-${data.applicationId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);

    } catch (err: any) {
      console.error('PDF download error:', err);
      alert(err.message || 'Failed to generate PDF. Please try again.');
    } finally {
      if (container && document.body.contains(container)) document.body.removeChild(container);
      if (styleEl && document.head.contains(styleEl)) document.head.removeChild(styleEl);
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
