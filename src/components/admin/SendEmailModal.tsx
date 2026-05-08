'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Send, Loader2, Mail } from 'lucide-react';

interface SendEmailModalProps {
  student: { id: string; full_name: string; email: string } | null;
  onClose: () => void;
}

export default function SendEmailModal({ student, onClose }: SendEmailModalProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  const handleSend = async () => {
    if (!student || !subject.trim() || !message.trim()) return;
    setSending(true);
    try {
      const token = session?.access_token;
      if (!token) throw new Error('Not signed in.');

      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'admin_direct_message',
          data: {
            email: student.email,
            studentName: student.full_name,
            subject: subject.trim(),
            message: message.trim(),
          },
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((json as any).message || 'Failed to send');

      toast({ title: 'Email Sent', description: `Message delivered to ${student.full_name}.` });
      setSubject('');
      setMessage('');
      onClose();
    } catch {
      toast({ title: 'Send Failed', description: 'Could not send the email. Please try again.', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={!!student} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail size={18} className="text-primary" />
            Send Email to Student
          </DialogTitle>
        </DialogHeader>

        {student && (
          <div className="space-y-4">
            {/* Recipient */}
            <div className="bg-muted/40 rounded-lg px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                {student.full_name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{student.full_name}</p>
                <p className="text-xs text-muted-foreground truncate">{student.email}</p>
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                placeholder="e.g. Action required on your IJMB application"
                value={subject}
                onChange={e => setSubject(e.target.value)}
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <Label htmlFor="email-message">Message</Label>
              <textarea
                id="email-message"
                rows={5}
                placeholder="Type your message here…"
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end pt-1">
              <Button variant="outline" onClick={onClose} disabled={sending}>Cancel</Button>
              <Button
                onClick={handleSend}
                disabled={sending || !subject.trim() || !message.trim()}
                className="gap-2"
              >
                {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                {sending ? 'Sending…' : 'Send Email'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
