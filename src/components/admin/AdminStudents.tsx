'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Search, ArrowUpRight, Users, GraduationCap, Clock, CheckCircle, XCircle, UserCheck } from 'lucide-react';
import Link from 'next/link';

const STATUS_BADGE: Record<string, string> = {
  draft:           'bg-gray-100 text-gray-600',
  payment_pending: 'bg-amber-100 text-amber-700',
  submitted:       'bg-blue-100 text-blue-700',
  review:          'bg-indigo-100 text-indigo-700',
  admitted:        'bg-green-100 text-green-700',
  fees_pending:    'bg-amber-100 text-amber-700',
  active:          'bg-emerald-100 text-emerald-700',
  rejected:        'bg-red-100 text-red-700',
};

const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft', payment_pending: 'Payment Pending',
  submitted: 'Under Review', review: 'Under Review',
  admitted: 'Admitted', fees_pending: 'Fees Pending',
  active: 'Active', rejected: 'Rejected',
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
}

type Student = {
  id: string;
  full_name: string;
  phone: string;
  role: string;
  created_at: string;
  application: {
    id: string;
    status: string;
    intended_course: string;
    form_fee_paid: boolean;
    application_number: string;
  } | null;
};

const FILTER_TABS = [
  { key: 'all',      label: 'All',          icon: <Users size={14} /> },
  { key: 'active',   label: 'Active',        icon: <GraduationCap size={14} /> },
  { key: 'admitted', label: 'Admitted',      icon: <CheckCircle size={14} /> },
  { key: 'review',   label: 'Under Review',  icon: <Clock size={14} /> },
  { key: 'rejected', label: 'Rejected',      icon: <XCircle size={14} /> },
];

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, phone, role, created_at')
        .eq('role', 'student')
        .order('created_at', { ascending: false });

      if (!profiles) { setLoading(false); return; }

      // Fetch applications for all student IDs
      const ids = profiles.map(p => p.id);
      const { data: applications } = await supabase
        .from('applications')
        .select('id, user_id, status, intended_course, form_fee_paid, application_number')
        .in('user_id', ids);

      const appMap: Record<string, any> = {};
      (applications || []).forEach(a => { appMap[a.user_id] = a; });

      setStudents(profiles.map(p => ({
        ...p,
        application: appMap[p.id] || null,
      })));
      setLoading(false);
    };
    fetchStudents();
  }, []);

  const filtered = students.filter(s => {
    const matchSearch =
      !search ||
      s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.phone?.includes(search) ||
      s.application?.intended_course?.toLowerCase().includes(search.toLowerCase()) ||
      s.application?.application_number?.toLowerCase().includes(search.toLowerCase());

    const appStatus = s.application?.status || 'draft';
    const matchFilter =
      filter === 'all' ||
      (filter === 'review' && ['submitted', 'review'].includes(appStatus)) ||
      appStatus === filter;

    return matchSearch && matchFilter;
  });

  // Summary counts
  const counts = {
    all: students.length,
    active: students.filter(s => s.application?.status === 'active').length,
    admitted: students.filter(s => ['admitted', 'fees_pending'].includes(s.application?.status || '')).length,
    review: students.filter(s => ['submitted', 'review'].includes(s.application?.status || '')).length,
    rejected: students.filter(s => s.application?.status === 'rejected').length,
  };

  return (
    <div className="p-5 sm:p-6 space-y-5">

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-lg flex items-center gap-2">
            <UserCheck size={18} className="text-primary" /> Registered Students
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">{students.length} total registered accounts</p>
        </div>
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search name, course, app ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              filter === tab.key
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
            }`}
          >
            {tab.icon}
            {tab.label}
            <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              filter === tab.key ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
            }`}>
              {counts[tab.key as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Loading students…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Users size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No students found</p>
          <p className="text-sm mt-1">Try a different search or filter</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden">
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-12 gap-3 px-5 py-3 bg-muted/40 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <div className="col-span-4">Student</div>
            <div className="col-span-3">Course</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-2">Registered</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {/* Rows */}
          <div className="divide-y">
            {filtered.map(student => {
              const appStatus = student.application?.status || 'draft';
              const badge = STATUS_BADGE[appStatus] || 'bg-gray-100 text-gray-600';
              const statusLabel = STATUS_LABEL[appStatus] || appStatus;

              return (
                <div key={student.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 px-5 py-4 hover:bg-muted/20 transition-colors group">

                  {/* Name + phone */}
                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                      {student.full_name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{student.full_name || '—'}</p>
                      <p className="text-xs text-muted-foreground truncate">{student.phone || 'No phone'}</p>
                    </div>
                  </div>

                  {/* Course */}
                  <div className="col-span-3 flex items-center min-w-0">
                    <p className="text-sm text-muted-foreground truncate">
                      {student.application?.intended_course || <span className="italic opacity-50">No application</span>}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex items-center sm:justify-center">
                    <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${badge}`}>
                      {statusLabel}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="col-span-2 flex items-center">
                    <p className="text-xs text-muted-foreground">{timeAgo(student.created_at)}</p>
                  </div>

                  {/* Action */}
                  <div className="col-span-1 flex items-center justify-end">
                    {student.application ? (
                      <Link href={`/portal-admin/applications/${student.application.id}`}>
                        <div className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                          View <ArrowUpRight size={13} />
                        </div>
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100">No app</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer count */}
          <div className="px-5 py-3 border-t bg-muted/20 text-xs text-muted-foreground">
            Showing {filtered.length} of {students.length} students
          </div>
        </div>
      )}
    </div>
  );
}
