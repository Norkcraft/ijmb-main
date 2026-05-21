'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Search, ArrowUpRight, Users, GraduationCap, Clock, CheckCircle, XCircle, UserCheck, AlertTriangle, Mail, RefreshCw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import SendEmailModal from './SendEmailModal';

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
  email: string;
  phone: string;
  role: string;
  email_verified: boolean;
  created_at: string;
  application: {
    id: string;
    status: string;
    intended_course: string;
    form_fee_paid: boolean;
    application_number: string;
    created_at: string;
  } | null;
};

type AttentionReason = 'unverified' | 'no_application' | 'abandoned_draft';

const ATTENTION_TAG: Record<AttentionReason, { label: string; className: string }> = {
  unverified:        { label: 'Email Unverified',  className: 'bg-red-100 text-red-700' },
  no_application:    { label: 'No Application',    className: 'bg-amber-100 text-amber-700' },
  abandoned_draft:   { label: 'Abandoned Draft',   className: 'bg-orange-100 text-orange-700' },
};

function getAttentionReason(student: Student): AttentionReason | null {
  if (!student.email_verified) return 'unverified';
  if (!student.application) return 'no_application';
  if (
    student.application.status === 'draft' &&
    Date.now() - new Date(student.application.created_at).getTime() > 7 * 24 * 60 * 60 * 1000
  ) return 'abandoned_draft';
  return null;
}

const FILTER_TABS = [
  { key: 'all',      label: 'All',          icon: <Users size={14} /> },
  { key: 'active',   label: 'Active',        icon: <GraduationCap size={14} /> },
  { key: 'admitted', label: 'Admitted',      icon: <CheckCircle size={14} /> },
  { key: 'review',   label: 'Under Review',  icon: <Clock size={14} /> },
  { key: 'rejected', label: 'Rejected',      icon: <XCircle size={14} /> },
];

interface AdminStudentsProps {
  onMount?: () => void;
}

