'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Download, FilePlus2, FileText, Loader2, Pencil, RefreshCw, Trash2, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface SchoolDocument {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  storage_path: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

const BUCKET = 'admitted-student-documents';
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function suggestedTitle(filename: string) {
  const name = filename.replace(/\.pdf$/i, '').replace(/\s*\(\d+\)\s*$/, '').trim();
  const lower = name.toLowerCase();
  if (lower.includes('school requirement')) return 'School Requirements IJMB';
  if (lower.includes('dynamic declaration')) return 'Dynamic Declaration of Compliance';
  if (lower.includes('lecture') && lower.includes('time')) return 'Lecture Timetable';
  if (lower.includes('oath')) return 'Oath Swearing';
  return name.replace(/\b\w/g, letter => letter.toUpperCase());
}

function suggestedCategory(filename: string) {
  const lower = filename.toLowerCase();
  if (lower.includes('time')) return 'Timetable';
  if (lower.includes('oath') || lower.includes('declaration')) return 'Forms';
  return 'Requirements';
}

export default function AdminAdmittedDocuments() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<SchoolDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('School document');
  const [published, setPublished] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('admitted_student_documents')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (error) toast({ title: 'Could not load documents', description: error.message, variant: 'destructive' });
    setDocuments(data || []);
    setLoading(false);
  }, [toast]);

  useEffect(() => { loadDocuments(); }, [loadDocuments]);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setCategory('School document');
    setPublished(true);
    setFile(null);
  };

  const validateFile = (candidate: File) => {
    if (candidate.type !== 'application/pdf' && !candidate.name.toLowerCase().endsWith('.pdf')) {
      toast({ title: 'PDF required', description: 'Only PDF documents are supported.', variant: 'destructive' });
      return false;
    }
    if (candidate.size > MAX_FILE_SIZE) {
      toast({ title: 'File too large', description: 'Maximum file size is 10 MB.', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || (!editingId && !file)) return;
    if (file && !validateFile(file)) return;

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Your admin session has expired.');

      if (editingId) {
        const existing = documents.find(item => item.id === editingId);
        if (!existing) throw new Error('Document not found.');

        if (file) {
          const { error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(existing.storage_path, file, { contentType: 'application/pdf', upsert: true });
          if (uploadError) throw uploadError;
        }

        const { error } = await supabase.from('admitted_student_documents').update({
          title: title.trim(),
          description: description.trim() || null,
          category: category.trim() || null,
          is_published: published,
          ...(file ? {
            original_filename: file.name,
            mime_type: 'application/pdf',
            file_size: file.size,
          } : {}),
        }).eq('id', editingId);
        if (error) throw error;
        toast({ title: 'Document updated' });
      } else if (file) {
        const id = crypto.randomUUID();
        const storagePath = `${id}.pdf`;
        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(storagePath, file, { contentType: 'application/pdf', upsert: false });
        if (uploadError) throw uploadError;

        const { error } = await supabase.from('admitted_student_documents').insert({
          id,
          title: title.trim(),
          description: description.trim() || null,
          category: category.trim() || null,
          storage_path: storagePath,
          original_filename: file.name,
          mime_type: 'application/pdf',
          file_size: file.size,
          is_published: published,
          sort_order: documents.length,
          uploaded_by: user.id,
        });
        if (error) {
          await supabase.storage.from(BUCKET).remove([storagePath]);
          throw error;
        }
        toast({ title: 'Document uploaded' });
      }

      resetForm();
      await loadDocuments();
    } catch (error: any) {
      toast({ title: 'Could not save document', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const editDocument = (document: SchoolDocument) => {
    setEditingId(document.id);
    setTitle(document.title);
    setDescription(document.description || '');
    setCategory(document.category || 'School document');
    setPublished(document.is_published);
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const togglePublished = async (document: SchoolDocument) => {
    setBusyId(document.id);
    const { error } = await supabase.from('admitted_student_documents')
      .update({ is_published: !document.is_published })
      .eq('id', document.id);
    if (error) toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    else setDocuments(current => current.map(item => item.id === document.id ? { ...item, is_published: !item.is_published } : item));
    setBusyId(null);
  };

  const deleteDocument = async (document: SchoolDocument) => {
    if (!window.confirm(`Remove “${document.title}”? This cannot be undone.`)) return;
    setBusyId(document.id);
    const { error: storageError } = await supabase.storage.from(BUCKET).remove([document.storage_path]);
    if (storageError) {
      toast({ title: 'Could not remove file', description: storageError.message, variant: 'destructive' });
      setBusyId(null);
      return;
    }
    const { error } = await supabase.from('admitted_student_documents').delete().eq('id', document.id);
    if (error) toast({ title: 'Could not remove record', description: error.message, variant: 'destructive' });
    else {
      setDocuments(current => current.filter(item => item.id !== document.id));
      toast({ title: 'Document removed' });
    }
    setBusyId(null);
  };

  const previewDocument = async (document: SchoolDocument) => {
    setBusyId(document.id);
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(document.storage_path, 300);
    setBusyId(null);
    if (error || !data?.signedUrl) {
      toast({ title: 'Could not open file', description: error?.message, variant: 'destructive' });
      return;
    }
    window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
  };

  const importExistingFiles = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Your admin session has expired.');
      const { data: files, error: listError } = await supabase.storage.from(BUCKET).list('', { limit: 100 });
      if (listError) throw listError;

      const knownPaths = new Set(documents.map(document => document.storage_path));
      const missing = (files || []).filter(item => item.name.toLowerCase().endsWith('.pdf') && !knownPaths.has(item.name));
      if (missing.length === 0) {
        toast({ title: 'Nothing to import', description: 'Every uploaded PDF already has a document record.' });
        return;
      }

      const rows = missing.map((item, index) => ({
        title: suggestedTitle(item.name),
        description: null,
        category: suggestedCategory(item.name),
        storage_path: item.name,
        original_filename: item.name,
        mime_type: item.metadata?.mimetype || 'application/pdf',
        file_size: Number(item.metadata?.size || 0),
        is_published: true,
        sort_order: documents.length + index,
        uploaded_by: user.id,
      }));
      const { error } = await supabase.from('admitted_student_documents').insert(rows);
      if (error) throw error;
      toast({ title: `${rows.length} document${rows.length === 1 ? '' : 's'} imported and published` });
      await loadDocuments();
    } catch (error: any) {
      toast({ title: 'Import failed', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Admitted Student Documents</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage PDFs available under Dashboard → Documents after admission.</p>
        </div>
        <Button type="button" variant="outline" onClick={importExistingFiles} disabled={saving}>
          <RefreshCw size={15} className="mr-2" /> Import uploaded PDFs
        </Button>
      </div>

      <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-muted/20 p-5">
        <div className="flex items-center gap-2">
          {editingId ? <Pencil size={17} className="text-primary" /> : <FilePlus2 size={17} className="text-primary" />}
          <h3 className="font-bold">{editingId ? 'Update document' : 'Add document'}</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="school-document-title">Title</Label>
            <Input id="school-document-title" value={title} onChange={event => setTitle(event.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="school-document-category">Category</Label>
            <Input id="school-document-category" value={category} onChange={event => setCategory(event.target.value)} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="school-document-description">Description (optional)</Label>
          <Textarea id="school-document-description" value={description} onChange={event => setDescription(event.target.value)} rows={2} />
        </div>
        <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto]">
          <div className="space-y-1.5">
            <Label htmlFor="school-document-file">PDF {editingId && '(optional — choose a file to replace the current PDF)'}</Label>
            <Input id="school-document-file" type="file" accept="application/pdf,.pdf" onChange={event => setFile(event.target.files?.[0] || null)} required={!editingId} />
          </div>
          <label className="flex h-10 cursor-pointer items-center gap-2 rounded-md border bg-white px-3 text-sm font-medium">
            <input type="checkbox" checked={published} onChange={event => setPublished(event.target.checked)} className="h-4 w-4 accent-primary" />
            Available to students
          </label>
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 size={15} className="mr-2 animate-spin" /> : <Upload size={15} className="mr-2" />}
            {editingId ? 'Save changes' : 'Upload document'}
          </Button>
          {editingId && <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>}
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
      ) : documents.length === 0 ? (
        <div className="rounded-2xl border border-dashed py-12 text-center text-sm text-muted-foreground">
          No document records yet. Import the PDFs already in Storage or upload a new one.
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map(document => (
            <div key={document.id} className="flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
                <FileText size={19} className="text-red-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{document.title}</p>
                  <Badge variant={document.is_published ? 'default' : 'secondary'} className={document.is_published ? 'bg-green-600' : ''}>
                    {document.is_published ? 'Published' : 'Hidden'}
                  </Badge>
                </div>
                <p className="truncate text-xs text-muted-foreground">{document.original_filename}</p>
                {document.description && <p className="mt-1 text-xs text-muted-foreground">{document.description}</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => previewDocument(document)} disabled={busyId === document.id}>
                  <Download size={14} className="mr-1.5" /> View
                </Button>
                <Button size="sm" variant="outline" onClick={() => editDocument(document)}><Pencil size={14} className="mr-1.5" /> Edit</Button>
                <Button size="sm" variant="outline" onClick={() => togglePublished(document)} disabled={busyId === document.id}>
                  {document.is_published ? 'Hide' : 'Publish'}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deleteDocument(document)} disabled={busyId === document.id}>
                  {busyId === document.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
