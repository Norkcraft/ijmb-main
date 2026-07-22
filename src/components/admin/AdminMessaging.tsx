'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Mail, Send, Users, Loader2, Search, CheckCircle, ChevronDown, Megaphone
} from 'lucide-react';

const GROUPS = [
  { key: 'all',            label: 'All Students',         filter: (s: any) => true },
  { key: 'no_application', label: 'No Application Started', filter: (s: any) => !s.application },
  { key: 'draft',          label: 'Draft / Incomplete',   filter: (s: any) => ['draft'].includes(s.application?.status) },
  { key: 'payment_pending',label: 'Payment Pending',      filter: (s: any) => s.application?.status === 'payment_pending' },
  { key: 'submitted',      label: 'Under Review',         filter: (s: any) => ['submitted','review'].includes(s.application?.status) },
  { key: 'admitted',       label: 'Admitted',             filter: (s: any) => s.application?.status === 'admitted' },
  { key: 'fees_pending',   label: 'Acceptance Fee Pending', filter: (s: any) => s.application?.status === 'fees_pending' },
  { key: 'active',         label: 'Active Students',      filter: (s: any) => s.application?.status === 'active' },
];

const TEMPLATES = [
  { label: 'Pay application fee reminder', subject: 'Reminder: Complete Your IJMB Application Fee Payment', body: 'Dear {name},\n\nThis is a reminder that your IJMB application is ready but your registration fee of ₦10,000 has not been paid yet.\n\nPlease log in to your dashboard and complete your payment to secure your place for the current session.\n\nRegards,\nIJMB Admissions Team' },
  { label: 'Pay acceptance fee reminder', subject: 'Action Required: Pay Your IJMB Acceptance Fee', body: 'Dear {name},\n\nCongratulations on your admission to the IJMB programme! To confirm your place, please log in to your dashboard and pay your acceptance fee as soon as possible.\n\nSlots are limited and your place will only be secured once payment is received.\n\nRegards,\nIJMB Admissions Team' },
  { label: 'Come to school with documents', subject: 'Important: Report to Your Study Centre', body: 'Dear {name},\n\nPlease report to your assigned study centre with the following documents:\n\n• Original O-Level result\n• Admission letter (printed)\n• 4 passport photographs\n• Valid ID card\n• Payment receipts\n\nPlease contact your centre coordinator if you have any questions.\n\nRegards,\nIJMB Admissions Team' },
  { label: 'Session announcement', subject: 'Important Announcement — IJMB Programme', body: 'Dear {name},\n\nWe have an important update regarding the IJMB programme for the current session.\n\n[Add your announcement here]\n\nFor more information, please visit your dashboard or contact us on WhatsApp.\n\nRegards,\nIJMB Admissions Team' },
];

type SentRecord = { to: string; subject: string; sentAt: Date };

