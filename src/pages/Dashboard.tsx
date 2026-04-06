'use client';

import { Loader2, Download, Eye, Printer, FileText, CheckCircle, Clock, Star, MessageCircle, ChevronRight, User, BookOpen, CreditCard, GraduationCap, AlertCircle, ArrowRight, Bell, LogOut, KeyRound, Mail, Phone, Pencil } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { useStudentDashboard } from '@/hooks/useStudentDashboard';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardPrintView } from '@/components/dashboard/DashboardPrintView';
import { DashboardPayments } from '@/components/dashboard/DashboardPayments';
import { ApplicationForm } from '@/components/application/ApplicationForm';
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

// ── Profile Tab ───────────────────────────────────────────────────────────────
function ProfileTab({ user, profile, editName, setEditName, editPhone, setEditPhone, updateProfile, handleSignOut }: any) {
  const [savingProfile, setSavingProfile] = useState(false);
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
      toast({ title: 'Confirmation sent', description: `A verification link has been sent to ${newEmail}. Click it to confirm the change.` });
      setNewEmail('');
    }
    setSavingEmail(false);
  };

  const handleChangePassword = async () => {
    if (!newPassword) return;
    if (newPassword !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: 'Password too short', description: 'Must be at least 6 characters', variant: 'destructive' });
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Password updated successfully' });
      setNewPassword('');
      setConfirmPassword('');
    }
    setSavingPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background pb-20">
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => window.location.href = '/dashboard'} className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back</button>
            <ChevronRight size={14} className="text-muted-foreground" />
            <span className="text-sm font-semibold">My Profile</span>
          </div>
          <button onClick={handleSignOut} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        {/* Account info */}
        <div className="bg-white rounded-2xl border p-6 space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b">
            <User size={18} className="text-primary" />
            <h2 className="font-bold text-base">Account Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Full Name</label>
              <div className="flex gap-2">
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="flex-1 h-10 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Your full name"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Phone Number</label>
              <input
                value={editPhone}
                onChange={e => setEditPhone(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Phone number"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Current Email</label>
              <input
                value={user?.email || ''}
                disabled
                className="w-full h-10 px-3 rounded-lg border text-sm bg-muted text-muted-foreground cursor-not-allowed"
              />
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={savingProfile}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-60 transition-colors"
            >
              {savingProfile ? <Loader2 size={15} className="animate-spin" /> : <Pencil size={15} />}
              Save Changes
            </button>
          </div>
        </div>

        {/* Change email */}
        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Mail size={18} className="text-primary" />
            <h2 className="font-bold text-base">Change Email Address</h2>
          </div>
          <p className="text-sm text-muted-foreground">Enter your new email. We'll send a confirmation link — your email won't change until you click it.</p>
          <div className="flex gap-2">
            <input
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="new@email.com"
              className="flex-1 h-10 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={handleChangeEmail}
              disabled={savingEmail || !newEmail}
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {savingEmail ? <Loader2 size={15} className="animate-spin" /> : 'Send Link'}
            </button>
          </div>
        </div>

        {/* Change password */}
        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <KeyRound size={18} className="text-primary" />
            <h2 className="font-bold text-base">Change Password</h2>
          </div>
          <div className="space-y-3">
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="New password (min. 6 characters)"
              className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={handleChangePassword}
              disabled={savingPassword || !newPassword}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {savingPassword ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />}
              Update Password
            </button>
          </div>
        </div>

        {/* Sign out */}
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center gap-2 pb-2 border-b mb-4">
            <LogOut size={18} className="text-red-500" />
            <h2 className="font-bold text-base">Sign Out</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">You will be signed out of your account on this device.</p>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>

      </main>
    </div>
  );
}

