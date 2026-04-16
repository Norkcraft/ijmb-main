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
  ArrowLeft, ExternalLink, Loader2, CheckCircle, XCircle, Eye, AlertCircle, Upload
} from 'lucide-react';

// ── helpers ────────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: 'draft',         label: 'Draft — not submitted' },
  { value: 'payment_pending', label: 'Payment Pending' },
  { value: 'submitted',     label: 'Submitted — under review' },
  { value: 'admitted',      label: 'Admitted ✓' },
  { value: 'fees_pending',  label: 'Fees Pending (acceptance paid)' },
  { value: 'active',        label: 'Active Student' },
  { value: 'rejected',      label: 'Rejected ✗' },
];

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
        'Authorization': `Bearer ${token}`,
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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [appRes, centreRes, olRes] = await Promise.all([
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
      setLoading(false);
    };
    load();
  }, [id]);

  // ── save main status / centre ──────────────────────────────────────────
  const saveStatus = async () => {
    if (!app) return;
    setSaving(true);
    try {
      const wasAdmittedBefore = ['admitted', 'fees_pending', 'active'].includes(app.status);
      const isAdmitting = status === 'admitted' && !wasAdmittedBefore;
      const isRejecting = status === 'rejected' && app.status !== 'rejected';

      const { error } = await supabase.from('applications').update({
        status,
        assigned_centre_id: assignedCentreId || null,
        admission_granted: ['admitted', 'fees_pending', 'active'].includes(status),
        installments_allowed: installmentsAllowed,
        updated_at: new Date().toISOString(),
      }).eq('id', app.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }

      setApp((prev: any) => ({ ...prev, status, assigned_centre_id: assignedCentreId, installments_allowed: installmentsAllowed }));
      toast({ title: 'Status updated' });

      const studentEmail = app.profiles?.email;
      const studentName = app.first_name
        ? `${app.first_name} ${app.surname}`
        : (app.profiles?.full_name || 'Student');
      const appId = app.application_number || app.id.split('-')[0].toUpperCase();
      const centreName = centres.find(c => c.id === (assignedCentreId || app.preferred_centre_id))?.name
        || app.preferred_centre?.name || 'To be confirmed';

      // Fire-and-forget — never await email sends so they can't block the UI
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
        sendEmail('account_update', {
          email: studentEmail,
          fullName: studentName,
          changeDescription: `Your IJMB application (ID: ${appId}) has been reviewed and was not successful at this time. Please contact support for further guidance.`,
        }, toast);
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Something went wrong', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
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

      const res = await fetch('/api/upload-admission-letter', {
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
                <div className="space-y-1.5">
                  <Label className="text-xs">Status</Label>
                  <select
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                  >
                    {STATUS_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  {status === 'admitted' && app.status !== 'admitted' && (
                    <p className="text-xs text-green-700 flex items-center gap-1 mt-1">
                      <CheckCircle size={11} /> Admission offer email will be sent automatically.
                    </p>
                  )}
                  {status === 'rejected' && app.status !== 'rejected' && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle size={11} /> Rejection notification email will be sent.
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Assign Centre</Label>
                  <select
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={assignedCentreId}
                    onChange={e => setAssignedCentreId(e.target.value)}
                  >
                    <option value="">— Use preferred centre —</option>
                    {centres.map(c => (
                      <option key={c.id} value={c.id}>{c.name} – {c.state}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Switch id="inst" checked={installmentsAllowed} onCheckedChange={setInstallmentsAllowed} />
                  <Label htmlFor="inst" className="text-sm cursor-pointer">Allow tuition instalments</Label>
                </div>

                <Button onClick={saveStatus} disabled={saving} className="w-full">
                  {saving ? <><Loader2 className="animate-spin mr-2" size={15} /> Saving…</> : 'Save Changes'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => window.open(`/portal-admin/applications/${app.id}/print`, '_blank')}
                >
                  <Eye size={13} className="mr-1" /> Open Print View
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

            {/* Admission Letter Upload */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Admission Letter</CardTitle>
                  {app.admission_letter_path
                    ? <Badge className="bg-green-600 text-white">Uploaded</Badge>
                    : <Badge variant="outline" className="text-amber-600 border-amber-400">Not uploaded</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
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
                  <Button
                    size="sm"
                    className="w-full"
                    disabled={!letterFile || uploadingLetter}
                    onClick={uploadAdmissionLetter}
                  >
                    {uploadingLetter
                      ? <><Loader2 size={13} className="animate-spin mr-1" /> Uploading…</>
                      : <><Upload size={13} className="mr-1" /> {app.admission_letter_path ? 'Replace Letter' : 'Upload Letter'}</>}
                  </Button>
                  <p className="text-xs text-muted-foreground">PDF only, max 10 MB. Student can download once uploaded.</p>
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