export default function AdminMessaging() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<'bulk' | 'individual'>('bulk');
  const [students, setStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  // Bulk state
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [bulkSubject, setBulkSubject] = useState('');
  const [bulkMessage, setBulkMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [sentHistory, setSentHistory] = useState<SentRecord[]>([]);

  // Individual state
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [indivSubject, setIndivSubject] = useState('');
  const [indivMessage, setIndivMessage] = useState('');
  const [sendingIndiv, setSendingIndiv] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoadingStudents(true);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone')
        .eq('role', 'student')
        .order('full_name');
      if (!profiles) { setLoadingStudents(false); return; }
      const ids = profiles.map(p => p.id);
      const { data: apps } = await supabase
        .from('applications')
        .select('user_id, status, form_fee_paid')
        .in('user_id', ids);
      const appMap: Record<string, any> = {};
      (apps || []).forEach(a => { appMap[a.user_id] = a; });
      setStudents(profiles.map(p => ({ ...p, application: appMap[p.id] || null })));
      setLoadingStudents(false);
    };
    load();
  }, []);

  const groupRecipients = useMemo(() => {
    const group = GROUPS.find(g => g.key === selectedGroup);
    return group ? students.filter(group.filter) : students;
  }, [students, selectedGroup]);

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return students.filter(s =>
      s.full_name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.phone?.includes(q)
    ).slice(0, 8);
  }, [students, search]);

  const applyTemplate = (t: typeof TEMPLATES[0]) => {
    setBulkSubject(t.subject);
    setBulkMessage(t.body);
  };

  const sendBulk = async () => {
    if (!bulkSubject.trim() || !bulkMessage.trim() || groupRecipients.length === 0) return;
    if (!confirm(`Send to ${groupRecipients.length} student(s)?`)) return;
    setSending(true);
    setSentCount(0);
    let count = 0;
    const token = session?.access_token;
    for (const student of groupRecipients) {
      if (!student.email) continue;
      const personalised = bulkMessage.replace(/{name}/g, student.full_name?.split(' ')[0] || 'Student');
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            type: 'admin_direct_message',
            data: { email: student.email, studentName: student.full_name, subject: bulkSubject.trim(), message: personalised },
          }),
        });
        count++;
        setSentCount(count);
      } catch { /* continue */ }
    }
    setSentHistory(prev => [{ to: `${GROUPS.find(g=>g.key===selectedGroup)?.label} (${count} students)`, subject: bulkSubject, sentAt: new Date() }, ...prev.slice(0,9)]);
    toast({ title: 'Bulk Email Sent', description: `${count} emails sent successfully.` });
    setSending(false);
    setBulkSubject('');
    setBulkMessage('');
  };

  const sendIndividual = async () => {
    if (!selectedStudent || !indivSubject.trim() || !indivMessage.trim()) return;
    setSendingIndiv(true);
    try {
      const token = session?.access_token;
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          type: 'admin_direct_message',
          data: { email: selectedStudent.email, studentName: selectedStudent.full_name, subject: indivSubject.trim(), message: indivMessage.trim() },
        }),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      setSentHistory(prev => [{ to: selectedStudent.full_name, subject: indivSubject, sentAt: new Date() }, ...prev.slice(0,9)]);
      toast({ title: 'Email Sent', description: `Message delivered to ${selectedStudent.full_name}.` });
      setSelectedStudent(null);
      setIndivSubject('');
      setIndivMessage('');
      setSearch('');
    } catch (err: any) {
      toast({ title: 'Failed', description: err.message, variant: 'destructive' });
    } finally {
      setSendingIndiv(false);
    }
  };

  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-4xl">
      <div>
        <h2 className="font-bold text-lg flex items-center gap-2">
          <Megaphone size={18} className="text-primary" /> Communications
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">Send emails to students individually or in bulk</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl w-fit">
        {[
          { key: 'bulk', label: 'Bulk Email', icon: <Users size={14} /> },
          { key: 'individual', label: 'Individual Email', icon: <Mail size={14} /> },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t.key ? 'bg-white shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">

          {tab === 'bulk' ? (
            <>
              {/* Group selector */}
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base">Select Recipients</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {GROUPS.map(g => {
                      const count = students.filter(g.filter).length;
                      const selected = selectedGroup === g.key;
                      return (
                        <button
                          key={g.key}
                          onClick={() => setSelectedGroup(g.key)}
                          className={`text-left p-3 rounded-xl border text-sm transition-all ${
                            selected ? 'border-primary bg-primary/5 text-primary font-semibold' : 'border-border hover:border-primary/40 hover:bg-muted/30'
                          }`}
                        >
                          <p className="font-medium leading-tight">{g.label}</p>
                          <p className={`text-xs mt-0.5 ${selected ? 'text-primary/70' : 'text-muted-foreground'}`}>{loadingStudents ? '…' : count} student{count !== 1 ? 's' : ''}</p>
                        </button>
                      );
                    })}
                  </div>
                  {groupRecipients.length > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                      <Users size={14} className="text-green-600 shrink-0" />
                      <p className="text-xs text-green-700 font-medium">{groupRecipients.length} student{groupRecipients.length !== 1 ? 's' : ''} will receive this email</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Templates */}
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base">Quick Templates</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 gap-2">
                  {TEMPLATES.map(t => (
                    <button
                      key={t.label}
                      onClick={() => applyTemplate(t)}
                      className="text-left px-4 py-3 rounded-xl border border-border hover:border-primary/40 hover:bg-muted/30 text-sm transition-all group"
                    >
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">{t.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{t.subject}</p>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Compose */}
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base">Compose</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Subject</Label>
                    <Input placeholder="Email subject…" value={bulkSubject} onChange={e => setBulkSubject(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Message</Label>
                    <p className="text-xs text-muted-foreground">Use <code className="bg-muted px-1 rounded">{'{name}'}</code> to personalise with each student's first name.</p>
                    <textarea
                      rows={8}
                      placeholder="Type your message here…"
                      value={bulkMessage}
                      onChange={e => setBulkMessage(e.target.value)}
                      className="w-full px-3 py-2 text-sm border rounded-xl bg-background resize-y focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <Button
                    className="w-full gap-2"
                    disabled={sending || !bulkSubject.trim() || !bulkMessage.trim() || groupRecipients.length === 0}
                    onClick={sendBulk}
                  >
                    {sending
                      ? <><Loader2 size={15} className="animate-spin" /> Sending {sentCount}/{groupRecipients.length}…</>
                      : <><Send size={15} /> Send to {groupRecipients.length} Student{groupRecipients.length !== 1 ? 's' : ''}</>}
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            /* Individual tab */
            <>
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base">Find Student</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="Search by name or email…"
                      value={search}
                      onChange={e => { setSearch(e.target.value); setSelectedStudent(null); }}
                    />
                  </div>
                  {search && searchResults.length > 0 && !selectedStudent && (
                    <div className="border rounded-xl overflow-hidden divide-y">
                      {searchResults.map(s => (
                        <button
                          key={s.id}
                          onClick={() => { setSelectedStudent(s); setSearch(s.full_name); }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/40 text-left transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                            {s.full_name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{s.full_name}</p>
                            <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedStudent && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                        {selectedStudent.full_name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{selectedStudent.full_name}</p>
                        <p className="text-xs text-muted-foreground">{selectedStudent.email}</p>
                      </div>
                      <CheckCircle size={16} className="text-primary shrink-0" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {selectedStudent && (
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base">Compose</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <Label>Subject</Label>
                      <Input placeholder="Email subject…" value={indivSubject} onChange={e => setIndivSubject(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Message</Label>
                      <textarea
                        rows={8}
                        placeholder="Type your message…"
                        value={indivMessage}
                        onChange={e => setIndivMessage(e.target.value)}
                        className="w-full px-3 py-2 text-sm border rounded-xl bg-background resize-y focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <Button
                      className="w-full gap-2"
                      disabled={sendingIndiv || !indivSubject.trim() || !indivMessage.trim()}
                      onClick={sendIndividual}
                    >
                      {sendingIndiv
                        ? <><Loader2 size={15} className="animate-spin" /> Sending…</>
                        : <><Send size={15} /> Send Email</>}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        {/* Sent history sidebar */}
        <div>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Recent Sends</CardTitle></CardHeader>
            <CardContent>
              {sentHistory.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No emails sent this session</p>
              ) : (
                <div className="space-y-3">
                  {sentHistory.map((s, i) => (
                    <div key={i} className="space-y-1 pb-3 border-b last:border-0 last:pb-0">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle size={11} className="text-green-600 shrink-0" />
                        <p className="text-xs font-medium text-foreground truncate">{s.to}</p>
                      </div>
                      <p className="text-xs text-muted-foreground truncate pl-4">{s.subject}</p>
                      <p className="text-[10px] text-muted-foreground/60 pl-4">{s.sentAt.toLocaleTimeString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