// ── Status helpers ────────────────────────────────────────────────────────────
const STATUS_MAP: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  draft:           { label: 'Draft',            color: 'text-gray-600',   bg: 'bg-gray-50',   border: 'border-gray-200',  icon: <FileText size={16} /> },
  payment_pending: { label: 'Payment Pending',  color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200', icon: <CreditCard size={16} /> },
  submitted:       { label: 'Under Review',     color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200',  icon: <Clock size={16} /> },
  review:          { label: 'Under Review',     color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200',  icon: <Clock size={16} /> },
  admitted:        { label: 'Admitted!',         color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200', icon: <Star size={16} /> },
  fees_pending:    { label: 'Fees Pending',     color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200', icon: <CreditCard size={16} /> },
  active:          { label: 'Active Student',   color: 'text-emerald-700',bg: 'bg-emerald-50',border: 'border-emerald-200',icon: <GraduationCap size={16} /> },
  rejected:        { label: 'Not Admitted',     color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200',   icon: <AlertCircle size={16} /> },
};

// ── Journey steps ─────────────────────────────────────────────────────────────
const STEPS = [
  { key: 'apply',    label: 'Apply',        icon: <FileText size={14} /> },
  { key: 'pay',      label: 'Pay Fee',      icon: <CreditCard size={14} /> },
  { key: 'review',   label: 'Review',       icon: <Clock size={14} /> },
  { key: 'admitted', label: 'Admitted',     icon: <Star size={14} /> },
  { key: 'accept',   label: 'Accept',       icon: <CheckCircle size={14} /> },
  { key: 'active',   label: 'Active',       icon: <GraduationCap size={14} /> },
];

function getStepIndex(status: string | undefined) {
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

function ProgressTracker({ status }: { status: string | undefined }) {
  const current = getStepIndex(status);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-1">
        {STEPS.map((step, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={step.key} className="flex-1 flex flex-col items-center gap-1.5">
              {/* connector line before */}
              <div className="w-full flex items-center">
                {i > 0 && (
                  <div className={`flex-1 h-0.5 ${i <= current ? 'bg-primary' : 'bg-border'}`} />
                )}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs transition-all
                  ${done ? 'bg-primary text-white' : active ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-muted text-muted-foreground border border-border'}`}>
                  {done ? <CheckCircle size={14} /> : step.icon}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 ${i < current ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
              <span className={`text-[10px] sm:text-xs font-medium text-center leading-tight
                ${active ? 'text-primary' : done ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── What To Do Next card ───────────────────────────────────────────────────────
function WhatNextCard({
  status, isAdmitted, hasPaidAcceptanceFee, formFeePaid,
  onPayAcceptance, onDownloadLetter,
}: {
  status?: string;
  isAdmitted: boolean;
  hasPaidAcceptanceFee: boolean;
  formFeePaid: boolean;
  onPayAcceptance: () => void;
  onDownloadLetter: () => void;
}) {
  const cards: Record<string, { icon: React.ReactNode; headline: string; sub: string; cta?: { label: string; action: () => void }; color: string }> = {
    submitted: {
      icon: <Clock size={24} className="text-blue-600" />,
      headline: 'Your application is under review',
      sub: 'Our admissions team is reviewing your details. You will be notified once a decision is made — this typically takes 1–3 business days.',
      color: 'bg-blue-50 border-blue-200',
    },
    review: {
      icon: <Clock size={24} className="text-blue-600" />,
      headline: 'Your application is under review',
      sub: 'Our admissions team is reviewing your details. You will be notified once a decision is made — this typically takes 1–3 business days.',
      color: 'bg-blue-50 border-blue-200',
    },
    admitted: {
      icon: <Star size={24} className="text-green-600" />,
      headline: 'Congratulations — you have been admitted!',
      sub: 'Pay your acceptance fee to unlock your admission letter and confirm your place.',
      cta: { label: 'Pay Acceptance Fee', action: onPayAcceptance },
      color: 'bg-green-50 border-green-200',
    },
    fees_pending: {
      icon: <CheckCircle size={24} className="text-emerald-600" />,
      headline: 'Admission confirmed — download your letter',
      sub: 'Your acceptance fee has been received. Download your official admission letter below.',
      cta: { label: 'Download Admission Letter', action: onDownloadLetter },
      color: 'bg-emerald-50 border-emerald-200',
    },
    active: {
      icon: <GraduationCap size={24} className="text-emerald-600" />,
      headline: "You're an active IJMB student!",
      sub: 'Your registration is complete. Attend your assigned centre and prepare for your A-Level examinations.',
      color: 'bg-emerald-50 border-emerald-200',
    },
    rejected: {
      icon: <AlertCircle size={24} className="text-red-600" />,
      headline: 'Application not successful',
      sub: 'Unfortunately your application was not approved this time. Contact us on WhatsApp and we will help you understand the next steps.',
      cta: { label: 'Chat on WhatsApp', action: () => window.open('https://wa.link/udcjk0', '_blank') },
      color: 'bg-red-50 border-red-200',
    },
  };

  const card = cards[status || 'submitted'] || cards.submitted;

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 ${card.color}`}>
      <div className="flex items-start gap-4">
        <div className="shrink-0 mt-0.5">{card.icon}</div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-foreground text-base sm:text-lg mb-1">{card.headline}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{card.sub}</p>
          {card.cta && (
            <button
              onClick={card.cta.action}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              {card.cta.label} <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard component ──────────────────────────────────────────────────
const Dashboard = () => {
  const {
    user,
    profile,
    application,
    olevelResults,
    sessions,
    centres,
    combos,
    formFee,
    loading,
    loadError,
    saving,
    uploading,
    editName,
    setEditName,
    editPhone,
    setEditPhone,
    updateProfile,
    saveApplication,
    handleFileUpload,
    handlePaymentSuccess,
    fetchData
  } = useStudentDashboard();

  const { signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get('tab') || 'dashboard';

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const formFeePaid = application?.form_fee_paid || false;
  const isAdmitted = application && ['admitted', 'fees_pending', 'active'].includes(application.status);
  const hasPaidAcceptanceFee = application && ['fees_pending', 'active'].includes(application.status);
  const isPaymentPending = application?.status === 'payment_pending';
  const isDraft = !application || application.status === 'draft' || !application.status;

  const statusInfo = STATUS_MAP[application?.status || 'draft'] || STATUS_MAP.submitted;
  const firstName = (profile?.full_name?.split(' ')[0]) || application?.first_name || user?.email?.split('@')[0] || 'Student';

  const downloadAdmissionLetter = async () => {
    if (!application?.admission_letter_path) return;
    const { data } = await supabase.storage.from('student-documents').createSignedUrl(application.admission_letter_path, 300);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank');
  };

  const handleDownloadApplicationForm = (_action: 'download' | 'preview' | 'print') => {
    // Wait for all images to load before printing so passport shows correctly
    const images = document.querySelectorAll('img');
    const pending = Array.from(images).filter(img => !img.complete);
    if (pending.length > 0) {
      Promise.all(pending.map(img => new Promise(r => { img.onload = r; img.onerror = r; })))
        .then(() => window.print());
    } else {
      window.print();
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 to-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Loader2 size={28} className="animate-spin text-primary" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">Loading your dashboard</p>
            <p className="text-sm text-muted-foreground mt-1">Just a moment…</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Load error — don't fall through to the form ──────────────────────────
  if (loadError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border p-8 max-w-sm w-full text-center space-y-4">
          <AlertCircle size={36} className="text-red-500 mx-auto" />
          <h2 className="font-bold text-lg">Could not load your dashboard</h2>
          <p className="text-sm text-muted-foreground">There was a problem fetching your application data. Please try refreshing the page.</p>
          <Button onClick={() => window.location.reload()} className="w-full">Refresh Page</Button>
          <button onClick={handleSignOut} className="text-xs text-muted-foreground hover:text-red-600 transition-colors">Sign out and try again</button>
        </div>
      </div>
    );
  }

  // ── Stage 1: Fill Application ─────────────────────────────────────────────
  if (isDraft) {
    return (
      <>
        <SEOHead title="Complete Application – IJMB" description="Complete your IJMB application." />
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background pb-20">
          <DashboardHeader profile={profile} user={user} signOut={handleSignOut} />
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Welcome banner */}
            <div className="rounded-2xl bg-primary text-primary-foreground p-6 sm:p-8">
              <p className="text-sm font-medium opacity-80 mb-1">Welcome, {firstName}</p>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Complete Your Application</h1>
              <p className="opacity-80 text-sm">Fill in the form below to submit your IJMB 2026/2027 application.</p>
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
          </main>
        </div>
      </>
    );
  }

  // ── Stage 2: Pay Form Fee ─────────────────────────────────────────────────
  if (isPaymentPending && !formFeePaid) {
    return (
      <>
        <SEOHead title="Payment – IJMB" description="Pay your IJMB registration fee." />
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background pb-20">
          <DashboardHeader profile={profile} user={user} signOut={handleSignOut} />
          <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Success + next step banner */}
            <div className="rounded-2xl bg-primary text-primary-foreground p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle size={24} className="opacity-90" />
                <p className="font-bold text-lg">Application Submitted!</p>
              </div>
              <p className="opacity-80 text-sm">One final step — pay the ₦5,500 registration fee to send your application for review.</p>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-2xl border p-5 sm:p-6">
              <p className="text-sm font-semibold text-muted-foreground mb-5">Your Journey</p>
              <ProgressTracker status="payment_pending" />
            </div>

            <DashboardPayments
              user={user}
              application={application}
              onFeePaymentSuccess={async (feeName) => {
                if (feeName === 'form_fee') await handlePaymentSuccess();
              }}
            />
          </main>
        </div>
      </>
    );
  }

  // ── Profile tab ──────────────────────────────────────────────────────────
  if (currentTab === 'profile') {
    return <ProfileTab
      user={user}
      profile={profile}
      editName={editName}
      setEditName={setEditName}
      editPhone={editPhone}
      setEditPhone={setEditPhone}
      updateProfile={updateProfile}
      handleSignOut={handleSignOut}
    />;
  }

  // ── Stage 3: Payments tab ─────────────────────────────────────────────────
  if (currentTab === 'payments') {
    return (
      <>
        <SEOHead title="Payments – IJMB" description="Pay your IJMB fees." />
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background pb-20">
          <DashboardHeader profile={profile} user={user} signOut={handleSignOut} />
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <button onClick={() => window.location.href = '/dashboard'} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors">
                ← Back
              </button>
              <ChevronRight size={14} className="text-muted-foreground" />
              <span className="text-sm font-medium">Payments</span>
            </div>

            <div className="bg-white rounded-2xl border p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard size={20} className="text-primary" />
                <h1 className="text-xl font-bold">Payments</h1>
              </div>
              <div className="p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-200 text-sm mb-6">
                After your admission is granted, pay the Acceptance Fee to download your admission letter. Tuition and Hostel fees become available after acceptance.
              </div>
              <DashboardPayments
                user={user}
                application={application}
                onFeePaymentSuccess={async (feeName) => {
                  if (feeName === 'form_fee') {
                    await handlePaymentSuccess();
                  } else if (application?.id) {
                    if (feeName === 'acceptance_fee' && application.status === 'admitted') {
                      await supabase.from('applications').update({ status: 'fees_pending', updated_at: new Date().toISOString() }).eq('id', application.id);
                    }
                    if (feeName === 'tuition_fee' && ['admitted', 'fees_pending'].includes(application.status)) {
                      await supabase.from('applications').update({ status: 'active', updated_at: new Date().toISOString() }).eq('id', application.id);
                    }
                  }
                  await fetchData();
                }}
              />
            </div>
          </main>
        </div>
      </>
    );
  }

  // ── Stage 4: Main Dashboard (submitted / reviewed / admitted / active) ─────
  return (
    <>
      <SEOHead title="Student Dashboard – IJMB" description="Manage your IJMB application." canonical="https://www.ijmb.info/dashboard" />

      <DashboardPrintView
        application={application}
        profile={profile}
        user={user}
        sessions={sessions}
        centres={centres}
        combos={combos}
        olevelResults={olevelResults}
        formFee={formFee}
      />

      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background pb-24 print:hidden">
        <DashboardHeader profile={profile} user={user} signOut={handleSignOut} />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">

          {/* ── Hero greeting + status ── */}
          <div className="rounded-2xl bg-primary text-primary-foreground p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm font-medium opacity-75 mb-1">Welcome back</p>
                <h1 className="text-2xl sm:text-3xl font-bold">{firstName}</h1>
                <p className="opacity-75 text-sm mt-1">IJMB 2026/2027 Applicant</p>
              </div>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} border`}>
                {statusInfo.icon}
                {statusInfo.label}
              </div>
            </div>

            {/* Quick info row */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 pt-5 border-t border-white/20 text-sm">
              <span className="opacity-80">
                <span className="opacity-60 mr-1.5">App ID:</span>
                <span className="font-semibold">{application?.application_number || application?.id?.split('-')[0].toUpperCase()}</span>
              </span>
              <span className="opacity-80">
                <span className="opacity-60 mr-1.5">Course:</span>
                <span className="font-semibold">{application?.intended_course || '—'}</span>
              </span>
              <span className="opacity-80">
                <span className="opacity-60 mr-1.5">Session:</span>
                <span className="font-semibold">2026/2027</span>
              </span>
            </div>
          </div>

          {/* ── Progress tracker ── */}
          <div className="bg-white rounded-2xl border p-5 sm:p-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-5">Your Journey</p>
            <ProgressTracker status={application?.status} />
          </div>

          {/* ── What To Do Next ── */}
          <WhatNextCard
            status={application?.status}
            isAdmitted={!!isAdmitted}
            hasPaidAcceptanceFee={!!hasPaidAcceptanceFee}
            formFeePaid={formFeePaid}
            onPayAcceptance={() => window.location.href = '?tab=payments'}
            onDownloadLetter={downloadAdmissionLetter}
          />

          {/* ── Application details + documents grid ── */}
          <div className="grid sm:grid-cols-2 gap-5">

            {/* Application Details */}
            <div className="bg-white rounded-2xl border p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <User size={16} className="text-primary" />
                <h2 className="font-bold text-base">Application Details</h2>
              </div>
              <dl className="space-y-3 text-sm">
                {[
                  { label: 'Full Name', value: `${application?.surname || ''} ${application?.first_name || ''} ${application?.middle_name || ''}`.trim() || '—' },
                  { label: 'Application ID', value: application?.application_number || application?.id?.split('-')[0].toUpperCase() || '—' },
                  { label: 'Preferred Centre', value: centres.find(c => c.id === application?.preferred_centre_id)?.name || '—' },
                  { label: 'Course of Choice', value: application?.intended_course || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-3">
                    <dt className="text-muted-foreground shrink-0">{label}</dt>
                    <dd className="font-medium text-right text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Payments Quick View */}
            <div className="bg-white rounded-2xl border p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard size={16} className="text-primary" />
                <h2 className="font-bold text-base">Payments</h2>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Registration Form Fee', paid: formFeePaid, amount: '₦5,500' },
                  { label: 'Acceptance Fee', paid: !!hasPaidAcceptanceFee, amount: 'See payments' },
                  { label: 'Tuition Fee', paid: application?.status === 'active', amount: 'See payments' },
                ].map(({ label, paid, amount }) => (
                  <div key={label} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${paid ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />
                      <span className={paid ? 'text-foreground' : 'text-muted-foreground'}>{label}</span>
                    </div>
                    <span className={`text-xs font-medium ${paid ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {paid ? '✓ Paid' : amount}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => window.location.href = '?tab=payments'}
                className="mt-2 w-full text-center text-xs font-semibold text-primary border border-primary/30 rounded-lg py-2.5 hover:bg-primary/5 transition-colors"
              >
                View All Payments →
              </button>
            </div>
          </div>

          {/* ── Documents ── */}
          {formFeePaid && (
            <div className="bg-white rounded-2xl border p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-5">
                <FileText size={16} className="text-primary" />
                <h2 className="font-bold text-base">Documents</h2>
              </div>

              <div className="space-y-3">
                {/* Application form */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-muted/30 rounded-xl border">
                  <div>
                    <p className="font-semibold text-sm">Application Form</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {application?.application_number || application?.id?.split('-')[0].toUpperCase()}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" onClick={() => handleDownloadApplicationForm('print')}>
                      <Printer size={14} className="mr-1.5" /> Print / Save as PDF
                    </Button>
                  </div>
                </div>

                {/* Admission letter */}
                {isAdmitted && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                    <div>
                      <p className="font-semibold text-sm text-green-800">Admission Letter</p>
                      <p className="text-xs text-green-700 mt-0.5">Official IJMB Admission Letter 2026/2027</p>
                    </div>
                    {hasPaidAcceptanceFee ? (
                      <Button size="sm" onClick={downloadAdmissionLetter} className="bg-green-700 hover:bg-green-800 text-white">
                        <Download size={14} className="mr-1.5" /> Download
                      </Button>
                    ) : (
                      <span className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                        Pay acceptance fee to unlock
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Support ── */}
          <div className="rounded-2xl border p-5 sm:p-6 bg-[#f0fdf4] border-[#bbf7d0]">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#25D366] flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6 fill-white">
                  <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.129 6.744 3.047 9.379L1.054 31.27l6.1-1.957a15.9 15.9 0 008.85 2.691C24.826 32 32 24.826 32 16.004S24.826 0 16.004 0zm9.35 22.617c-.393 1.107-1.943 2.025-3.188 2.293-.852.182-1.963.326-5.705-1.227-4.787-1.986-7.867-6.834-8.107-7.152-.229-.318-1.928-2.568-1.928-4.895s1.221-3.473 1.654-3.947c.434-.475.947-.594 1.262-.594.316 0 .631.002.908.016.291.016.682-.111 1.068.814.393.947 1.34 3.264 1.457 3.502.119.238.197.514.039.83-.158.318-.236.514-.475.791-.236.277-.498.619-.711.83-.238.238-.486.496-.209.971.277.475 1.234 2.035 2.65 3.299 1.82 1.623 3.354 2.127 3.83 2.365.475.238.752.197 1.029-.119.277-.316 1.182-1.379 1.498-1.854.316-.475.633-.395 1.068-.238.434.158 2.752 1.299 3.225 1.535.475.238.791.355.908.553.119.197.119 1.145-.275 2.252z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-green-900 text-sm">Need help? Chat with us on WhatsApp</p>
                <p className="text-xs text-green-800 mt-0.5 leading-relaxed">
                  Our admissions team is available Monday–Saturday, 8am–6pm. We typically reply within minutes.
                </p>
                <a
                  href="https://wa.link/udcjk0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-xs font-semibold rounded-lg hover:bg-[#1da851] transition-colors"
                >
                  Open WhatsApp Chat <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </div>

        </main>
      </div>
    </>
  );
};

export default Dashboard;
