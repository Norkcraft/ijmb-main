import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { LogOut, Users, Clock, CheckCircle, XCircle, Search } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  review: 'bg-blue-100 text-blue-800',
  admitted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const AdminDashboard = () => {
  const { signOut } = useAuth();
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
          profiles:user_id(full_name, phone),
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

  // Stats
  const total = applications.length;
  const pending = applications.filter(a => a.status === 'review').length;
  const admitted = applications.filter(a => a.status === 'admitted').length;
  const rejected = applications.filter(a => a.status === 'rejected').length;

  // Filtered
  const filtered = applications.filter(app => {
    if (filterStatus && app.status !== filterStatus) return false;
    if (filterSession && app.session_id !== filterSession) return false;
    if (filterCentre && app.preferred_centre_id !== filterCentre) return false;
    if (search) {
      const q = search.toLowerCase();
      const name = app.profiles?.full_name?.toLowerCase() || '';
      const phone = app.profiles?.phone?.toLowerCase() || '';
      if (!name.includes(q) && !phone.includes(q)) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <SEOHead title="Admin Dashboard – IJMB Portal" description="IJMB admin dashboard for managing applications." canonical="https://www.ijmb.info/portal-admin" />
      <div className="section-padding max-w-7xl mx-auto space-y-6 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={signOut}><LogOut size={16} className="mr-2" /> Logout</Button>
        </div>

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
            <option value="draft">Draft</option>
            <option value="review">Under Review</option>
            <option value="admitted">Admitted</option>
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
                  <TableHead>Student</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Preferred Centre</TableHead>
                  <TableHead>Assigned Centre</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No applications found.</TableCell></TableRow>
                ) : (
                  filtered.map(app => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.profiles?.full_name || '—'}</TableCell>
                      <TableCell>{app.profiles?.phone || '—'}</TableCell>
                      <TableCell>{app.preferred_centre?.name || '—'}</TableCell>
                      <TableCell>{app.assigned_centre?.name || '—'}</TableCell>
                      <TableCell><Badge className={STATUS_COLORS[app.status] || ''}>{app.status}</Badge></TableCell>
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
    </>
  );
};

export default AdminDashboard;
