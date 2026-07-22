'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft, ExternalLink, Loader2, CheckCircle, XCircle, Eye, AlertCircle, Upload,
  MessageSquarePlus, Clock as ClockIcon, Download, Ban, ThumbsUp, ThumbsDown,
  FileText
} from 'lucide-react';

// ── Status transition rules ─────────────────────────────────────────────────
// payment_pending and fees_pending are set automatically by payments — not by admin
const STATUS_TRANSITIONS: Record<string, { value: string; label: string }[]> = {
  draft:               [{ value: 'submitted', label: 'Mark as Submitted' }, { value: 'rejected', label: 'Reject' }],
  payment_pending:     [{ value: 'submitted', label: 'Mark as Submitted (manual payment)' }, { value: 'rejected', label: 'Reject' }],
  paid_details_pending:[{ value: 'submitted', label: 'Mark as Submitted' }, { value: 'rejected', label: 'Reject' }],
  submitted:           [{ value: 'admitted',  label: 'Admit ✓' }, { value: 'rejected', label: 'Reject ✗' }],
  admitted:            [{ value: 'rejected',  label: 'Rescind Admission ✗' }],
  fees_pending:        [{ value: 'active',    label: 'Mark as Active (manual)' }, { value: 'admitted', label: 'Reverse to Admitted' }],
  active:              [],
  rejected:            [{ value: 'submitted', label: 'Reconsider — move back to Review' }],
};

const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  payment_pending: 'Payment Pending',
  paid_details_pending: 'Details Pending',
  submitted: 'Under Review',
  admitted: 'Admitted',
  fees_pending: 'Fees Pending',
  active: 'Active Student',
  rejected: 'Rejected',
};

const STATUS_COLOR: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-700',
  payment_pending: 'bg-amber-100 text-amber-700',
  paid_details_pending: 'bg-blue-100 text-blue-700',
  submitted: 'bg-blue-100 text-blue-700',
  admitted: 'bg-green-100 text-green-700',
  fees_pending: 'bg-amber-100 text-amber-700',
  active: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
};

function DocBadge({ status }: { status: string }) {
  if (status === 'approved') return <Badge className="bg-green-600 text-white">Approved</Badge>;
  if (status === 'rejected') return <Badge variant="destructive">Rejected</Badge>;
  return <Badge variant="outline" className="text-amber-600 border-amber-400">Pending Review</Badge>;
}

async function sendEmail(type: string, data: Record<string, string>, toast?: (opts: any) => void) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) {
      toast?.({ title: 'Email skipped', description: 'No session token found.', variant: 'destructive' });
      return;
    }
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': process.env.NEXT_PUBLIC_INTERNAL_API_SECRET || '',
      },
      body: JSON.stringify({ type, data }),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      toast?.({ title: `Email failed (${res.status})`, description: json.message || 'Unknown error', variant: 'destructive' });
    }
  } catch (err: any) {
    toast?.({ title: 'Email error', description: err?.message || 'Unknown error', variant: 'destructive' });
  }
}

