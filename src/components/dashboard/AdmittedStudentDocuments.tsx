'use client';

import { useEffect, useState } from 'react';
import { Download, ExternalLink, FileText, Loader2, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

interface AdmittedDocument {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  storage_path: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
}

interface Props {
  application: { status?: string } | null;
}

const ADMITTED_STATUSES = ['admitted', 'fees_pending', 'active'];

export function AdmittedStudentDocuments({ application }: Props) {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<AdmittedDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const isAdmitted = !!application?.status && ADMITTED_STATUSES.includes(application.status);

  useEffect(() => {
    if (!isAdmitted) return;
    let cancelled = false;
    setLoading(true);

    supabase
      .from('admitted_student_documents')
      .select('id,title,description,category,storage_path,original_filename,mime_type,file_size')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          toast({ title: 'Could not load school documents', description: error.message, variant: 'destructive' });
        } else {
          setDocuments(data || []);
        }
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [isAdmitted, toast]);

  const openDocument = async (document: AdmittedDocument, download: boolean) => {
    setOpeningId(`${document.id}:${download ? 'download' : 'view'}`);
    const options = download ? { download: document.original_filename } : undefined;
    const { data, error } = await supabase.storage
      .from('admitted-student-documents')
      .createSignedUrl(document.storage_path, 300, options);

    setOpeningId(null);
    if (error || !data?.signedUrl) {
      toast({ title: 'Unable to open document', description: error?.message || 'Please try again.', variant: 'destructive' });
      return;
    }

    const anchor = window.document.createElement('a');
    anchor.href = data.signedUrl;
    anchor.target = download ? '_self' : '_blank';
    anchor.rel = 'noopener noreferrer';
    if (download) anchor.download = document.original_filename;
    window.document.body.appendChild(anchor);
    anchor.click();
    window.document.body.removeChild(anchor);
  };

  if (!isAdmitted) {
    return (
      <section className="rounded-2xl border border-dashed bg-muted/30 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
            <Lock size={18} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-bold">Admitted Student Documents</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              School requirements, declaration forms, timetables, and oath documents become available after admission.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <div>
        <h3 className="flex items-center gap-2 text-base font-bold">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
          Admitted Student Documents
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Official documents provided by the school for admitted students.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border bg-white py-10 text-sm text-muted-foreground">
          <Loader2 size={18} className="mr-2 animate-spin" /> Loading documents…
        </div>
      ) : documents.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-white p-6 text-center text-sm text-muted-foreground">
          No school documents have been published yet.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {documents.map(document => (
            <article key={document.id} className="flex flex-col rounded-2xl border bg-white p-5 transition-shadow hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
                  <FileText size={19} className="text-red-600" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold leading-5">{document.title}</h4>
                  {document.description && (
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{document.description}</p>
                  )}
                  <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {document.category || 'School document'} · PDF
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => openDocument(document, false)}
                  disabled={openingId !== null}
                  className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors hover:bg-muted disabled:opacity-60"
                >
                  {openingId === `${document.id}:view` ? <Loader2 size={14} className="animate-spin" /> : <ExternalLink size={14} />}
                  View
                </button>
                <button
                  type="button"
                  onClick={() => openDocument(document, true)}
                  disabled={openingId !== null}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
                >
                  {openingId === `${document.id}:download` ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                  Download
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