export default function AdminStudents({ onMount }: AdminStudentsProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'all' | 'needs_attention'>('all');
  const [emailTarget, setEmailTarget] = useState<{ id: string; full_name: string; email: string } | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => { onMount?.(); }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, role, email_verified, created_at')
        .eq('role', 'student')
        .order('created_at', { ascending: false });

      if (!profiles) { setLoading(false); return; }

      const ids = profiles.map(p => p.id);
      const { data: applications } = await supabase
        .from('applications')
        .select('id, user_id, status, intended_course, form_fee_paid, application_number, created_at')
        .in('user_id', ids);

      const appMap: Record<string, any> = {};
      (applications || []).forEach(a => { appMap[a.user_id] = a; });

      setStudents(profiles.map(p => ({
        ...p,
        email_verified: p.email_verified ?? false,
        application: appMap[p.id] || null,
      })));
      setLoading(false);
    };
    fetchStudents();
  }, []);

  const handleResendVerification = async (student: Student) => {
    setResendingId(student.id);
    try {
      const res = await fetch('/api/admin/resend-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_INTERNAL_API_SECRET}`,
        },
        body: JSON.stringify({ email: student.email, fullName: student.full_name }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      toast({ title: 'Confirmation Email Sent', description: `Fresh link sent to ${student.email}` });
    } catch (err: any) {
      toast({ title: 'Failed', description: err?.message || 'Could not resend the confirmation email.', variant: 'destructive' });
    } finally {
      setResendingId(null);
    }
  };

  const needsAttentionStudents = students.filter(s => getAttentionReason(s) !== null);

  const filtered = students.filter(s => {
    const matchSearch =
      !search ||
      s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.phone?.includes(search) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.application?.intended_course?.toLowerCase().includes(search.toLowerCase()) ||
      s.application?.application_number?.toLowerCase().includes(search.toLowerCase());

    const appStatus = s.application?.status || 'draft';
    const matchFilter =
      filter === 'all' ||
      (filter === 'review' && ['submitted', 'review'].includes(appStatus)) ||
      appStatus === filter;

    return matchSearch && matchFilter;
  });

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
            placeholder="Search name, email, course…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* View mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('all')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
            viewMode === 'all'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
          }`}
        >
          <Users size={14} /> All Students
          <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${viewMode === 'all' ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'}`}>
            {students.length}
          </span>
        </button>
        <button
          onClick={() => setViewMode('needs_attention')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
            viewMode === 'needs_attention'
              ? 'bg-red-600 text-white border-red-600'
              : needsAttentionStudents.length > 0
                ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                : 'bg-background text-muted-foreground border-border'
          }`}
        >
          <AlertTriangle size={14} /> Needs Attention
          {needsAttentionStudents.length > 0 && (
            <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${viewMode === 'needs_attention' ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'}`}>
              {needsAttentionStudents.length}
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Loading students…
        </div>
      ) : viewMode === 'needs_attention' ? (
        /* ── NEEDS ATTENTION VIEW ── */
        needsAttentionStudents.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <CheckCircle size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">All students are on track</p>
            <p className="text-sm mt-1">No students need attention right now</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Legend */}
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Email Unverified</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> No Application Started</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" /> Abandoned Draft (7+ days)</span>
            </div>

            <div className="bg-white rounded-2xl border overflow-hidden">
              <div className="divide-y">
                {needsAttentionStudents.map(student => {
                  const reason = getAttentionReason(student)!;
                  const tag = ATTENTION_TAG[reason];
                  return (
                    <div key={student.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 px-5 py-4 hover:bg-muted/20 transition-colors">

                      {/* Name + email */}
                      <div className="col-span-4 flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                          {student.full_name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{student.full_name || '—'}</p>
                          <p className="text-xs text-muted-foreground truncate">{student.email || student.phone || 'No contact'}</p>
                        </div>
                      </div>

                      {/* Reason tag */}
                      <div className="col-span-3 flex items-center">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${tag.className}`}>
                          {tag.label}
                        </span>
                      </div>

                      {/* Registered */}
                      <div className="col-span-2 flex items-center">
                        <p className="text-xs text-muted-foreground">{timeAgo(student.created_at)}</p>
                      </div>

                      {/* Actions */}
                      <div className="col-span-3 flex items-center justify-end gap-2">
                        {reason === 'unverified' && (
                          <button
                            onClick={() => handleResendVerification(student)}
                            disabled={resendingId === student.id}
                            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                          >
                            {resendingId === student.id
                              ? <Loader2 size={12} className="animate-spin" />
                              : <RefreshCw size={12} />}
                            Resend Link
                          </button>
                        )}
                        <button
                          onClick={() => setEmailTarget({ id: student.id, full_name: student.full_name, email: student.email })}
                          className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          <Mail size={12} /> Email
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="px-5 py-3 border-t bg-muted/20 text-xs text-muted-foreground">
                {needsAttentionStudents.length} student{needsAttentionStudents.length !== 1 ? 's' : ''} need attention
              </div>
            </div>
          </div>
        )
      ) : (
        /* ── ALL STUDENTS VIEW ── */
        <>
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

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Users size={36} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No students found</p>
              <p className="text-sm mt-1">Try a different search or filter</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border overflow-hidden">
              <div className="hidden sm:grid grid-cols-12 gap-3 px-5 py-3 bg-muted/40 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <div className="col-span-4">Student</div>
                <div className="col-span-3">Course</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-2">Registered</div>
                <div className="col-span-1 text-right">Action</div>
              </div>

              <div className="divide-y">
                {filtered.map(student => {
                  const appStatus = student.application?.status || 'draft';
                  const badge = STATUS_BADGE[appStatus] || 'bg-gray-100 text-gray-600';
                  const statusLabel = STATUS_LABEL[appStatus] || appStatus;

                  return (
                    <div key={student.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 px-5 py-4 hover:bg-muted/20 transition-colors group">
                      <div className="col-span-4 flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                          {student.full_name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{student.full_name || '—'}</p>
                          <p className="text-xs text-muted-foreground truncate">{student.phone || 'No phone'}</p>
                        </div>
                      </div>
                      <div className="col-span-3 flex items-center min-w-0">
                        <p className="text-sm text-muted-foreground truncate">
                          {student.application?.intended_course || <span className="italic opacity-50">No application</span>}
                        </p>
                      </div>
                      <div className="col-span-2 flex items-center sm:justify-center">
                        <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${badge}`}>
                          {statusLabel}
                        </span>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <p className="text-xs text-muted-foreground">{timeAgo(student.created_at)}</p>
                      </div>
                      <div className="col-span-1 flex items-center justify-end">
                        {student.application ? (
                          <Link href={`/portal-admin/applications/${student.application.id}`}>
                            <div className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                              View <ArrowUpRight size={13} />
                            </div>
                          </Link>
                        ) : (
                          <button
                            onClick={() => setEmailTarget({ id: student.id, full_name: student.full_name, email: student.email })}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Send Email"
                          >
                            <Mail size={14} className="text-muted-foreground hover:text-primary transition-colors" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="px-5 py-3 border-t bg-muted/20 text-xs text-muted-foreground">
                Showing {filtered.length} of {students.length} students
              </div>
            </div>
          )}
        </>
      )}

      <SendEmailModal student={emailTarget} onClose={() => setEmailTarget(null)} />
    </div>
  );
}
