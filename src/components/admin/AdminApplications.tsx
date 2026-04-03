import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Search, Users, Clock, CheckCircle, XCircle } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  submitted: 'bg-blue-100 text-blue-800',
  payment_pending: 'bg-orange-100 text-orange-800',
  payment_completed: 'bg-green-100 text-green-800',
  review: 'bg-purple-100 text-purple-800',
  admitted: 'bg-green-100 text-green-800',
  fees_pending: 'bg-yellow-100 text-yellow-800',
  active: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function AdminApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [centres, setCentres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSession, setFilterSession] = useState('');
  const [filterCentre, setFilterCentre] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const [appRes, sessRes, centreRes] = await Promise.all([
        supabase.from('applications').select(`
          *,
          profiles:user_id(full_name, phone, email),
          session:session_id(name, code),
          preferred_centre:preferred_centre_id(name, state),
          assigned_centre:assigned_centre_id(name, state)
        `).order('created_at', { ascending: false }),
        supabase.from('sessions').select('*'),
        supabase.from('centres').select('*'),
      ]);
      setApplications(appRes.data || []);
      setSessions(sessRes.data || []);
      setCentres(centreRes.data || []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const filtered = applications.filter(app => {
    if (filterStatus && app.status !== filterStatus) return false;
    if (filterSession && app.session_id !== filterSession) return false;
    if (filterCentre && app.preferred_centre_id !== filterCentre) return false;
    if (search) {
      const q = search.toLowerCase();
      const name = (app.surname ? `${app.surname} ${app.first_name}` : app.profiles?.full_name)?.toLowerCase() || '';
      const phone = (app.guardian_phone || app.profiles?.phone)?.toLowerCase() || '';
      const appId = app.application_number?.toLowerCase() || '';
      if (!name.includes(q) && !phone.includes(q) && !appId.includes(q)) return false;
    }
    return true;
  });

  // Stats
  const total = applications.length;
  const pending = applications.filter(a => ['review', 'submitted', 'payment_completed'].includes(a.status)).length;
  const admitted = applications.filter(a => ['admitted', 'fees_pending', 'active'].includes(a.status)).length;
  const rejected = applications.filter(a => a.status === 'rejected').length;

  if (loading) return <div className="p-4 text-center">Loading applications...</div>;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6 text-center">
          <Users className="mx-auto mb-2 text-primary" size={24} />
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-sm text-muted-foreground">Total</p>
        </CardContent></Card>
        <Card><CardContent className="pt-6 text-center">
          <Clock className="mx-auto mb-2 text-yellow-600" size={24} />
          <p className="text-2xl font-bold">{pending}</p>
          <p className="text-sm text-muted-foreground">Under Review</p>
        </CardContent></Card>
        <Card><CardContent className="pt-6 text-center">
          <CheckCircle className="mx-auto mb-2 text-green-600" size={24} />
          <p className="text-2xl font-bold">{admitted}</p>
          <p className="text-sm text-muted-foreground">Admitted</p>
        </CardContent></Card>
        <Card><CardContent className="pt-6 text-center">
          <XCircle className="mx-auto mb-2 text-red-600" size={24} />
          <p className="text-2xl font-bold">{rejected}</p>
          <p className="text-sm text-muted-foreground">Rejected</p>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
          <Input placeholder="Search name or phone..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
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
        <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={filterSession} onChange={e => setFilterSession(e.target.value)}>
          <option value="">All Sessions</option>
          {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={filterCentre} onChange={e => setFilterCentre(e.target.value)}>
          <option value="">All Centres</option>
          {centres.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>App ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Centre</TableHead>
                <TableHead>Tuition</TableHead>
                <TableHead>Form</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No applications found.</TableCell></TableRow>
              ) : (
                filtered.map(app => (
                  <TableRow key={app.id}>
                    <TableCell className="font-mono text-xs">{app.application_number || app.id.split('-')[0].toUpperCase()}</TableCell>
                    <TableCell className="font-medium">{app.surname ? `${app.surname} ${app.first_name}` : (app.profiles?.full_name || '—')}</TableCell>
                    <TableCell className="text-sm">{app.profiles?.email || '—'}</TableCell>
                    <TableCell>{app.guardian_phone || app.profiles?.phone || '—'}</TableCell>
                    <TableCell>{app.preferred_centre?.name || '—'}</TableCell>
                    <TableCell>
                      {app.tuition_payment_status === 'fully_paid' ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>
                      ) : app.tuition_payment_status === 'part_paid' ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Part</Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">Pending</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {app.application_form_url ? (
                         <Button 
                           variant="link" 
                           size="sm" 
                           className="h-auto p-0 text-blue-600"
                           onClick={(e) => {
                             e.stopPropagation();
                             window.open(app.application_form_url, '_blank');
                           }}
                         >
                           View Form
                         </Button>
                      ) : (
                         <span className="text-xs text-muted-foreground italic">Not Generated</span>
                      )}
                    </TableCell>
                    <TableCell><Badge className={STATUS_COLORS[app.status] || ''}>{app.status.replace('_', ' ')}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(app.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Link to={`/portal-admin/applications/${app.id}`}>
                        <Button size="sm" variant="outline">View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
