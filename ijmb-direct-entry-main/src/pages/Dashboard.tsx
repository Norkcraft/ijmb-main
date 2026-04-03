import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle, Circle, Clock, Upload, Download, FileText,
  User, Loader2, LogOut, AlertCircle, CreditCard, Printer
} from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  review: 'Under Review',
  admitted: 'Admitted',
  rejected: 'Rejected',
};

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  review: 'bg-blue-100 text-blue-800',
  admitted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const FORM_FEE = '₦5,500';

const Dashboard = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [application, setApplication] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [centres, setCentres] = useState<any[]>([]);
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  // Form state
  const [sessionId, setSessionId] = useState('');
  const [centreId, setCentreId] = useState('');
  const [comboId, setComboId] = useState('');

  // Profile edit
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const [appRes, sessRes, centreRes, comboRes] = await Promise.all([
      supabase.from('applications').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('sessions').select('*').eq('status', 'open'),
      supabase.from('centres').select('*').eq('active', true),
      supabase.from('subject_combinations').select('*').eq('active', true),
    ]);

    if (appRes.data) {
      setApplication(appRes.data);
      setSessionId(appRes.data.session_id || '');
      setCentreId(appRes.data.preferred_centre_id || '');
      setComboId(appRes.data.subject_combination_id || '');
    }
    setSessions(sessRes.data || []);
    setCentres(centreRes.data || []);
    setCombos(comboRes.data || []);
    setEditName(profile?.full_name || '');
    setEditPhone(profile?.phone || '');
    setLoading(false);
  }, [user, profile]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const saveApplication = async (submit = false) => {
    if (!user) return;

    if (submit) {
      if (!formFeePaid) {
        toast({ title: 'Payment required', description: `Please pay the form fee of ${FORM_FEE} before submitting.`, variant: 'destructive' });
        return;
      }
      if (!application?.passport_path) {
        toast({ title: 'Passport required', description: 'Please upload your passport photo before submitting.', variant: 'destructive' });
        return;
      }
      if (!application?.olevel_path) {
        toast({ title: 'O-Level result required', description: 'Please upload your O-Level result before submitting.', variant: 'destructive' });
        return;
      }
      if (!sessionId || !centreId || !comboId) {
        toast({ title: 'Incomplete form', description: 'Please select session, centre, and subject combination.', variant: 'destructive' });
        return;
      }
    }

    setSaving(true);
    const payload = {
      user_id: user.id,
      session_id: sessionId || null,
      preferred_centre_id: centreId || null,
      subject_combination_id: comboId || null,
      status: submit ? 'review' : 'draft',
      updated_at: new Date().toISOString(),
    };

    let res;
    if (application?.id) {
      res = await supabase.from('applications').update(payload).eq('id', application.id).select().single();
    } else {
      res = await supabase.from('applications').insert(payload).select().single();
    }

    if (res.error) {
      toast({ title: 'Error', description: res.error.message, variant: 'destructive' });
    } else {
      setApplication(res.data);
      toast({ title: submit ? 'Application submitted for review!' : 'Application saved as draft' });
    }
    setSaving(false);
  };

  const handleFileUpload = async (type: 'passport' | 'olevel') => {
    if (!application?.id) {
      // Auto-create draft first
      if (!user) return;
      const { data, error } = await supabase.from('applications').insert({
        user_id: user.id,
        status: 'draft',
      }).select().single();
      if (error || !data) {
        toast({ title: 'Error', description: 'Please save your application first.', variant: 'destructive' });
        return;
      }
      setApplication(data);
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.jpg,.jpeg,.png,.pdf';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file || !user) return;
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: 'File too large', description: 'Max 5MB allowed', variant: 'destructive' });
        return;
      }
      setUploading(type);
      const ext = file.name.split('.').pop();
      const path = `${user.id}/${type}.${ext}`;

      const { error: uploadError } = await supabase.storage.from('student-documents').upload(path, file, { upsert: true });
      if (uploadError) {
        toast({ title: 'Upload failed', description: uploadError.message, variant: 'destructive' });
        setUploading(null);
        return;
      }

      const column = type === 'passport' ? 'passport_path' : 'olevel_path';
      const appId = application?.id;
      if (appId) {
        await supabase.from('applications').update({ [column]: path, updated_at: new Date().toISOString() }).eq('id', appId);
        setApplication((prev: any) => ({ ...prev, [column]: path }));
      }
      toast({ title: `${type === 'passport' ? 'Passport photo' : 'O-Level result'} uploaded!` });
      setUploading(null);
    };
    input.click();
  };

  const downloadAdmissionLetter = async () => {
    if (!application?.admission_letter_path) return;
    const { data } = await supabase.storage.from('student-documents').createSignedUrl(application.admission_letter_path, 300);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank');
  };

  const updateProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({ full_name: editName, phone: editPhone }).eq('id', user.id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Profile updated!' });
      await refreshProfile();
      setEditingProfile(false);
    }
    setSaving(false);
  };

  // Step calculation
  const emailVerified = user?.email_confirmed_at != null;
  const formFeePaid = application?.form_fee_paid || false;
  const appSubmitted = application && application.status !== 'draft';
  const docsUploaded = application?.passport_path && application?.olevel_path;
  const isAdmitted = application?.status === 'admitted';
  const hasAdmissionLetter = isAdmitted && application?.admission_letter_path;

  const canSubmit = formFeePaid && !!docsUploaded && !!sessionId && !!centreId && !!comboId;

  const steps = [
    { label: 'Create Account', done: true, icon: CheckCircle },
    { label: 'Verify Email', done: emailVerified, icon: emailVerified ? CheckCircle : AlertCircle },
    { label: `Pay Form Fee (${FORM_FEE})`, done: formFeePaid, icon: formFeePaid ? CheckCircle : CreditCard },
    { label: 'Fill Application Form', done: !!application && (!!sessionId && !!centreId && !!comboId), icon: (!!application && !!sessionId && !!centreId && !!comboId) ? CheckCircle : Circle },
    { label: 'Upload Documents', done: !!docsUploaded, icon: docsUploaded ? CheckCircle : Circle },
    { label: 'Submit Application', done: !!appSubmitted, icon: appSubmitted ? CheckCircle : Circle },
    { label: 'Admission Decision', done: isAdmitted || application?.status === 'rejected', icon: isAdmitted ? CheckCircle : Circle },
  ];

  const completedSteps = steps.filter(s => s.done).length;
  const progressPercent = Math.round((completedSteps / steps.length) * 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <SEOHead title="Student Dashboard – IJMB" description="Manage your IJMB application." canonical="https://www.ijmb.info/dashboard" />
      <div className="section-padding max-w-4xl mx-auto space-y-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold">Welcome, {profile?.full_name || 'Student'}</h1>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
          </div>
          <Button variant="outline" onClick={signOut}><LogOut size={16} className="mr-2" /> Logout</Button>
        </div>

        {/* Status Panel */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Application Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progressPercent} className="h-3" />
            <div className="flex flex-wrap gap-3 text-sm">
              <Badge variant="outline">
                Email: {emailVerified ? '✅ Verified' : '⏳ Pending'}
              </Badge>
              {application && (
                <>
                  <Badge className={STATUS_COLORS[application.status] || ''}>
                    Status: {STATUS_LABELS[application.status] || application.status}
                  </Badge>
                  <Badge variant="outline">
                    Payment: {formFeePaid ? '✅ Paid' : `⏳ ${FORM_FEE} required`}
                  </Badge>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Your Journey</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <step.icon size={20} className={step.done ? 'text-green-600' : 'text-muted-foreground'} />
                  <span className={step.done ? 'text-foreground' : 'text-muted-foreground'}>
                    Step {i + 1}: {step.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form Fee Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><CreditCard size={20} /> Form Fee Payment</CardTitle>
            <CardDescription>Pay the registration form fee of {FORM_FEE} to proceed</CardDescription>
          </CardHeader>
          <CardContent>
            {formFeePaid ? (
              <div className="space-y-3">
                <p className="text-sm text-green-700 flex items-center gap-2"><CheckCircle size={16} /> Form fee paid successfully.</p>
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer size={16} className="mr-2" /> Download Registration Slip
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 border rounded-lg bg-accent/10 text-center">
                  <p className="text-2xl font-heading font-bold text-primary mb-1">{FORM_FEE}</p>
                  <p className="text-sm text-muted-foreground">IJMB Registration Form Fee</p>
                </div>
                <Button className="w-full cta-gradient" disabled>
                  <CreditCard size={16} className="mr-2" /> Pay {FORM_FEE} via Paystack
                </Button>
                <p className="text-xs text-muted-foreground text-center">Payment integration will be enabled soon. Contact support for manual payment.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Application Form</CardTitle>
            <CardDescription>Select your session, preferred centre, and subject combination</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Session</Label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={sessionId} onChange={e => setSessionId(e.target.value)} disabled={!!appSubmitted}>
                <option value="">-- Select Session --</option>
                {sessions.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Preferred Centre</Label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={centreId} onChange={e => setCentreId(e.target.value)} disabled={!!appSubmitted}>
                <option value="">-- Select Centre --</option>
                {centres.map(c => <option key={c.id} value={c.id}>{c.name} – {c.state}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Subject Combination</Label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={comboId} onChange={e => setComboId(e.target.value)} disabled={!!appSubmitted}>
                <option value="">-- Select Combination --</option>
                {combos.map(c => <option key={c.id} value={c.id}>{c.name} ({c.track})</option>)}
              </select>
            </div>
            {!appSubmitted && (
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => saveApplication(false)} disabled={saving}>
                  {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : null} Save Draft
                </Button>
                <Button
                  className="cta-gradient"
                  onClick={() => saveApplication(true)}
                  disabled={saving || !canSubmit}
                  title={!canSubmit ? 'Complete payment, upload documents, and fill all fields to submit' : ''}
                >
                  Submit Application
                </Button>
              </div>
            )}
            {!appSubmitted && !canSubmit && (
              <p className="text-xs text-muted-foreground">
                To submit: {!formFeePaid && `pay form fee (${FORM_FEE})`}{!formFeePaid && (!docsUploaded || !sessionId || !centreId || !comboId) ? ', ' : ''}
                {!docsUploaded && 'upload passport & O-Level'}{!docsUploaded && (!sessionId || !centreId || !comboId) ? ', ' : ''}
                {(!sessionId || !centreId || !comboId) && 'select all dropdowns'}
              </p>
            )}
            {appSubmitted && <p className="text-sm text-muted-foreground">Your application has been submitted and is {STATUS_LABELS[application.status]?.toLowerCase()}.</p>}
          </CardContent>
        </Card>

        {/* Document Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Document Upload</CardTitle>
            <CardDescription>Upload your passport photo and O-Level result (JPG, PNG, or PDF, max 5MB)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText size={20} className={application?.passport_path ? 'text-green-600' : 'text-muted-foreground'} />
                <span>Passport Photo</span>
                {application?.passport_path && <Badge variant="outline" className="text-green-700">Uploaded</Badge>}
              </div>
              <Button size="sm" variant="outline" onClick={() => handleFileUpload('passport')} disabled={uploading === 'passport' || !!appSubmitted}>
                {uploading === 'passport' ? <Loader2 className="animate-spin" size={16} /> : <><Upload size={14} className="mr-1" /> Upload</>}
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText size={20} className={application?.olevel_path ? 'text-green-600' : 'text-muted-foreground'} />
                <span>O-Level Result</span>
                {application?.olevel_path && <Badge variant="outline" className="text-green-700">Uploaded</Badge>}
              </div>
              <Button size="sm" variant="outline" onClick={() => handleFileUpload('olevel')} disabled={uploading === 'olevel' || !!appSubmitted}>
                {uploading === 'olevel' ? <Loader2 className="animate-spin" size={16} /> : <><Upload size={14} className="mr-1" /> Upload</>}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Admission Letter + Assigned Centre */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Admission Status</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {isAdmitted && application?.assigned_centre_id && (
              <p className="text-sm flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                <strong>Assigned Centre:</strong> {centres.find(c => c.id === application.assigned_centre_id)?.name || 'See admission letter'}
              </p>
            )}
            {hasAdmissionLetter ? (
              <Button onClick={downloadAdmissionLetter}><Download size={16} className="mr-2" /> Download Admission Letter</Button>
            ) : (
              <p className="text-muted-foreground text-sm flex items-center gap-2">
                <Clock size={16} /> {isAdmitted ? 'Admission letter is being prepared...' : appSubmitted ? 'Your application is under review. You will be notified once a decision is made.' : 'Submit your application to begin the review process.'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Profile Edit */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><User size={20} /> Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {editingProfile ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={editName} onChange={e => setEditName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={updateProfile} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                  <Button variant="outline" onClick={() => setEditingProfile(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p><strong>Name:</strong> {profile?.full_name}</p>
                <p><strong>Phone:</strong> {profile?.phone}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <Button variant="outline" size="sm" onClick={() => setEditingProfile(true)} className="mt-2">Edit Profile</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
