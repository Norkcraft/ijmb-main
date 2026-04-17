'use client';

import {
  Loader2, Download, Printer, FileText, CheckCircle, Clock, Star,
  User, CreditCard, GraduationCap, AlertCircle, ArrowRight, LogOut,
  KeyRound, Mail, Pencil, Home, FolderOpen, Menu, X, BookOpen,
  ChevronRight, MessageCircle, Wallet, BadgeCheck, TrendingUp
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { useStudentDashboard } from '@/hooks/useStudentDashboard';
import { DashboardPrintView } from '@/components/dashboard/DashboardPrintView';
import { DashboardPayments } from '@/components/dashboard/DashboardPayments';
import { ApplicationForm } from '@/components/application/ApplicationForm';
import { DownloadApplicationPDF } from '@/components/dashboard/DownloadApplicationPDF';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_MAP: Record<string, { label: string; color: string; bg: string; dot: string; icon: React.ReactNode }> = {
  draft:           { label: 'Draft',           color: 'text-slate-600',  bg: 'bg-slate-100',   dot: 'bg-slate-400',   icon: <FileText size={14} /> },
  payment_pending: { label: 'Awaiting Payment',color: 'text-amber-700',  bg: 'bg-amber-100',   dot: 'bg-amber-500',   icon: <CreditCard size={14} /> },
  submitted:       { label: 'Under Review',    color: 'text-blue-700',   bg: 'bg-blue-100',    dot: 'bg-blue-500',    icon: <Clock size={14} /> },
  review:          { label: 'Under Review',    color: 'text-blue-700',   bg: 'bg-blue-100',    dot: 'bg-blue-500',    icon: <Clock size={14} /> },
  admitted:        { label: 'Admitted!',        color: 'text-green-700',  bg: 'bg-green-100',   dot: 'bg-green-500',   icon: <Star size={14} /> },
  fees_pending:    { label: 'Fees Pending',    color: 'text-amber-700',  bg: 'bg-amber-100',   dot: 'bg-amber-500',   icon: <CreditCard size={14} /> },
  active:          { label: 'Active Student',  color: 'text-emerald-700',bg: 'bg-emerald-100', dot: 'bg-emerald-500', icon: <GraduationCap size={14} /> },
  rejected:        { label: 'Not Admitted',    color: 'text-red-700',    bg: 'bg-red-100',     dot: 'bg-red-500',     icon: <AlertCircle size={14} /> },
};

const STEPS = [
  { key: 'apply',   label: 'Apply',    icon: <FileText size={13} /> },
  { key: 'pay',     label: 'Pay Fee',  icon: <CreditCard size={13} /> },
  { key: 'review',  label: 'Review',   icon: <Clock size={13} /> },
  { key: 'admitted',label: 'Admitted', icon: <Star size={13} /> },
  { key: 'accept',  label: 'Accept',   icon: <CheckCircle size={13} /> },
  { key: 'active',  label: 'Active',   icon: <GraduationCap size={13} /> },
];

function getStepIndex(status?: string) {
  switch (status) {
    case 'draft':            return 0;
    case 'payment_pending':  return 1;
    case 'submitted':
    case 'review':           return 2;
    case 'admitted':         return 3;
    case 'fees_pending':     return 4;
    case 'active':           return 5;
    default:                 return 0;
  }
}

// ── Progress tracker ──────────────────────────────────────────────────────────
function ProgressTracker({ status }: { status?: string }) {
  const current = getStepIndex(status);
  return (
    <div className="flex items-start justify-between gap-1 sm:gap-2">
      {STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={step.key} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
            <div className="w-full flex items-center">
              {i > 0 && <div className={`flex-1 h-0.5 transition-colors ${i <= current ? 'bg-primary' : 'bg-border'}`} />}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs transition-all
                ${done ? 'bg-primary text-white shadow-sm' : active ? 'bg-primary text-white ring-4 ring-primary/20 shadow-md' : 'bg-muted text-muted-foreground border border-border'}`}>
                {done ? <CheckCircle size={14} /> : step.icon}
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 transition-colors ${i < current ? 'bg-primary' : 'bg-border'}`} />}
            </div>
            <span className={`text-[9px] sm:text-[11px] font-semibold text-center leading-tight truncate w-full text-center
              ${active ? 'text-primary' : done ? 'text-foreground' : 'text-muted-foreground'}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ currentTab, onNavigate, profile, user, onSignOut, formFeePaid, status }: {
  currentTab: string;
  onNavigate: (tab: string) => void;
  profile: any; user: any;
  onSignOut: () => void;
  formFeePaid: boolean;
  status?: string;
}) {
  const statusInfo = STATUS_MAP[status || 'draft'] || STATUS_MAP.draft;
  const [signingOut, setSigningOut] = useState(false);
  const handleSignOutClick = async () => { setSigningOut(true); await onSignOut(); };
  const firstName = profile?.full_name?.split(' ')[0] || 'Student';
  const initials = (profile?.full_name || 'S').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  const navItems = [
    { key: 'dashboard', icon: <Home size={18} />, label: 'Overview' },
    { key: 'application', icon: <BookOpen size={18} />, label: 'Application' },
    { key: 'payments', icon: <Wallet size={18} />, label: 'Payments' },
    { key: 'documents', icon: <FolderOpen size={18} />, label: 'Documents' },
    { key: 'profile', icon: <User size={18} />, label: 'My Account' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-[hsl(145,63%,18%)] text-white fixed left-0 top-0 bottom-0 z-30">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-black text-lg">S</div>
          <div>
            <p className="font-black text-base leading-tight">Student Portal</p>
            <p className="text-xs text-white/60 leading-tight">IJMB Programme</p>
          </div>
        </div>
      </div>

      {/* User card */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-white/10">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate leading-tight">{firstName}</p>
            <p className="text-xs text-white/60 truncate">{user?.email}</p>
          </div>
        </div>
        <div className={`mt-2 mx-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
          {statusInfo.label}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const active = currentTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${active
                  ? 'bg-white text-[hsl(145,63%,18%)] shadow-sm font-semibold'
                  : 'text-white/75 hover:bg-white/10 hover:text-white'}`}
            >
              <span className={active ? 'text-primary' : ''}>{item.icon}</span>
              {item.label}
              {active && <ChevronRight size={14} className="ml-auto text-primary" />}
            </button>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleSignOutClick}
          disabled={signingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-all disabled:opacity-60"
        >
          {signingOut
            ? <><Loader2 size={18} className="animate-spin" /> Signing Out...</>
            : <><LogOut size={18} /> Sign Out</>}
        </button>
      </div>
    </aside>
  );
}

// ── Mobile top bar ────────────────────────────────────────────────────────────
function MobileHeader({ profile, currentTab, onMenuOpen }: { profile: any; currentTab: string; onMenuOpen: () => void }) {
  const tabLabels: Record<string, string> = {
    dashboard: 'Overview', application: 'Application',
    payments: 'Payments', documents: 'Documents', profile: 'My Account',
  };
  return (
    <header className="lg:hidden sticky top-0 z-30 bg-[hsl(145,63%,18%)] text-white px-4 h-14 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm">S</div>
        <span className="font-bold text-sm">{tabLabels[currentTab] || 'Dashboard'}</span>
      </div>
      <button onClick={onMenuOpen} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
        <Menu size={18} />
      </button>
    </header>
  );
}

// ── Mobile bottom nav ─────────────────────────────────────────────────────────
function MobileBottomNav({ currentTab, onNavigate }: { currentTab: string; onNavigate: (tab: string) => void }) {
  const items = [
    { key: 'dashboard', icon: <Home size={20} />, label: 'Home' },
    { key: 'application', icon: <BookOpen size={20} />, label: 'Apply' },
    { key: 'payments', icon: <Wallet size={20} />, label: 'Payments' },
    { key: 'documents', icon: <FolderOpen size={20} />, label: 'Docs' },
    { key: 'profile', icon: <User size={20} />, label: 'Account' },
  ];
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t shadow-lg safe-area-pb">
      <div className="flex">
        {items.map(item => {
          const active = currentTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors
                ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {item.icon}
              <span className={`text-[10px] font-semibold ${active ? 'text-primary' : ''}`}>{item.label}</span>
              {active && <div className="absolute bottom-0 w-8 h-0.5 bg-primary rounded-t-full" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ── Mobile drawer ─────────────────────────────────────────────────────────────
function MobileDrawer({ open, onClose, profile, user, currentTab, onNavigate, onSignOut, status }: any) {
  const statusInfo = STATUS_MAP[status || 'draft'] || STATUS_MAP.draft;
  const [signingOut, setSigningOut] = useState(false);
  const handleSignOutClick = async () => { setSigningOut(true); await onSignOut(); };
  const firstName = profile?.full_name?.split(' ')[0] || 'Student';
  const initials = (profile?.full_name || 'S').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  const navItems = [
    { key: 'dashboard', icon: <Home size={18} />, label: 'Overview' },
    { key: 'application', icon: <BookOpen size={18} />, label: 'Application' },
    { key: 'payments', icon: <Wallet size={18} />, label: 'Payments' },
    { key: 'documents', icon: <FolderOpen size={18} />, label: 'Documents' },
    { key: 'profile', icon: <User size={18} />, label: 'My Account' },
  ];
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-[hsl(145,63%,18%)] text-white flex flex-col shadow-2xl">
        <div className="px-5 py-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-sm">{initials}</div>
            <div>
              <p className="font-bold text-sm">{firstName}</p>
              <p className="text-xs text-white/60">{user?.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"><X size={16} /></button>
        </div>
        <div className="px-3 py-3">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
            {statusInfo.label}
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map(item => {
            const active = currentTab === item.key;
            return (
              <button key={item.key} onClick={() => { onNavigate(item.key); onClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${active ? 'bg-white text-[hsl(145,63%,18%)] font-semibold' : 'text-white/75 hover:bg-white/10 hover:text-white'}`}>
                {item.icon}{item.label}
              </button>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <button onClick={handleSignOutClick} disabled={signingOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-all disabled:opacity-60">
            {signingOut
              ? <><Loader2 size={18} className="animate-spin" /> Signing Out...</>
              : <><LogOut size={18} /> Sign Out</>}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Overview tab ──────────────────────────────────────────────────────────────
function OverviewTab({ application, profile, user, centres, combos, formFee, sessions, onNavigate }: any) {
  const status = application?.status;
  const statusInfo = STATUS_MAP[status || 'draft'] || STATUS_MAP.draft;
  const firstName = profile?.full_name?.split(' ')[0] || application?.first_name || 'Student';
  const formFeePaid = application?.form_fee_paid || false;
  const isAdmitted = application && ['admitted', 'fees_pending', 'active'].includes(status);
  const hasPaidAcceptanceFee = application && ['fees_pending', 'active'].includes(status);
  // Use session from DB, fall back to current academic year
  const session = sessions?.find((s: any) => s.id === application?.session_id) || sessions?.[0];
  const sessionName = session?.name || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`;
  const centre = centres?.find((c: any) => c.id === application?.preferred_centre_id);
  const assignedCentre = centres?.find((c: any) => c.id === application?.assigned_centre_id);
  const combo = combos?.find((c: any) => c.id === application?.subject_combination_id);

  const downloadLetter = async () => {
    if (!application?.admission_letter_path) return;
    const { data } = await supabase.storage.from('student-documents').createSignedUrl(application.admission_letter_path, 300);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank');
  };

  const stats = [
    {
      label: 'Application ID',
      value: application?.application_number || application?.id?.split('-')[0].toUpperCase() || '—',
      icon: <BadgeCheck size={18} className="text-primary" />,
      bg: 'bg-primary/10',
    },
    {
      label: 'Academic Session',
      value: sessionName,
      icon: <TrendingUp size={18} className="text-blue-600" />,
      bg: 'bg-blue-50',
    },
    {
      label: 'Registration Fee',
      value: formFeePaid ? 'Paid ✓' : `₦${(formFee || 5500).toLocaleString()}`,
      icon: <CreditCard size={18} className={formFeePaid ? 'text-green-600' : 'text-amber-600'} />,
      bg: formFeePaid ? 'bg-green-50' : 'bg-amber-50',
      valueColor: formFeePaid ? 'text-green-700' : 'text-amber-700',
    },
    {
      label: 'Preferred Centre',
      value: centre?.name || '—',
      icon: <GraduationCap size={18} className="text-purple-600" />,
      bg: 'bg-purple-50',
    },
  ];

  // What to do next
  const nextAction = (() => {
    switch (status) {
      case 'submitted':
      case 'review':
        return {
          icon: <Clock size={22} className="text-blue-600" />,
          headline: 'Your application is under review',
          sub: 'Our admissions team is reviewing your details. You will be notified of a decision — this typically takes 1–3 business days. No action needed from you right now.',
          gradient: 'from-blue-50 to-sky-50',
          border: 'border-blue-200',
        };
      case 'admitted':
        return {
          icon: <Star size={22} className="text-amber-500" />,
          headline: 'Congratulations — you have been admitted!',
          sub: 'Pay your acceptance fee to confirm your place and unlock your official admission letter.',
          gradient: 'from-green-50 to-emerald-50',
          border: 'border-green-200',
          cta: { label: 'Pay Acceptance Fee', action: () => onNavigate('payments') },
        };
      case 'fees_pending':
        return {
          icon: <CheckCircle size={22} className="text-emerald-600" />,
          headline: 'Acceptance confirmed — download your letter',
          sub: 'Your acceptance fee has been received. Download your official admission letter and present it at your assigned centre.',
          gradient: 'from-emerald-50 to-teal-50',
          border: 'border-emerald-200',
          cta: { label: 'Download Admission Letter', action: downloadLetter },
        };
      case 'active':
        return {
          icon: <GraduationCap size={22} className="text-emerald-600" />,
          headline: "You're an active IJMB student!",
          sub: 'Your registration is fully complete. Attend your assigned study centre and prepare for your A-Level examinations.',
          gradient: 'from-emerald-50 to-green-50',
          border: 'border-emerald-200',
        };
      case 'rejected':
        return {
          icon: <AlertCircle size={22} className="text-red-500" />,
          headline: 'Application not successful',
          sub: 'Unfortunately your application was not approved. Contact us on WhatsApp and we will help you understand the next steps.',
          gradient: 'from-red-50 to-rose-50',
          border: 'border-red-200',
          cta: { label: 'Chat on WhatsApp', action: () => window.open('https://wa.link/udcjk0', '_blank') },
        };
      default:
        return null;
    }
  })();

  return (
    <div className="space-y-5">
      {/* Hero card */}
      <div className="relative overflow-hidden rounded-2xl bg-[hsl(145,63%,18%)] text-white p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
            <div>
              <p className="text-sm font-medium text-white/70 mb-0.5">Welcome back</p>
              <h1 className="text-2xl sm:text-3xl font-black leading-tight">{firstName}</h1>
              <p className="text-sm text-white/60 mt-1">{application?.intended_course || 'IJMB Applicant'} · {sessionName}</p>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${statusInfo.bg} ${statusInfo.color} shrink-0`}>
              <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
              {statusInfo.label}
            </div>
          </div>
          <ProgressTracker status={status} />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border p-4 hover:shadow-md transition-shadow">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              {s.icon}
            </div>
            <p className={`text-sm font-bold truncate ${(s as any).valueColor || 'text-foreground'}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* What to do next */}
      {nextAction && (
        <div className={`rounded-2xl border bg-gradient-to-br ${nextAction.gradient} ${nextAction.border} p-5 sm:p-6`}>
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-white/80 flex items-center justify-center shrink-0 shadow-sm">
              {nextAction.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground text-base mb-1">{nextAction.headline}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{nextAction.sub}</p>
              {(nextAction as any).cta && (
                <button
                  onClick={(nextAction as any).cta.action}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
                >
                  {(nextAction as any).cta.label} <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Post-registration summary — shown after submission */}
      {['submitted', 'review', 'admitted', 'fees_pending', 'active'].includes(status) && (
        <div className="bg-white rounded-2xl border p-5 space-y-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 border-b pb-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText size={15} className="text-primary" />
            </div>
            <h2 className="font-bold text-sm">Registration Summary</h2>
            <span className={`ml-auto inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${statusInfo.bg} ${statusInfo.color}`}>
              {statusInfo.icon} {statusInfo.label}
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Full Name</p>
              <p className="font-semibold">{[application?.surname, application?.first_name, application?.middle_name].filter(Boolean).join(' ') || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Application Number</p>
              <p className="font-semibold font-mono">{application?.application_number || application?.id?.split('-')[0].toUpperCase() || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Intended Course</p>
              <p className="font-semibold">{application?.intended_course || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Subject Combination</p>
              <p className="font-semibold">{combo?.name || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Preferred Centre</p>
              <p className="font-semibold">{centre?.name || '—'}{centre?.state ? `, ${centre.state}` : ''}</p>
            </div>
            {assignedCentre && (
              <div>
                <p className="text-xs text-muted-foreground">Assigned Centre</p>
                <p className="font-semibold text-green-700">{assignedCentre.name}, {assignedCentre.state}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">Passport Photo</p>
              <p className={`font-semibold flex items-center gap-1 ${application?.passport_path ? 'text-green-700' : 'text-amber-600'}`}>
                {application?.passport_path ? <><CheckCircle size={12} /> Uploaded</> : <><Clock size={12} /> Not uploaded</>}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">O-Level Result</p>
              <p className={`font-semibold flex items-center gap-1 ${application?.olevel_path || application?.olevel_status === 'awaiting' ? 'text-green-700' : 'text-amber-600'}`}>
                {application?.olevel_status === 'awaiting'
                  ? <><Clock size={12} /> Awaiting result</>
                  : application?.olevel_path
                    ? <><CheckCircle size={12} /> Uploaded</>
                    : <><Clock size={12} /> Not uploaded</>}
              </p>
            </div>
          </div>
          <div className="pt-2 border-t flex flex-wrap gap-2">
            <button onClick={() => onNavigate('documents')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-primary border border-primary/30 rounded-xl hover:bg-primary/5 transition-colors">
              <FileText size={12} /> Print Application Form
            </button>
            <button onClick={() => onNavigate('payments')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-muted-foreground border rounded-xl hover:bg-muted/50 transition-colors">
              <CreditCard size={12} /> View Payments
            </button>
          </div>
        </div>
      )}

      {/* Quick actions grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Application details */}
        <div className="bg-white rounded-2xl border p-5 space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText size={15} className="text-primary" />
              </div>
              <h2 className="font-bold text-sm">Application Details</h2>
            </div>
            <button onClick={() => onNavigate('application')} className="text-xs text-primary font-semibold hover:underline">Edit →</button>
          </div>
          <dl className="space-y-2.5">
            {[
              { label: 'Full Name', value: `${application?.surname || ''} ${application?.first_name || ''}`.trim() || '—' },
              { label: 'Combination', value: application?.subject_combination_id ? 'Selected' : '—' },
              { label: 'Intended Course', value: application?.intended_course || '—' },
              { label: 'Date Applied', value: application?.created_at ? new Date(application.created_at).toLocaleDateString() : '—' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-3 text-sm">
                <dt className="text-muted-foreground shrink-0">{label}</dt>
                <dd className="font-medium text-right truncate max-w-[140px]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Payment summary */}
        <div className="bg-white rounded-2xl border p-5 space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
                <Wallet size={15} className="text-green-600" />
              </div>
              <h2 className="font-bold text-sm">Payments</h2>
            </div>
            <button onClick={() => onNavigate('payments')} className="text-xs text-primary font-semibold hover:underline">View all →</button>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Registration Fee', paid: formFeePaid, amount: `₦${formFee?.toLocaleString()}` },
              { label: 'Acceptance Fee', paid: !!hasPaidAcceptanceFee, amount: '₦15,000' },
              { label: 'Tuition Fee', paid: status === 'active', amount: '—' },
            ].map(({ label, paid, amount }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${paid ? 'bg-green-100' : 'bg-muted'}`}>
                    {paid ? <CheckCircle size={11} className="text-green-600" /> : <Clock size={11} className="text-muted-foreground" />}
                  </div>
                  <span className={paid ? 'text-foreground' : 'text-muted-foreground'}>{label}</span>
                </div>
                <span className={`text-xs font-semibold ${paid ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {paid ? 'Paid ✓' : amount}
                </span>
              </div>
            ))}
          </div>
          {!formFeePaid && application && (
            <button
              onClick={() => onNavigate('payments')}
              className="w-full mt-1 py-2.5 text-xs font-bold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors"
            >
              Pay Registration Fee
            </button>
          )}
        </div>
      </div>

      {/* WhatsApp support */}
      <div className="rounded-2xl border bg-gradient-to-r from-[#f0fdf4] to-[#dcfce7] border-[#bbf7d0] p-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#25D366] flex items-center justify-center shrink-0 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-7 h-7 fill-white">
              <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.129 6.744 3.047 9.379L1.054 31.27l6.1-1.957a15.9 15.9 0 008.85 2.691C24.826 32 32 24.826 32 16.004S24.826 0 16.004 0zm9.35 22.617c-.393 1.107-1.943 2.025-3.188 2.293-.852.182-1.963.326-5.705-1.227-4.787-1.986-7.867-6.834-8.107-7.152-.229-.318-1.928-2.568-1.928-4.895s1.221-3.473 1.654-3.947c.434-.475.947-.594 1.262-.594.316 0 .631.002.908.016.291.016.682-.111 1.068.814.393.947 1.34 3.264 1.457 3.502.119.238.197.514.039.83-.158.318-.236.514-.475.791-.236.277-.498.619-.711.83-.238.238-.486.496-.209.971.277.475 1.234 2.035 2.65 3.299 1.82 1.623 3.354 2.127 3.83 2.365.475.238.752.197 1.029-.119.277-.316 1.182-1.379 1.498-1.854.316-.475.633-.395 1.068-.238.434.158 2.752 1.299 3.225 1.535.475.238.791.355.908.553.119.197.119 1.145-.275 2.252z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-green-900 text-sm">Need help? Chat with us on WhatsApp</p>
            <p className="text-xs text-green-800 mt-0.5">Mon–Sat, 8am–6pm · We reply within minutes</p>
          </div>
          <a href="https://wa.link/udcjk0" target="_blank" rel="noopener noreferrer"
            className="shrink-0 px-4 py-2 bg-[#25D366] text-white text-xs font-bold rounded-xl hover:bg-[#1da851] transition-colors shadow-sm">
            Chat Now
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Documents tab ─────────────────────────────────────────────────────────────
function DocumentsTab({ application, sessions, centres, combos }: {
  application: any;
  sessions: any[];
  centres: any[];
  combos: any[];
}) {
  const isAdmitted = application && ['admitted', 'fees_pending', 'active'].includes(application?.status);
  const hasPaidAcceptanceFee = application && ['fees_pending', 'active'].includes(application?.status);
  const formFeePaid = application?.form_fee_paid;

  const downloadLetter = async () => {
    if (!application?.admission_letter_path) return;
    const { data } = await supabase.storage
      .from('student-documents')
      .createSignedUrl(application.admission_letter_path, 300);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank');
  };

  const hasAdmissionLetter = !!application?.admission_letter_path;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold">Documents</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Your official IJMB documents</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">

        {/* Application Form */}
        <div className={`bg-white rounded-2xl border p-5 space-y-4 transition-shadow hover:shadow-md ${!formFeePaid ? 'opacity-80' : ''}`}>
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/8 flex items-center justify-center shrink-0">
              <FileText size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Application Form</h3>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Official registration form with your application details</p>
            </div>
          </div>
          {formFeePaid && application?.id ? (
            <DownloadApplicationPDF applicationId={application.id} />
          ) : (
            <div className="flex items-center gap-2 py-2.5 px-4 bg-muted/50 rounded-xl border border-dashed border-muted-foreground/30">
              <div className="w-4 h-4 rounded-full bg-muted-foreground/20 flex items-center justify-center shrink-0">
                <Clock size={10} className="text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">Pay registration fee to unlock</span>
            </div>
          )}
        </div>

        {/* Admission Letter */}
        <div className={`bg-white rounded-2xl border p-5 space-y-4 transition-shadow hover:shadow-md ${!hasAdmissionLetter ? 'opacity-80' : ''}`}>
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
              <BadgeCheck size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Admission Letter</h3>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Official IJMB admission letter uploaded by the board</p>
            </div>
          </div>
          {hasAdmissionLetter ? (
            <button
              onClick={downloadLetter}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl bg-green-600 hover:bg-green-700 text-white transition-colors"
            >
              <Download size={14} /> Download Letter
            </button>
          ) : (
            <div className="flex items-center gap-2 py-2.5 px-4 bg-muted/50 rounded-xl border border-dashed border-muted-foreground/30">
              <div className="w-4 h-4 rounded-full bg-muted-foreground/20 flex items-center justify-center shrink-0">
                <Clock size={10} className="text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {isAdmitted ? 'Your admission letter will appear here once uploaded by the board' : 'Available after admission is granted'}
              </span>
            </div>
          )}
        </div>

      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">Document availability</p>
        <ul className="space-y-1 text-xs text-blue-700 list-disc list-inside">
          <li>Application form is available after paying the registration fee</li>
          <li>Admission letter is available after paying the acceptance fee</li>
          <li>Tuition receipt is generated automatically after payment</li>
        </ul>
      </div>
    </div>
  );
}

// ── Profile tab ───────────────────────────────────────────────────────────────
function ProfileTab({ user, profile, editName, setEditName, editPhone, setEditPhone, updateProfile, handleSignOut }: any) {
  const [savingProfile, setSavingProfile] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const handleSignOutClick = async () => { setSigningOut(true); await handleSignOut(); };
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const { toast } = useToast();

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    await updateProfile();
    setSavingProfile(false);
  };

  const handleChangeEmail = async () => {
    if (!newEmail) return;
    setSavingEmail(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Confirmation sent', description: `A verification link has been sent to ${newEmail}.` });
      setNewEmail('');
    }
    setSavingEmail(false);
  };

  const handleChangePassword = async () => {
    if (!newPassword) return;
    if (newPassword !== confirmPassword) { toast({ title: 'Passwords do not match', variant: 'destructive' }); return; }
    if (newPassword.length < 6) { toast({ title: 'Password too short', description: 'Must be at least 6 characters', variant: 'destructive' }); return; }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Password updated!' });
      setNewPassword(''); setConfirmPassword('');
    }
    setSavingPassword(false);
  };

  const sections = [
    {
      icon: <User size={18} className="text-primary" />,
      title: 'Account Information',
      content: (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Full Name</label>
              <input value={editName || '—'} disabled
                className="w-full h-10 px-3 rounded-xl border text-sm bg-muted text-muted-foreground cursor-not-allowed" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Phone Number</label>
              <input value={editPhone || '—'} disabled
                className="w-full h-10 px-3 rounded-xl border text-sm bg-muted text-muted-foreground cursor-not-allowed" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Current Email</label>
            <input value={user?.email || ''} disabled
              className="w-full h-10 px-3 rounded-xl border text-sm bg-muted text-muted-foreground cursor-not-allowed" />
          </div>
          <p className="text-xs text-muted-foreground">Name and phone are set from your application form and cannot be changed here.</p>
        </div>
      ),
    },
    {
      icon: <Mail size={18} className="text-blue-600" />,
      title: 'Change Email Address',
      desc: "Enter your new email. We'll send a confirmation link — your email won't change until you click it.",
      content: (
        <div className="flex gap-2">
          <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="new@email.com"
            className="flex-1 h-10 px-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background" />
          <button onClick={handleChangeEmail} disabled={savingEmail || !newEmail}
            className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors whitespace-nowrap">
            {savingEmail ? <Loader2 size={14} className="animate-spin" /> : 'Send Link'}
          </button>
        </div>
      ),
    },
    {
      icon: <KeyRound size={18} className="text-amber-600" />,
      title: 'Change Password',
      content: (
        <div className="space-y-3">
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
            placeholder="New password (min. 6 characters)"
            className="w-full h-10 px-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background" />
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full h-10 px-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background" />
          <button onClick={handleChangePassword} disabled={savingPassword || !newPassword}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {savingPassword ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
            Update Password
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold">My Account</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your personal information and security</p>
      </div>

      {sections.map((sec) => (
        <div key={sec.title} className="bg-white rounded-2xl border p-5 space-y-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 pb-3 border-b">
            {sec.icon}
            <h3 className="font-bold text-sm">{sec.title}</h3>
          </div>
          {sec.desc && <p className="text-sm text-muted-foreground">{sec.desc}</p>}
          {sec.content}
        </div>
      ))}

      <div className="bg-white rounded-2xl border border-red-100 p-5 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 pb-3 border-b border-red-100 mb-4">
          <LogOut size={18} className="text-red-500" />
          <h3 className="font-bold text-sm text-red-700">Sign Out</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">You will be signed out of your account on this device.</p>
        <button onClick={handleSignOutClick} disabled={signingOut}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60">
          {signingOut
            ? <><Loader2 size={14} className="animate-spin" /> Signing Out...</>
            : <><LogOut size={14} /> Sign Out</>}
        </button>
      </div>
    </div>
  );
}

// ── Shell wrapper ─────────────────────────────────────────────────────────────
function DashboardShell({ children, currentTab, onNavigate, profile, user, onSignOut, status, formFeePaid }: {
  children: React.ReactNode;
  currentTab: string;
  onNavigate: (tab: string) => void;
  profile: any; user: any;
  onSignOut: () => void;
  status?: string;
  formFeePaid: boolean;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar currentTab={currentTab} onNavigate={onNavigate} profile={profile} user={user} onSignOut={onSignOut} formFeePaid={formFeePaid} status={status} />
      <MobileHeader profile={profile} currentTab={currentTab} onMenuOpen={() => setDrawerOpen(true)} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} profile={profile} user={user} currentTab={currentTab} onNavigate={onNavigate} onSignOut={onSignOut} status={status} />
      <main className="lg:pl-64 xl:pl-72 pb-24 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </div>
      </main>
      <MobileBottomNav currentTab={currentTab} onNavigate={onNavigate} />
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
const Dashboard = () => {
  const {
    user, profile, application, olevelResults, sessions, centres, combos,
    formFee, loading, loadError, saving, uploading,
    editName, setEditName, editPhone, setEditPhone,
    updateProfile, saveApplication, handleFileUpload, handlePaymentSuccess, fetchData
  } = useStudentDashboard();

  const { signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get('tab') || 'dashboard';

  const handleSignOut = async () => { await signOut(); router.push('/'); };
  const navigate = (tab: string) => router.push(tab === 'dashboard' ? '/dashboard' : `/dashboard?tab=${tab}`);

  const formFeePaid = application?.form_fee_paid || false;
  const isAdmitted = application && ['admitted', 'fees_pending', 'active'].includes(application.status);
  const hasPaidAcceptanceFee = application && ['fees_pending', 'active'].includes(application.status);
  const isPaymentPending = application?.status === 'payment_pending';
  const isDraft = !application || application.status === 'draft' || !application.status;

  const handlePrint = () => {
    // Only wait for images that have a real src and haven't loaded yet
    const images = document.querySelectorAll('img');
    const pending = Array.from(images).filter(img => !img.complete && !!img.src && img.src !== window.location.href);
    if (pending.length > 0) {
      // Wait for images but max 2 seconds — then print anyway
      const timeout = new Promise<void>(r => setTimeout(r, 2000));
      const loaded = Promise.all(pending.map(img => new Promise<void>(r => { img.onload = () => r(); img.onerror = () => r(); })));
      Promise.race([loaded, timeout]).then(() => window.print());
    } else {
      window.print();
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Loader2 size={30} className="animate-spin text-primary" />
          </div>
          <div className="text-center">
            <p className="font-bold text-foreground">Loading your dashboard</p>
            <p className="text-sm text-muted-foreground mt-1">Just a moment…</p>
          </div>
        </div>
      </div>
    );
  }

  // Load error
  if (loadError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border p-8 max-w-sm w-full text-center space-y-4 shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto">
            <AlertCircle size={28} className="text-red-500" />
          </div>
          <h2 className="font-bold text-lg">Could not load your dashboard</h2>
          <p className="text-sm text-muted-foreground">There was a problem fetching your data. Please try refreshing.</p>
          <Button onClick={() => window.location.reload()} className="w-full rounded-xl">Refresh Page</Button>
          <button onClick={handleSignOut} className="text-xs text-muted-foreground hover:text-red-600 transition-colors">Sign out and try again</button>
        </div>
      </div>
    );
  }

  // Stage 1: Fill Application
  if (isDraft) {
    return (
      <>
        <SEOHead title="Complete Application – IJMB" description="Complete your IJMB application." />
        <DashboardShell currentTab="application" onNavigate={navigate} profile={profile} user={user} onSignOut={handleSignOut} status={application?.status} formFeePaid={formFeePaid}>
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-[hsl(145,63%,18%)] text-white p-6 sm:p-8">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
              <div className="relative">
                <p className="text-sm text-white/70 mb-1">Welcome, {profile?.full_name?.split(' ')[0] || 'Student'}</p>
                <h1 className="text-2xl sm:text-3xl font-black mb-2">Complete Your Application</h1>
                <p className="text-white/70 text-sm">Fill in all required fields and upload your documents to submit your IJMB application.</p>
              </div>
            </div>
            <ApplicationForm
              application={application}
              initialOlevels={olevelResults}
              user={user}
              sessions={sessions}
              centres={centres}
              combos={combos}
              onSave={saveApplication}
              onFileUpload={handleFileUpload}
              uploading={uploading}
            />
          </div>
        </DashboardShell>
      </>
    );
  }

  // Stage 2: Pay Form Fee
  if (isPaymentPending && !formFeePaid) {
    return (
      <>
        <SEOHead title="Payment – IJMB" description="Pay your IJMB registration fee." />
        <DashboardShell currentTab="payments" onNavigate={navigate} profile={profile} user={user} onSignOut={handleSignOut} status={application?.status} formFeePaid={formFeePaid}>
          <div className="space-y-5">
            <div className="relative overflow-hidden rounded-2xl bg-[hsl(145,63%,18%)] text-white p-6 sm:p-8">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <p className="font-black text-xl mb-1">Application Submitted!</p>
                  <p className="text-white/70 text-sm">One final step — pay the ₦{formFee.toLocaleString()} registration fee to send your application for review.</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border p-5 sm:p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-5">Your Journey</p>
              <ProgressTracker status="payment_pending" />
            </div>
            <DashboardPayments user={user} application={application} onFeePaymentSuccess={async (feeName, amount) => {
              await handlePaymentSuccess(feeName, amount);
            }} />
          </div>
        </DashboardShell>
      </>
    );
  }

  // Full dashboard with shell
  return (
    <>
      <SEOHead title="Student Dashboard – IJMB" description="Manage your IJMB application." canonical="https://www.ijmb.info/dashboard" />

      <DashboardPrintView
        application={application} profile={profile} user={user}
        sessions={sessions} centres={centres} combos={combos}
        olevelResults={olevelResults} formFee={formFee}
      />

      <div className="print:hidden">
        <DashboardShell currentTab={currentTab} onNavigate={navigate} profile={profile} user={user} onSignOut={handleSignOut} status={application?.status} formFeePaid={formFeePaid}>

          {currentTab === 'dashboard' && (
            <OverviewTab
              application={application} profile={profile} user={user}
              centres={centres} formFee={formFee} sessions={sessions}
              onNavigate={navigate} handlePaymentSuccess={handlePaymentSuccess} fetchData={fetchData}
            />
          )}

          {currentTab === 'application' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold">Application</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Your submitted application details</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800 flex items-center gap-3">
                <CheckCircle size={18} className="text-amber-600 shrink-0" />
                <span>Your application has been submitted. Contact support if you need to make changes.</span>
              </div>
              <div className="bg-white rounded-2xl border p-5 space-y-4">
                <h3 className="font-bold text-sm border-b pb-3">Personal Information</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  {[
                    { label: 'Surname', value: application?.surname },
                    { label: 'First Name', value: application?.first_name },
                    { label: 'Middle Name', value: application?.middle_name },
                    { label: 'Gender', value: application?.gender },
                    { label: 'Date of Birth', value: application?.date_of_birth },
                    { label: 'State of Origin', value: application?.state_of_origin },
                    { label: 'LGA', value: application?.lga },
                    { label: 'Phone', value: application?.guardian_phone },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                      <p className="font-semibold">{value || '—'}</p>
                    </div>
                  ))}
                </div>
                <h3 className="font-bold text-sm border-b pb-3 pt-2">Programme Selection</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  {[
                    { label: 'Intended Course', value: application?.intended_course },
                    { label: 'Preferred Centre', value: centres.find((c: any) => c.id === application?.preferred_centre_id)?.name },
                    { label: 'Subject Combination', value: combos.find((c: any) => c.id === application?.subject_combination_id)?.name },
                    { label: 'Application Number', value: application?.application_number },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                      <p className="font-semibold">{value || '—'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentTab === 'payments' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold">Payments</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Manage your fees and view transaction history</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-800">
                Acceptance, Tuition, and Hostel fees become available after your admission is approved.
              </div>
              <DashboardPayments user={user} application={application} onFeePaymentSuccess={async (feeName, amount) => {
                await handlePaymentSuccess(feeName, amount);
              }} />
            </div>
          )}

          {currentTab === 'documents' && (
            <DocumentsTab application={application} sessions={sessions} centres={centres} combos={combos} />
          )}

          {currentTab === 'profile' && (
            <ProfileTab
              user={user} profile={profile}
              editName={editName} setEditName={setEditName}
              editPhone={editPhone} setEditPhone={setEditPhone}
              updateProfile={updateProfile} handleSignOut={handleSignOut}
            />
          )}

        </DashboardShell>
      </div>
    </>
  );
};

export default Dashboard;