// ── component ──────────────────────────────────────────────────────────────
const AdminApplicationDetail = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { toast } = useToast();

  const [app, setApp] = useState<any>(null);
  const [centres, setCentres] = useState<any[]>([]);
  const [olevels, setOlevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Main action state
  const [status, setStatus] = useState('');
  const [assignedCentreId, setAssignedCentreId] = useState('');
  const [installmentsAllowed, setInstallmentsAllowed] = useState(false);
  const [saving, setSaving] = useState(false);

  // Per-document action state
  const [passportStatus, setPassportStatus] = useState('pending');
  const [passportMsg, setPassportMsg] = useState('');
  const [olevelStatus, setOlevelStatus] = useState('pending');
  const [olevelMsg, setOlevelMsg] = useState('');
  const [savingPassport, setSavingPassport] = useState(false);
  const [savingOlevel, setSavingOlevel] = useState(false);
  const [letterFile, setLetterFile] = useState<File | null>(null);
  const [uploadingLetter, setUploadingLetter] = useState(false);

  // Document request state
  const [docRequests, setDocRequests] = useState<any[]>([]);
  const [docRequestMsg, setDocRequestMsg] = useState('');
  const [sendingDocRequest, setSendingDocRequest] = useState(false);
  const [docRejectReason, setDocRejectReason] = useState<Record<string, string>>({});
  const [docActionLoading, setDocActionLoading] = useState<string | null>(null);

  // PDF download
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [appRes, centreRes, olRes, docReqRes] = await Promise.all([
        supabase.from('applications').select(`
          *,
          profiles:user_id(full_name, phone, id, email),
          session:session_id(name, code),
          preferred_centre:preferred_centre_id(name, state),
          assigned_centre:assigned_centre_id(name, state),
          subject_combo:subject_combination_id(name, track)
        `).eq('id', id).single(),
        supabase.from('centres').select('id, name, state'),
        supabase.from('olevel_results').select('*').eq('application_id', id),
        supabase.from('document_requests').select('*').eq('application_id', id).order('created_at', { ascending: false }),
      ]);
      if (appRes.data) {
        const a = appRes.data;
        setApp(a);
        setStatus(a.status || 'draft');
        setAssignedCentreId(a.assigned_centre_id || '');
        setInstallmentsAllowed(a.installments_allowed || false);
        setPassportStatus(a.passport_status || 'pending');
        setPassportMsg(a.passport_msg || '');
        setOlevelStatus(a.olevel_status || 'pending');
        setOlevelMsg(a.olevel_msg || '');
        setOlevels(olRes.data || []);
      }
      setCentres(centreRes.data || []);
      setDocRequests(docReqRes.data || []);
      setLoading(false);
    };
    load();
  }, [id]);

  // ── save main status / centre ──────────────────────────────────────────
  const saveStatus = async (newStatus: string) => {
    if (!app) return;
    setSaving(true);
    try {
      // Require a centre assignment before admitting
      if (newStatus === 'admitted' && !assignedCentreId && !app.preferred_centre_id) {
        toast({ title: 'Centre required', description: 'Please assign a study centre before admitting this student.', variant: 'destructive' });
        setSaving(false);
        return;
      }

      const wasAdmittedBefore = ['admitted', 'fees_pending', 'active'].includes(app.status);
      const isAdmitting = newStatus === 'admitted' && !wasAdmittedBefore;
      const isRejecting = newStatus === 'rejected' && app.status !== 'rejected';

      const { error } = await supabase.from('applications').update({
        status: newStatus,
        assigned_centre_id: assignedCentreId || null,
        admission_granted: ['admitted', 'fees_pending', 'active'].includes(newStatus),
        installments_allowed: installmentsAllowed,
        updated_at: new Date().toISOString(),
      }).eq('id', app.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }

      setApp((prev: any) => ({ ...prev, status: newStatus, assigned_centre_id: assignedCentreId, installments_allowed: installmentsAllowed }));
      setStatus(newStatus);
      toast({ title: 'Status updated', description: `→ ${STATUS_LABEL[newStatus] || newStatus}` });

      const studentEmail = app.profiles?.email;
      const studentName = app.first_name
        ? `${app.first_name} ${app.surname}`
        : (app.profiles?.full_name || 'Student');
      const appId = app.application_number || app.id.split('-')[0].toUpperCase();
      const centreName = centres.find((c: any) => c.id === (assignedCentreId || app.preferred_centre_id))?.name
        || app.preferred_centre?.name || 'To be confirmed';

      if (studentEmail && isAdmitting) {
        sendEmail('admission_offer', {
          email: studentEmail,
          fullName: studentName,
          applicationId: appId,
          centre: centreName,
          resumptionDate: 'As communicated by your centre',
          subjects: app.subject_combo?.name || 'As selected',
        }, toast);
      }

      if (studentEmail && isRejecting) {
        sendEmail('rejection', {
          email: studentEmail,
          fullName: studentName,
          applicationId: appId,
        }, toast);
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Something went wrong', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  // ── PDF download for admin ──────────────────────────────────────────────
  const downloadPDF = async () => {
    if (!app) return;
    setDownloadingPdf(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Not authenticated');
      const res = await fetch(`/api/admin/application/${app.id}/pdf`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || 'PDF generation failed');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const appId = app.application_number || app.id.split('-')[0].toUpperCase();
      a.download = `IJMB-Application-${appId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      toast({ title: 'PDF failed', description: err.message, variant: 'destructive' });
    } finally {
      setDownloadingPdf(false);
    }
  };

  // ── document request actions ────────────────────────────────────────────
  const handleDocAction = async (reqId: string, action: 'accepted' | 'cancelled') => {
    setDocActionLoading(reqId + action);
    const { error } = await supabase.from('document_requests')
      .update({ status: action, updated_at: new Date().toISOString() })
      .eq('id', reqId);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setDocRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: action } : r));
      toast({ title: action === 'accepted' ? 'Document accepted' : 'Request cancelled' });
    }
    setDocActionLoading(null);
  };

  const handleDocReject = async (reqId: string) => {
    const reason = docRejectReason[reqId]?.trim();
    if (!reason) return;
    setDocActionLoading(reqId + 'reject');
    const { error } = await supabase.from('document_requests')
      .update({ status: 'pending', rejection_reason: reason, uploaded_path: null, updated_at: new Date().toISOString() })
      .eq('id', reqId);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setDocRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'pending', rejection_reason: reason, uploaded_path: null } : r));
      setDocRejectReason(prev => { const n = { ...prev }; delete n[reqId]; return n; });
      toast({ title: 'Document rejected', description: 'Student will need to re-upload.' });
      // Email student
      const studentEmail = app?.profiles?.email;
      const studentName = app?.first_name ? `${app.first_name} ${app.surname}` : (app?.profiles?.full_name || 'Student');
      if (studentEmail) {
        sendEmail('document_request', {
          email: studentEmail,
          studentName,
          message: `Your uploaded document was rejected. Reason: ${reason}\n\nPlease log in and upload a new version.`,
        }, toast);
      }
    }
    setDocActionLoading(null);
  };

  // ── save passport doc review ───────────────────────────────────────────
  const savePassportReview = async (newStatus: string, msg?: string) => {
    if (!app?.passport_path) return;
    setSavingPassport(true);
    try {
      const finalMsg = newStatus === 'rejected' ? (msg ?? passportMsg) : null;

      const { error } = await supabase.from('applications').update({
        passport_status: newStatus,
        passport_msg: finalMsg,
        updated_at: new Date().toISOString(),
      }).eq('id', app.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }

      setPassportStatus(newStatus);
      setApp((prev: any) => ({ ...prev, passport_status: newStatus, passport_msg: finalMsg }));
      toast({ title: newStatus === 'approved' ? 'Passport approved' : 'Passport rejected' });

      if (newStatus === 'rejected' && finalMsg && app.profiles?.email) {
        sendEmail('account_update', {
          email: app.profiles.email,
          fullName: app.first_name ? `${app.first_name} ${app.surname}` : (app.profiles.full_name || 'Student'),
          changeDescription: `Your passport photograph was rejected. Reason: ${finalMsg}. Please log in and re-upload a new photo.`,
        }, toast);
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Something went wrong', variant: 'destructive' });
    } finally {
      setSavingPassport(false);
    }
  };

  // ── save o-level doc review ────────────────────────────────────────────
  const saveOlevelReview = async (newStatus: string, msg?: string) => {
    if (!app?.olevel_path) return;
    setSavingOlevel(true);
    try {
      const finalMsg = newStatus === 'rejected' ? (msg ?? olevelMsg) : null;

      const { error } = await supabase.from('applications').update({
        olevel_status: newStatus,
        olevel_msg: finalMsg,
        updated_at: new Date().toISOString(),
      }).eq('id', app.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }

      setOlevelStatus(newStatus);
      setApp((prev: any) => ({ ...prev, olevel_status: newStatus, olevel_msg: finalMsg }));
      toast({ title: newStatus === 'approved' ? 'O-Level result approved' : 'O-Level result rejected' });

      if (newStatus === 'rejected' && finalMsg && app.profiles?.email) {
        sendEmail('account_update', {
          email: app.profiles.email,
          fullName: app.first_name ? `${app.first_name} ${app.surname}` : (app.profiles.full_name || 'Student'),
          changeDescription: `Your O-Level result was rejected. Reason: ${finalMsg}. Please log in and re-upload a clear copy of your result.`,
        }, toast);
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Something went wrong', variant: 'destructive' });
    } finally {
      setSavingOlevel(false);
    }
  };

  const sendDocumentRequest = async () => {
    if (!app || !docRequestMsg.trim()) return;
    setSendingDocRequest(true);
    try {
      const { data, error } = await supabase.from('document_requests').insert({
        application_id: app.id,
        message: docRequestMsg.trim(),
        status: 'pending',
      }).select().single();

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }

      setDocRequests(prev => [data, ...prev]);
      setDocRequestMsg('');
      toast({ title: 'Request sent', description: 'Document request created and email sent to student.' });

      // Email the student
      const studentEmail = app.profiles?.email;
      const studentName = app.first_name
        ? `${app.first_name} ${app.surname}`
        : (app.profiles?.full_name || 'Student');
      if (studentEmail) {
        sendEmail('document_request', {
          email: studentEmail,
          studentName,
          message: docRequestMsg.trim(),
        }, toast);
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Something went wrong', variant: 'destructive' });
    } finally {
      setSendingDocRequest(false);
    }
  };

  const openDoc = async (path: string) => {
    const { data } = await supabase.storage.from('student-documents').createSignedUrl(path, 300);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank');
  };

  const uploadAdmissionLetter = async () => {
    if (!letterFile || !app) return;
    setUploadingLetter(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error('Not authenticated');

      const formData = new FormData();
      formData.append('file', letterFile);
      formData.append('applicationId', app.id);

      const res = await fetch('/api/admin/upload-admission-letter', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Upload failed');

      setApp((prev: any) => ({ ...prev, admission_letter_path: json.path }));
      setLetterFile(null);
      toast({ title: 'Admission letter uploaded', description: 'Student can now download it from their dashboard.' });

      // Notify student by email
      const studentEmail = app.profiles?.email;
      const studentName = app.first_name
        ? `${app.first_name} ${app.surname}`
        : (app.profiles?.full_name || 'Student');
      const appId = app.application_number || app.id.split('-')[0].toUpperCase();
      if (studentEmail) {
        sendEmail('admission_letter', {
          email: studentEmail,
          fullName: studentName,
          applicationId: appId,
        }, toast);
      }
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploadingLetter(false);
    }
  };

  // ── render ─────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!app) return (
    <div className="text-center py-20 text-muted-foreground">Application not found.</div>
  );

  const appId = app.application_number || app.id.split('-')[0].toUpperCase();
  const fullName = [app.surname, app.first_name, app.middle_name].filter(Boolean).join(' ') || app.profiles?.full_name || '—';

  return (
    <>
      <SEOHead title={`Application – ${fullName}`} description="Admin view of student application." canonical={`https://www.ijmb.info/portal-admin/applications/${id}`} />

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.push('/portal-admin')}>
            <ArrowLeft size={15} className="mr-1" /> Back
          </Button>
          <div className="text-right">
            <p className="font-semibold text-sm">{fullName}</p>
            <p className="text-xs text-muted-foreground font-mono">{appId}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT: Info ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Personal */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Personal Details</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                <Info label="Surname" value={app.surname} />
                <Info label="First Name" value={app.first_name} />
                <Info label="Middle Name" value={app.middle_name} />
                <Info label="Date of Birth" value={app.date_of_birth} />
                <Info label="Gender" value={app.gender} />
                <Info label="State of Origin" value={app.state_of_origin} />
                <Info label="LGA" value={app.lga} />
                <Info label="Phone" value={app.guardian_phone || app.profiles?.phone} />
                <Info label="Email" value={app.profiles?.email} />
                <div className="col-span-2 md:col-span-3">
                  <Info label="Residential Address" value={app.residential_address} />
                </div>
              </CardContent>
            </Card>

            {/* Programme */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Programme</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <Info label="Session" value={app.session?.name} />
                <Info label="Preferred Centre" value={app.preferred_centre ? `${app.preferred_centre.name}, ${app.preferred_centre.state}` : null} />
                <Info label="Subject Combination" value={app.subject_combo?.name} />
                <Info label="Course of Choice" value={app.intended_course} />
                <div className="col-span-2 flex gap-4 flex-wrap">
                  <span className="text-xs">Form Fee: {app.form_fee_paid ? <Badge className="bg-green-600 text-white text-xs">Paid</Badge> : <Badge variant="outline" className="text-xs">Unpaid</Badge>}</span>
                  <span className="text-xs">Tuition: <Badge variant="outline" className="text-xs">{app.tuition_payment_status || 'unpaid'}</Badge></span>
                  <span className="text-xs">Hostel: {app.hostel_needed ? (app.hostel_fee_paid ? <Badge className="bg-green-600 text-white text-xs">Paid</Badge> : <Badge variant="outline" className="text-xs">Needed, unpaid</Badge>) : <span className="text-muted-foreground text-xs">Not required</span>}</span>
                </div>
              </CardContent>
            </Card>

            {/* O-Level results */}
            {olevels.length > 0 && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">O-Level Results</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {olevels.map((o, i) => (
                      <div key={i} className="p-2 border rounded-md bg-muted/20 text-sm">
                        <div className="font-medium">{o.subject}</div>
                        <div className="text-xs text-muted-foreground">{o.grade} · {o.exam_type} {o.exam_year}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          </div>

          {/* ── RIGHT: Actions ─────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Status & Centre */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Application Status</CardTitle></CardHeader>
              <CardContent className="space-y-4">

                {/* Current status badge */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">Current:</span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLOR[app.status] || 'bg-slate-100 text-slate-700'}`}>
                    {STATUS_LABEL[app.status] || app.status}
                  </span>
                </div>

                {/* Action buttons — only valid next steps */}
                {app.status === 'active' ? (
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700 font-medium text-center">
                    This student is fully enrolled. No further status changes available.
                  </div>
                ) : (STATUS_TRANSITIONS[app.status] || []).length === 0 ? (
                  <div className="rounded-lg bg-muted/50 border p-3 text-xs text-muted-foreground text-center">
                    No status actions available for this state.
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-xs">Change Status</Label>
                    {(STATUS_TRANSITIONS[app.status] || []).map(option => {
                      const isGreen = option.value === 'admitted' || option.value === 'active' || option.value === 'submitted';
                      const isRed = option.value === 'rejected';
                      return (
                        <div key={option.value} className="space-y-1">
                          <Button
                            className={`w-full text-sm ${isGreen ? 'bg-green-600 hover:bg-green-700 text-white' : isRed ? 'bg-destructive hover:bg-destructive/90 text-white' : ''}`}
                            variant={isGreen || isRed ? 'default' : 'outline'}
                            disabled={saving}
                            onClick={() => saveStatus(option.value)}
                          >
                            {saving ? <Loader2 className="animate-spin mr-2" size={14} /> : null}
                            {option.label}
                          </Button>
                          {option.value === 'admitted' && (
                            <p className="text-[11px] text-green-700 flex items-center gap-1">
                              <CheckCircle size={10} /> Admission offer email sent automatically
                            </p>
                          )}
                          {option.value === 'rejected' && (
                            <p className="text-[11px] text-destructive flex items-center gap-1">
                              <AlertCircle size={10} /> Rejection email sent automatically
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Assign centre (always editable) */}
                <div className="space-y-1.5 pt-1 border-t">
                  <Label className="text-xs">Assign Centre</Label>
                  <select
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={assignedCentreId}
                    onChange={e => setAssignedCentreId(e.target.value)}
                  >
                    <option value="">— Use preferred centre —</option>
                    {centres.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name} – {c.state}</option>
                    ))}
                  </select>
                  {assignedCentreId !== (app.assigned_centre_id || '') && (
                    <Button size="sm" variant="outline" className="w-full text-xs" disabled={saving}
                      onClick={() => saveStatus(app.status)}>
                      {saving ? <Loader2 size={12} className="animate-spin mr-1" /> : null}
                      Save Centre Assignment
                    </Button>
                  )}
                </div>

                {/* Instalments toggle */}
                <div className="flex items-center gap-2 pt-1 border-t">
                  <Switch id="inst" checked={installmentsAllowed} onCheckedChange={v => {
                    setInstallmentsAllowed(v);
                    supabase.from('applications').update({ installments_allowed: v }).eq('id', app.id)
                      .then(() => toast({ title: v ? 'Instalments enabled' : 'Instalments disabled' }));
                  }} />
                  <Label htmlFor="inst" className="text-sm cursor-pointer">Allow tuition instalments</Label>
                </div>

                {/* Download PDF */}
                <Button variant="outline" size="sm" className="w-full text-xs" onClick={downloadPDF} disabled={downloadingPdf}>
                  {downloadingPdf
                    ? <><Loader2 size={13} className="animate-spin mr-1" /> Generating PDF…</>
                    : <><FileText size={13} className="mr-1" /> Download Student's Application PDF</>}
                </Button>
              </CardContent>
            </Card>

            {/* Passport Review */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Passport Photo</CardTitle>
                  <DocBadge status={passportStatus} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {app.passport_path ? (
                  <>
                    <Button size="sm" variant="outline" className="w-full" onClick={() => openDoc(app.passport_path)}>
                      <ExternalLink size={13} className="mr-1" /> View Photo
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        disabled={savingPassport || passportStatus === 'approved'}
                        onClick={() => savePassportReview('approved')}
                      >
                        {savingPassport ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} className="mr-1" />}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                        disabled={savingPassport || passportStatus === 'rejected'}
                        onClick={() => setPassportStatus('rejected')}
                      >
                        <XCircle size={13} className="mr-1" /> Reject
                      </Button>
                    </div>
                    {passportStatus === 'rejected' && app.passport_status !== 'rejected' && (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Reason for rejection (emailed to student)…"
                          value={passportMsg}
                          onChange={e => setPassportMsg(e.target.value)}
                          className="text-sm min-h-[60px]"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="w-full"
                          disabled={savingPassport || !passportMsg.trim()}
                          onClick={() => savePassportReview('rejected', passportMsg)}
                        >
                          {savingPassport ? <Loader2 size={13} className="animate-spin mr-1" /> : null}
                          Confirm Rejection &amp; Notify Student
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Not uploaded yet.</p>
                )}
              </CardContent>
            </Card>

            {/* O-Level Review */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">O-Level Result</CardTitle>
                  <DocBadge status={olevelStatus} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {app.olevel_path ? (
                  <>
                    <Button size="sm" variant="outline" className="w-full" onClick={() => openDoc(app.olevel_path)}>
                      <ExternalLink size={13} className="mr-1" /> View Document
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        disabled={savingOlevel || olevelStatus === 'approved'}
                        onClick={() => saveOlevelReview('approved')}
                      >
                        {savingOlevel ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} className="mr-1" />}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                        disabled={savingOlevel || olevelStatus === 'rejected'}
                        onClick={() => setOlevelStatus('rejected')}
                      >
                        <XCircle size={13} className="mr-1" /> Reject
                      </Button>
                    </div>
                    {olevelStatus === 'rejected' && app.olevel_status !== 'rejected' && (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Reason for rejection (emailed to student)…"
                          value={olevelMsg}
                          onChange={e => setOlevelMsg(e.target.value)}
                          className="text-sm min-h-[60px]"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="w-full"
                          disabled={savingOlevel || !olevelMsg.trim()}
                          onClick={() => saveOlevelReview('rejected', olevelMsg)}
                        >
                          {savingOlevel ? <Loader2 size={13} className="animate-spin mr-1" /> : null}
                          Confirm Rejection &amp; Notify Student
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Not uploaded yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Admission Letter — Step 2 of admission flow */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Admission Letter</CardTitle>
                  {app.admission_letter_path
                    ? <Badge className="bg-green-600 text-white text-xs">Uploaded</Badge>
                    : <Badge variant="outline" className="text-amber-600 border-amber-400 text-xs">Not uploaded</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Flow guide */}
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 space-y-1.5">
                  <p className="text-xs font-bold text-blue-800">Admission flow</p>
                  <div className="flex items-start gap-2 text-xs text-blue-700">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5 ${['admitted','fees_pending','active'].includes(app.status) ? 'bg-green-500 text-white' : 'bg-blue-200 text-blue-700'}`}>1</span>
                    <span>Set status to <strong>Admitted</strong> — sends "pay acceptance fee" email</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-blue-700">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5 ${app.admission_letter_path ? 'bg-green-500 text-white' : 'bg-blue-200 text-blue-700'}`}>2</span>
                    <span>Upload admission letter below — sends "letter ready" email to student</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-blue-700">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5 ${['fees_pending','active'].includes(app.status) ? 'bg-green-500 text-white' : 'bg-blue-200 text-blue-700'}`}>3</span>
                    <span>Student pays acceptance fee → auto-moves to Fees Pending</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-blue-700">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5 ${app.status === 'active' ? 'bg-green-500 text-white' : 'bg-blue-200 text-blue-700'}`}>4</span>
                    <span>Student pays tuition → auto-moves to Active</span>
                  </div>
                </div>

                {app.admission_letter_path && (
                  <Button size="sm" variant="outline" className="w-full" onClick={() => openDoc(app.admission_letter_path)}>
                    <ExternalLink size={13} className="mr-1" /> View Current Letter
                  </Button>
                )}
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="application/pdf"
                    className="w-full text-xs text-muted-foreground file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                    onChange={e => setLetterFile(e.target.files?.[0] || null)}
                  />
                  <Button size="sm" className="w-full" disabled={!letterFile || uploadingLetter} onClick={uploadAdmissionLetter}>
                    {uploadingLetter
                      ? <><Loader2 size={13} className="animate-spin mr-1" /> Uploading…</>
                      : <><Upload size={13} className="mr-1" /> {app.admission_letter_path ? 'Replace Letter' : 'Upload Letter'}</>}
                  </Button>
                  <p className="text-xs text-muted-foreground">PDF only, max 10 MB. Student can download once uploaded.</p>
                </div>
              </CardContent>
            </Card>

            {/* Document Requests — redesigned */}
            <Card>
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Document Requests</CardTitle>
                  {docRequests.filter(r => r.status === 'uploaded').length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">
                      {docRequests.filter(r => r.status === 'uploaded').length} awaiting review
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">

                {/* Existing requests */}
                {docRequests.length > 0 && (
                  <div className="space-y-3">
                    {docRequests.map((req: any) => {
                      const isPending = req.status === 'pending';
                      const isUploaded = req.status === 'uploaded';
                      const isAccepted = req.status === 'accepted';
                      const isCancelled = req.status === 'cancelled';
                      const isRejectingThis = docRejectReason[req.id] !== undefined;

                      return (
                        <div key={req.id} className={`rounded-xl border p-4 space-y-3 ${
                          isUploaded ? 'border-amber-300 bg-amber-50/50' :
                          isAccepted ? 'border-green-200 bg-green-50/30' :
                          isCancelled ? 'border-dashed border-slate-200 bg-slate-50/50 opacity-60' :
                          req.rejection_reason ? 'border-red-200 bg-red-50/30' :
                          'border-border bg-background'
                        }`}>
                          {/* Message */}
                          <p className="text-sm text-foreground leading-relaxed">{req.message}</p>

                          {/* Rejection reason if re-requested */}
                          {req.rejection_reason && isPending && (
                            <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-2.5">
                              <span className="font-semibold">Previously rejected:</span> {req.rejection_reason}
                            </div>
                          )}

                          {/* Meta row */}
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              isUploaded ? 'bg-amber-100 text-amber-700' :
                              isAccepted ? 'bg-green-100 text-green-700' :
                              isCancelled ? 'bg-slate-100 text-slate-500' :
                              'bg-blue-50 text-blue-700'
                            }`}>
                              {isUploaded && <><ClockIcon size={10} /> Awaiting Review</>}
                              {isAccepted && <><CheckCircle size={10} /> Accepted</>}
                              {isCancelled && <>Cancelled</>}
                              {isPending && <><ClockIcon size={10} /> {req.rejection_reason ? 'Re-upload requested' : 'Waiting for student'}</>}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {new Date(req.created_at).toLocaleDateString('en-GB')}
                            </span>
                          </div>

                          {/* Actions when uploaded */}
                          {isUploaded && (
                            <div className="space-y-2">
                              <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => openDoc(req.uploaded_path)}>
                                <ExternalLink size={12} className="mr-1" /> View Uploaded File
                              </Button>
                              {!isRejectingThis ? (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs"
                                    disabled={docActionLoading === req.id + 'accepted'}
                                    onClick={() => handleDocAction(req.id, 'accepted')}
                                  >
                                    {docActionLoading === req.id + 'accepted'
                                      ? <Loader2 size={12} className="animate-spin" />
                                      : <><ThumbsUp size={12} className="mr-1" /> Accept</>}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="flex-1 text-xs"
                                    onClick={() => setDocRejectReason(prev => ({ ...prev, [req.id]: '' }))}
                                  >
                                    <ThumbsDown size={12} className="mr-1" /> Reject
                                  </Button>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <Textarea
                                    placeholder="Reason for rejection — student will see this…"
                                    value={docRejectReason[req.id] || ''}
                                    onChange={e => setDocRejectReason(prev => ({ ...prev, [req.id]: e.target.value }))}
                                    className="text-xs min-h-[60px]"
                                  />
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      className="flex-1 text-xs"
                                      disabled={!docRejectReason[req.id]?.trim() || docActionLoading === req.id + 'reject'}
                                      onClick={() => handleDocReject(req.id)}
                                    >
                                      {docActionLoading === req.id + 'reject'
                                        ? <Loader2 size={12} className="animate-spin" />
                                        : 'Confirm Rejection'}
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-xs"
                                      onClick={() => setDocRejectReason(prev => { const n = { ...prev }; delete n[req.id]; return n; })}>
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Cancel pending request */}
                          {isPending && !isCancelled && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="w-full text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              disabled={docActionLoading === req.id + 'cancelled'}
                              onClick={() => handleDocAction(req.id, 'cancelled')}
                            >
                              {docActionLoading === req.id + 'cancelled'
                                ? <Loader2 size={12} className="animate-spin mr-1" />
                                : <Ban size={12} className="mr-1" />}
                              Cancel this request
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Send new request */}
                <div className="space-y-3 pt-2 border-t">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Send New Request</p>

                  {/* Presets as proper chips */}
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground">Quick presets:</p>
                    <div className="flex flex-col gap-1.5">
                      {[
                        'Please upload a clear copy of your WAEC result slip.',
                        'Please upload a government-issued ID (NIN slip or national ID card).',
                        'Please upload a recent passport photograph with white background.',
                        'Please upload your birth certificate or age declaration.',
                        'Please upload a letter of good conduct from your last school.',
                      ].map(preset => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setDocRequestMsg(preset)}
                          className={`text-xs px-3 py-2 rounded-lg border text-left leading-snug transition-colors ${
                            docRequestMsg === preset
                              ? 'bg-primary/10 border-primary text-primary font-medium'
                              : 'bg-muted/40 border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Textarea
                    placeholder="Or type a custom message…"
                    value={docRequestMsg}
                    onChange={e => setDocRequestMsg(e.target.value)}
                    className="text-sm min-h-[80px]"
                  />
                  <Button
                    className="w-full"
                    disabled={sendingDocRequest || !docRequestMsg.trim()}
                    onClick={sendDocumentRequest}
                  >
                    {sendingDocRequest
                      ? <><Loader2 size={14} className="animate-spin mr-2" /> Sending…</>
                      : <><MessageSquarePlus size={14} className="mr-2" /> Send Request & Email Student</>}
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </>
  );
};

// tiny helper to avoid repeating label/value markup
function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{label}</div>
      <div className="text-sm mt-0.5">{value || <span className="text-muted-foreground italic">—</span>}</div>
    </div>
  );
}

export default AdminApplicationDetail;
