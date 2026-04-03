import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, ExternalLink, Loader2, CheckCircle, XCircle, FileText, Download, Eye, RefreshCw } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const AdminApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [app, setApp] = useState<any>(null);
  const [centres, setCentres] = useState<any[]>([]);
  const [olevels, setOlevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Editable fields
  const [status, setStatus] = useState('');
  const [assignedCentreId, setAssignedCentreId] = useState('');
  const [admissionGranted, setAdmissionGranted] = useState(false);
  const [installmentsAllowed, setInstallmentsAllowed] = useState(false);

  // Document states
  const [docReview, setDocReview] = useState<{
    passport_status: string;
    olevel_status: string;
    passport_msg: string;
    olevel_msg: string;
  }>({
    passport_status: 'pending',
    olevel_status: 'pending',
    passport_msg: '',
    olevel_msg: ''
  });

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const [appRes, centreRes, olRes] = await Promise.all([
        supabase.from('applications').select(`
          *,
          profiles:user_id(full_name, phone, id),
          session:session_id(name, code),
          preferred_centre:preferred_centre_id(name, state),
          assigned_centre:assigned_centre_id(name, state),
          subject_combo:subject_combination_id(name, track)
        `).eq('id', id).single(),
        supabase.from('centres').select('*'),
        supabase.from('olevel_results').select('*').eq('application_id', id)
      ]);
      if (appRes.data) {
        setApp(appRes.data);
        setStatus(appRes.data.status);
        setAssignedCentreId(appRes.data.assigned_centre_id || '');
        setAdmissionGranted(appRes.data.admission_granted || false);
        setInstallmentsAllowed(appRes.data.installments_allowed || false);
        setDocReview({
          passport_status: appRes.data.passport_status || 'pending',
          olevel_status: appRes.data.olevel_status || 'pending',
          passport_msg: appRes.data.passport_msg || '',
          olevel_msg: appRes.data.olevel_msg || ''
        });
        setOlevels(olRes.data || []);
      }
      setCentres(centreRes.data || []);
      setLoading(false);
    };
    fetch();
  }, [id]);

  const saveChanges = async () => {
    if (!app) return;
    setSaving(true);
    const isAdmitted = ['admitted', 'fees_pending', 'active'].includes(status);
    const { error } = await supabase.from('applications').update({
      status,
      assigned_centre_id: assignedCentreId || null,
      admission_granted: isAdmitted ? true : admissionGranted,
      installments_allowed: installmentsAllowed,
      passport_status: docReview.passport_status,
      olevel_status: docReview.olevel_status,
      passport_msg: docReview.passport_status === 'rejected' ? docReview.passport_msg : null,
      olevel_msg: docReview.olevel_status === 'rejected' ? docReview.olevel_msg : null,
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

  const generateApplicationPdf = async () => {
    setGeneratingPdf(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch('/api/admin/regenerate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ applicationId: app.id })
      });
      
      if (!res.ok) {
        // Try to parse JSON error, fallback to text if not JSON
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const err = await res.json();
          throw new Error(err.message || 'Generation failed');
        } else {
          const errText = await res.text();
          throw new Error(errText || 'Generation failed with server error');
        }
      }
      
      const data = await res.json();
      
      // Update local state
      setApp((prev: any) => ({ ...prev, application_form_url: data.url }));
      toast({ title: 'Success', description: 'Application form generated successfully' });
      
    } catch (error: any) {
      console.error(error);
      toast({ title: 'Error', description: error.message || 'Failed to generate PDF', variant: 'destructive' });
    } finally {
      setGeneratingPdf(false);
    }
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

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!app) {
    return <div className="section-padding text-center py-20"><p className="text-muted-foreground">Application not found.</p></div>;
  }

  return (
    <>
      <SEOHead title={`Application – ${app.profiles?.full_name || 'Student'}`} description="Admin view of student application." canonical={`https://www.ijmb.info/portal-admin/applications/${id}`} />
      <div className="section-padding max-w-6xl mx-auto space-y-6 py-8">
        <Button variant="ghost" onClick={() => navigate('/portal-admin')} className="mb-2">
          <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <Card>
              <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Full Name:</strong> {app.surname} {app.first_name} {app.middle_name}</div>
                <div><strong>Phone:</strong> {app.guardian_phone || app.profiles?.phone || '—'}</div>
                <div><strong>Gender:</strong> {app.gender || '—'}</div>
                <div><strong>Date of Birth:</strong> {app.date_of_birth || '—'}</div>
                <div><strong>State of Origin:</strong> {app.state_of_origin || '—'}</div>
                <div><strong>LGA:</strong> {app.lga || '—'}</div>
                <div className="col-span-2"><strong>Address:</strong> {app.residential_address || '—'}</div>
              </CardContent>
            </Card>

            {/* Guardian Info */}
            <Card>
              <CardHeader><CardTitle>Guardian Details</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Guardian Name:</strong> {app.guardian_name || '—'}</div>
                <div><strong>Guardian Phone:</strong> {app.guardian_phone || '—'}</div>
                <div className="col-span-2"><strong>Occupation:</strong> {app.guardian_occupation || '—'}</div>
              </CardContent>
            </Card>

            {/* Academic Info */}
            <Card>
              <CardHeader><CardTitle>Academic Information</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><strong>O-Level Type:</strong> {app.olevel_exam_type || '—'}</div>
                  <div><strong>Exam Year:</strong> {app.olevel_exam_year || '—'}</div>
                  <div><strong>Exam Number:</strong> {app.olevel_exam_number || '—'}</div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Detailed Results</h4>
                  {olevels.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {olevels.map((o, i) => (
                        <div key={i} className="p-2 border rounded bg-muted/20">
                          <div className="font-medium">{o.subject}</div>
                          <div className="text-xs text-muted-foreground">{o.grade} ({o.exam_type} {o.exam_year})</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">No results uploaded.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Programme Info */}
            <Card>
              <CardHeader><CardTitle>Programme Selection</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Intended Course:</strong> {app.intended_course || '—'}</div>
                <div><strong>Session:</strong> {app.session?.name} ({app.session?.code})</div>
                <div><strong>Subject Combination:</strong> {app.subject_combo?.name} ({app.subject_combo?.track})</div>
                <div><strong>Preferred Centre:</strong> {app.preferred_centre?.name}, {app.preferred_centre?.state}</div>
                <div><strong>Form Fee Paid:</strong> {app.form_fee_paid ? <Badge className="bg-green-600">Yes</Badge> : <Badge variant="destructive">No</Badge>}</div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar / Actions */}
          <div className="space-y-6">
             {/* Admin Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Application Management</CardTitle>
                <CardDescription>Update status and admission.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="draft">Registration Started</option>
                    <option value="submitted">Registration Submitted</option>
                    <option value="payment_pending">Payment Pending</option>
                    <option value="payment_completed">Payment Completed</option>
                    <option value="review">Under Review</option>
                    <option value="admitted">Admission Approved</option>
                    <option value="fees_pending">Programme Fees Pending</option>
                    <option value="active">Active Student</option>
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
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="admGranted" checked={admissionGranted} onChange={e => setAdmissionGranted(e.target.checked)} className="h-4 w-4" />
                  <Label htmlFor="admGranted">Admission Granted</Label>
                </div>
                
                <div className="flex items-center gap-2 pt-2">
                  <Switch id="inst" checked={installmentsAllowed} onCheckedChange={setInstallmentsAllowed} />
                  <Label htmlFor="inst">Allow Tuition Installments</Label>
                </div>

                <div className="pt-4 border-t space-y-2 text-sm">
                  <h4 className="font-semibold mb-2">Application Documents</h4>
                  
                  {app.application_form_url ? (
                    <div className="bg-muted/30 p-3 rounded-md border space-y-3">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <FileText size={16} className="text-blue-600" />
                           <span className="font-medium">Application Form</span>
                         </div>
                         <Badge variant="outline" className="bg-green-50 text-green-700">Generated</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">ID: {app.application_number || app.id.split('-')[0].toUpperCase()}</div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 h-8 text-xs"
                          onClick={() => window.open(app.application_form_url, '_blank')}
                        >
                          <Download size={12} className="mr-1" /> Download
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 h-8 text-xs"
                          onClick={() => window.open(`/verify/${app.id}`, '_blank')}
                        >
                          <Eye size={12} className="mr-1" /> Verify Page
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-muted/30 p-3 rounded-md border flex items-center justify-between text-muted-foreground">
                      <span className="text-xs italic">Form not yet generated (Fee unpaid or missing)</span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-6 text-xs"
                        onClick={generateApplicationPdf}
                        disabled={generatingPdf}
                      >
                        {generatingPdf ? <Loader2 size={12} className="animate-spin" /> : <><RefreshCw size={12} className="mr-1" /> Generate Now</>}
                      </Button>
                    </div>
                  )}

                  <h4 className="font-semibold mb-2 mt-4">Fee Status</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tuition Status:</span>
                    <Badge variant="outline">{app.tuition_payment_status || 'Pending'}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tuition Paid:</span>
                    <span className="font-medium">₦{app.tuition_amount_paid?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Hostel Required:</span>
                    <Badge variant={app.hostel_needed ? 'default' : 'secondary'}>{app.hostel_needed ? 'Yes' : 'No'}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Hostel Fee:</span>
                    {app.hostel_fee_paid ? <Badge className="bg-green-600">Paid</Badge> : <span className="text-muted-foreground text-xs">Unpaid</span>}
                  </div>
                </div>

                <Button onClick={saveChanges} disabled={saving} className="w-full">
                  {saving ? <><Loader2 className="animate-spin mr-2" size={16} /> Saving...</> : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                {/* Passport Review */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded text-sm bg-muted/20">
                    <span className="font-semibold">Passport Photograph</span>
                    {app.passport_path ? (
                      <Button size="sm" variant="ghost" onClick={() => openDoc(app.passport_path)}>
                        <ExternalLink size={14} className="mr-1" /> View Image
                      </Button>
                    ) : <Badge variant="outline">Missing</Badge>}
                  </div>
                  {app.passport_path && (
                    <div className="pl-2 space-y-2 border-l-2 border-primary/20">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant={docReview.passport_status === 'approved' ? 'default' : 'outline'}
                          className={docReview.passport_status === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
                          onClick={() => setDocReview(p => ({ ...p, passport_status: 'approved' }))}
                        >
                          <CheckCircle size={14} className="mr-1" /> Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant={docReview.passport_status === 'rejected' ? 'destructive' : 'outline'}
                          onClick={() => setDocReview(p => ({ ...p, passport_status: 'rejected' }))}
                        >
                          <XCircle size={14} className="mr-1" /> Reject
                        </Button>
                      </div>
                      {docReview.passport_status === 'rejected' && (
                        <Textarea 
                          placeholder="Reason for rejection (sent to student)..."
                          value={docReview.passport_msg}
                          onChange={(e) => setDocReview(p => ({ ...p, passport_msg: e.target.value }))}
                          className="text-sm mt-2"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* O-Level Review */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded text-sm bg-muted/20">
                    <span className="font-semibold">O-Level Result</span>
                    {app.olevel_path ? (
                      <Button size="sm" variant="ghost" onClick={() => openDoc(app.olevel_path)}>
                        <ExternalLink size={14} className="mr-1" /> View Document
                      </Button>
                    ) : <Badge variant="outline">Missing</Badge>}
                  </div>
                  {app.olevel_path && (
                    <div className="pl-2 space-y-2 border-l-2 border-primary/20">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant={docReview.olevel_status === 'approved' ? 'default' : 'outline'}
                          className={docReview.olevel_status === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
                          onClick={() => setDocReview(p => ({ ...p, olevel_status: 'approved' }))}
                        >
                          <CheckCircle size={14} className="mr-1" /> Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant={docReview.olevel_status === 'rejected' ? 'destructive' : 'outline'}
                          onClick={() => setDocReview(p => ({ ...p, olevel_status: 'rejected' }))}
                        >
                          <XCircle size={14} className="mr-1" /> Reject
                        </Button>
                      </div>
                      {docReview.olevel_status === 'rejected' && (
                        <Textarea 
                          placeholder="Reason for rejection (sent to student)..."
                          value={docReview.olevel_msg}
                          onChange={(e) => setDocReview(p => ({ ...p, olevel_msg: e.target.value }))}
                          className="text-sm mt-2"
                        />
                      )}
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t mt-4">
                  <Label className="mb-2 block">Admission Letter</Label>
                  <div className="flex flex-col gap-2">
                    {app.admission_letter_path && (
                      <Button size="sm" variant="outline" onClick={() => openDoc(app.admission_letter_path)} className="w-full justify-start">
                        <ExternalLink size={14} className="mr-2" /> View Current Letter
                      </Button>
                    )}
                    <Button size="sm" onClick={uploadAdmissionLetter} disabled={uploading} className="w-full">
                      {uploading ? <Loader2 className="animate-spin" size={16} /> : <><Upload size={14} className="mr-2" /> Upload Letter</>}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminApplicationDetail;
