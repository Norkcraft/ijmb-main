'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface Props {
  applicationId: string;
}

export const DownloadApplicationPDF = ({ applicationId }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error('Not signed in.');

      const res = await fetch('/api/application-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ applicationId }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || 'Failed to generate PDF.');
      }

      // Trigger automatic file download
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const filename = res.headers.get('Content-Disposition')?.match(/filename="(.+)"/)?.[1]
        || `IJMB-Application.pdf`;
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('PDF download error:', err);
      alert(err.message || 'Failed to download PDF. Please try again.');
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
        <><Loader2 size={16} className="mr-2 animate-spin" /> Generating PDF…</>
      ) : (
        <><FileText size={16} className="mr-2" /> Download Application Form (PDF)</>
      )}
    </Button>
  );
};

export default DownloadApplicationPDF;
