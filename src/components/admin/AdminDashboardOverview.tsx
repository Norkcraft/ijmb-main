
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, CheckCircle, CreditCard, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    admittedStudents: 0,
    totalRevenue: 0,
    recentApplications: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      
      const [appRes, paymentRes] = await Promise.all([
        supabase.from('applications').select('id, status, created_at, profiles(full_name)').order('created_at', { ascending: false }),
        supabase.from('payments').select('amount')
      ]);

      const applications = appRes.data || [];
      const payments = paymentRes.data || [];

      const totalApplications = applications.length;
      const pendingApplications = applications.filter(a => ['submitted', 'under_review'].includes(a.status)).length;
      const admittedStudents = applications.filter(a => ['admitted', 'fees_pending', 'active'].includes(a.status)).length;
      const totalRevenue = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      setStats({
        totalApplications,
        pendingApplications,
        admittedStudents,
        totalRevenue,
        recentApplications: applications.slice(0, 5)
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center animate-pulse">Loading dashboard metrics...</div>;

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admitted Students</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admittedStudents}</div>
            <p className="text-xs text-muted-foreground">Active students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {stats.recentApplications.map((app) => (
                <div key={app.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{app.profiles?.full_name || 'Unknown User'}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`ml-auto font-medium ${
                    app.status === 'admitted' ? 'text-green-600' : 
                    app.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {app.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="p-4 bg-muted/20 rounded-lg border flex items-center justify-between cursor-pointer hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-100 text-blue-600 rounded-full"><Users size={18} /></div>
                   <span className="font-medium text-sm">Review Pending Applications</span>
                </div>
                <ArrowUpRight size={16} className="text-muted-foreground" />
             </div>
             <div className="p-4 bg-muted/20 rounded-lg border flex items-center justify-between cursor-pointer hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-green-100 text-green-600 rounded-full"><CreditCard size={18} /></div>
                   <span className="font-medium text-sm">Verify Recent Payments</span>
                </div>
                <ArrowUpRight size={16} className="text-muted-foreground" />
             </div>
             <div className="p-4 bg-muted/20 rounded-lg border flex items-center justify-between cursor-pointer hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-purple-100 text-purple-600 rounded-full"><TrendingUp size={18} /></div>
                   <span className="font-medium text-sm">Generate Reports</span>
                </div>
                <ArrowUpRight size={16} className="text-muted-foreground" />
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
