import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, ExternalLink, Loader2 } from 'lucide-react';

const AdminApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [app, setApp] = useState<any>(null);
  const [centres, setCentres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Editable fields
  const [status, setStatus] = useState('');
  const [assignedCentreId, setAssignedCentreId] = useState('');
  const [admissionGranted, setAdmissionGranted] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const [appRes, centreRes] = await Promise.all([
        supabase.from('applications').select(`
          *,
          profiles:user_id(full_name, phone, id),
          session:session_id(name, code),
          preferred_centre:preferred_centre_id(name, state),
          assigned_centre:assigned_centre_id(name, state),
          subject_combo:subject_combination_id(name, track)
        `).eq('id', id).single(),
        supabase.from('centres').select('*'),
      ]);
      if (appRes.data) {
        setApp(appRes.data);
        setStatus(appRes.data.status);
        setAssignedCentreId(appRes.data.assigned_centre_id || '');
        setAdmissionGranted(appRes.data.admission_granted || false);
      }
      setCentres(centreRes.data || []);
      setLoading(false);
    };
    fetch();
  }, [id]);

  const saveChanges = async () => {
    if (!app) return;
    setSaving(true);
    const isAdmitted = status === 'admitted';
    const { error } = await supabase.from('applications').update({
      status,
      assigned_centre_id: assignedCentreId || null,
      admission_granted: isAdmitted ? true : admissionGranted,
      updated_at: new Date().toISOString(),
    }).eq('id', app.id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Application updated!' });
      if (isAdmitted) setAdmissionGranted(true);
    }
    setSaving(false);
  };

  const openDoc = async (path: string) => {
    const { data } = await supabase.storage.from('student-documents').createSignedUrl(path, 300);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank');
  };

  const uploadAdmissionLetter = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.jpg,.jpeg,.png,.pdf';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file || !app) return;
      setUploading(true);
      const ext = file.name.split('.').pop();
      const userId = app.profiles?.id || app.user_id;
      const path = `${userId}/admission_letter.${ext}`;

      const { error: upErr } = await supabase.storage.from('student-documents').upload(path, file, { upsert: true });
      if (upErr) {
        toast({ title: 'Upload failed', description: upErr.message, variant: 'destructive' });
        setUploading(false);
        return;
      }

      await supabase.from('applications').update({ admission_letter_path: path, updated_at: new Date().toISOString() }).eq('id', app.id);
      setApp({ ...app, admission_letter_path: path });
      toast({ title: 'Admission letter uploaded!' });
      setUploading(false);
    };
    input.click();
  };

  // Get user email from auth (we don't have it in profiles, so show user_id or fetch separately)
  // For simplicity, we'll note it's in auth

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!app) {
    return <div className="section-padding text-center py-20"><p className="text-muted-foreground">Application not found.</p></div>;
  }

  return (
    <>
      <SEOHead title={`Application – ${app.profiles?.full_name || 'Student'}`} description="Admin view of student application." canonical={`https://www.ijmb.info/portal-admin/applications/${id}`} />
      <div className="section-padding max-w-4xl mx-auto space-y-6 py-8">
        <Button variant="ghost" onClick={() => navigate('/portal-admin')} className="mb-2">
          <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
        </Button>

        {/* Student Info */}
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong>Name:</strong> {app.profiles?.full_name || '—'}</div>
            <div><strong>Phone:</strong> {app.profiles?.phone || '—'}</div>
            <div><strong>User ID:</strong> <span className="text-xs text-muted-foreground">{app.user_id}</span></div>
            <div><strong>Session:</strong> {app.session?.name} ({app.session?.code})</div>
            <div><strong>Subject Combination:</strong> {app.subject_combo?.name} ({app.subject_combo?.track})</div>
            <div><strong>Preferred Centre:</strong> {app.preferred_centre?.name}, {app.preferred_centre?.state}</div>
            <div><strong>Form Fee Paid:</strong> {app.form_fee_paid ? '✅ Yes' : '❌ No'}</div>
            <div><strong>Created:</strong> {new Date(app.created_at).toLocaleString()}</div>
          </CardContent>
        </Card>

        {/* Admin Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Application Management</CardTitle>
            <CardDescription>Update status, assigned centre, and admission.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="draft">Draft</option>
                  <option value="review">Under Review</option>
                  <option value="admitted">Admitted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Assigned Centre</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={assignedCentreId} onChange={e => setAssignedCentreId(e.target.value)}>
                  <option value="">-- None --</option>
                  {centres.map(c => <option key={c.id} value={c.id}>{c.name} – {c.state}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="admGranted" checked={admissionGranted} onChange={e => setAdmissionGranted(e.target.checked)} />
              <Label htmlFor="admGranted">Admission Granted</Label>
            </div>
            {status === 'admitted' && <p className="text-xs text-muted-foreground">Setting status to "admitted" will automatically grant admission.</p>}
            <div className="text-xs text-muted-foreground p-2 border rounded bg-muted/50">📧 Send email notification — Coming in Phase 4</div>
            <Button onClick={saveChanges} disabled={saving}>
              {saving ? <><Loader2 className="animate-spin mr-2" size={16} /> Saving...</> : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader><CardTitle>Student Documents</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>Passport Photo</span>
              {app.passport_path ? (
                <Button size="sm" variant="outline" onClick={() => openDoc(app.passport_path)}>
                  <ExternalLink size={14} className="mr-1" /> View
                </Button>
              ) : <Badge variant="outline">Not uploaded</Badge>}
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>O-Level Result</span>
              {app.olevel_path ? (
                <Button size="sm" variant="outline" onClick={() => openDoc(app.olevel_path)}>
                  <ExternalLink size={14} className="mr-1" /> View
                </Button>
              ) : <Badge variant="outline">Not uploaded</Badge>}
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>Admission Letter</span>
              <div className="flex gap-2">
                {app.admission_letter_path && (
                  <Button size="sm" variant="outline" onClick={() => openDoc(app.admission_letter_path)}>
                    <ExternalLink size={14} className="mr-1" /> View
                  </Button>
                )}
                <Button size="sm" onClick={uploadAdmissionLetter} disabled={uploading}>
                  {uploading ? <Loader2 className="animate-spin" size={16} /> : <><Upload size={14} className="mr-1" /> Upload</>}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminApplicationDetail;
