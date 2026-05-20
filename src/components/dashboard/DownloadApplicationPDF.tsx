'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  applicationId: string;
}

export const DownloadApplicationPDF = ({ applicationId }: Props) => {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const token = session?.access_token;
      if (!token) throw new Error('Not signed in.');

      const res = await fetch(`/api/download-form?id=${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || 'Failed to get download link.');
      }

      // Open the signed URL — browser triggers the download
      const a = document.createElement('a');
      a.href = json.url;
      a.download = 'IJMB-Application-Form.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    } catch (err: any) {
      alert(err.message || 'Failed to download. Please try again.');
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
        <><Loader2 size={16} className="mr-2 animate-spin" /> Getting download link…</>
      ) : (
        <><FileText size={16} className="mr-2" /> Download Application Form (PDF)</>
      )}
    </Button>
  );
};

export default DownloadApplicationPDF;
