
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FileText, CheckCircle, CreditCard, Clock, ArrowUpRight, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const STATUS_BADGE: Record<string, string> = {
  draft:           'bg-gray-100 text-gray-600',
  payment_pending: 'bg-amber-100 text-amber-700',
  submitted:       'bg-blue-100 text-blue-700',
  review:          'bg-blue-100 text-blue-700',
  admitted:        'bg-green-100 text-green-700',
  fees_pending:    'bg-amber-100 text-amber-700',
  active:          'bg-emerald-100 text-emerald-700',
  rejected:        'bg-red-100 text-red-700',
};

const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft', payment_pending: 'Payment Pending', submitted: 'Under Review',
  review: 'Under Review', admitted: 'Admitted', fees_pending: 'Fees Pending',
  active: 'Active', rejected: 'Rejected',
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState({
    total: 0, pending: 0, admitted: 0, revenue: 0,
    activeStudents: 0,
    recentApplications: [] as any[],
    pipeline: {} as Record<string, number>,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const [appRes, payRes] = await Promise.all([
        supabase
          .from('applications')
          .select('id, status, created_at, first_name, surname, intended_course, profiles(full_name)')
          .order('created_at', { ascending: false }),
        supabase.from('payments').select('amount, created_at').eq('status', 'success'),
      ]);

      const apps = appRes.data || [];
      const payments = payRes.data || [];

      const pipeline: Record<string, number> = {};
      apps.forEach(a => { pipeline[a.status] = (pipeline[a.status] || 0) + 1; });

      setStats({
        total: apps.length,
        pending: apps.filter(a => ['submitted', 'review'].includes(a.status)).length,
        admitted: apps.filter(a => ['admitted', 'fees_pending', 'active'].includes(a.status)).length,
        activeStudents: apps.filter(a => a.status === 'active').length,
        revenue: payments.reduce((s, p) => s + (Number(p.amount) || 0), 0),
        recentApplications: apps.slice(0, 8),
        pipeline,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center gap-3 text-muted-foreground">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        Loading dashboard…
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Applications',
      value: stats.total,
      icon: <FileText size={18} />,
      iconBg: 'bg-blue-100 text-blue-600',
      sub: 'All time',
      href: '/portal-admin?tab=applications',
    },
    {
      label: 'Pending Review',
      value: stats.pending,
      icon: <Clock size={18} />,
      iconBg: stats.pending > 0 ? 'bg-amber-100 text-amber-600' : 'bg-muted text-muted-foreground',
      sub: stats.pending > 0 ? 'Needs attention' : 'All caught up',
      href: '/portal-admin?tab=applications',
      urgent: stats.pending > 0,
    },
    {
      label: 'Admitted Students',
      value: stats.admitted,
      icon: <CheckCircle size={18} />,
      iconBg: 'bg-green-100 text-green-600',
      sub: `${stats.activeStudents} fully active`,
      href: '/portal-admin?tab=applications',
    },
    {
      label: 'Total Revenue',
      value: `₦${stats.revenue.toLocaleString()}`,
      icon: <CreditCard size={18} />,
      iconBg: 'bg-emerald-100 text-emerald-600',
      sub: 'Confirmed payments',
      href: '/portal-admin?tab=payments',
    },
  ];

  // Pipeline stages to display
  const pipelineStages = [
    { key: 'submitted', label: 'Under Review', color: 'bg-blue-500' },
    { key: 'review',    label: 'In Review',    color: 'bg-indigo-500' },
    { key: 'admitted',  label: 'Admitted',     color: 'bg-green-500' },
    { key: 'fees_pending', label: 'Fees Due',  color: 'bg-amber-500' },
    { key: 'active',    label: 'Active',       color: 'bg-emerald-500' },
  ];
  const pipelineTotal = pipelineStages.reduce((s, st) => s + (stats.pipeline[st.key] || 0), 0) || 1;

  return (
    <div className="p-5 sm:p-6 space-y-6">

      {/* Attention alert */}
      {stats.pending > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle size={18} className="text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800 flex-1">
            <span className="font-semibold">{stats.pending} application{stats.pending > 1 ? 's' : ''}</span> waiting for review.
          </p>
          <Link href="/portal-admin?tab=applications">
            <span className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 whitespace-nowrap">
              Review now <ArrowUpRight size={13} />
            </span>
          </Link>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link href={card.href} key={card.label}>
            <div className={`bg-white rounded-2xl border p-4 sm:p-5 hover:shadow-md transition-shadow cursor-pointer group ${card.urgent ? 'border-amber-300' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                  {card.icon}
                </div>
                <ArrowUpRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
              <p className={`text-xs mt-1 font-medium ${card.urgent ? 'text-amber-600' : 'text-muted-foreground'}`}>{card.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Pipeline + Recent Applications */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Recent Applications — takes 2/3 */}
        <div className="lg:col-span-2 bg-white rounded-2xl border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-primary" />
              <h2 className="font-bold text-sm">Recent Applications</h2>
            </div>
            <Link href="/portal-admin?tab=applications">
              <span className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                View all <ArrowUpRight size={12} />
              </span>
            </Link>
          </div>

          <div className="divide-y">
            {stats.recentApplications.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No applications yet.</p>
            )}
            {stats.recentApplications.map((app) => {
              const name = app.profiles?.full_name || `${app.surname || ''} ${app.first_name || ''}`.trim() || 'Unknown';
              const badge = STATUS_BADGE[app.status] || 'bg-gray-100 text-gray-600';
              const label = STATUS_LABEL[app.status] || app.status;
              return (
                <Link href={`/portal-admin/applications/${app.id}`} key={app.id}>
                  <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer group">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                      {name[0]?.toUpperCase()}
                    </div>
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{name}</p>
                      <p className="text-xs text-muted-foreground truncate">{app.intended_course || 'No course specified'}</p>
                    </div>
                    {/* Status + time */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badge}`}>{label}</span>
                      <span className="text-[11px] text-muted-foreground hidden sm:block">{timeAgo(app.created_at)}</span>
                      <ArrowUpRight size={13} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right column — Pipeline + Quick Actions */}
        <div className="space-y-5">

          {/* Pipeline */}
          <div className="bg-white rounded-2xl border p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-primary" />
              <h2 className="font-bold text-sm">Application Pipeline</h2>
            </div>
            <div className="space-y-3">
              {pipelineStages.map((stage) => {
                const count = stats.pipeline[stage.key] || 0;
                const pct = Math.round((count / pipelineTotal) * 100);
                return (
                  <div key={stage.key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{stage.label}</span>
                      <span className="font-semibold text-foreground">{count}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${stage.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-primary" />
              <h2 className="font-bold text-sm">Quick Actions</h2>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Review Pending Applications', href: '/portal-admin?tab=applications', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
                { label: 'Verify Recent Payments',      href: '/portal-admin?tab=payments',     color: 'bg-green-50 text-green-700 hover:bg-green-100' },
                { label: 'Manage Study Centres',        href: '/portal-admin?tab=centres',      color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
                { label: 'Update Session & Fees',       href: '/portal-admin?tab=sessions',     color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
              ].map((action) => (
                <Link href={action.href} key={action.label}>
                  <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${action.color}`}>
                    {action.label}
                    <ArrowUpRight size={13} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
