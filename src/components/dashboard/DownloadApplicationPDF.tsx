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
      const { data, error } = await supabase
        .storage
        .from('protected-forms')
        .createSignedUrl('application-form.pdf', 120, { download: 'IJMB-Application-Form.pdf' });

      if (error || !data?.signedUrl) {
        throw new Error('Could not generate download link. Please try again.');
      }

      const a = document.createElement('a');
      a.href = data.signedUrl;
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
