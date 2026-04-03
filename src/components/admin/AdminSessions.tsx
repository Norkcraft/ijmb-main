import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Loader2, Calendar } from 'lucide-react';

export default function AdminSessions() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('open');

  const fetchSessions = async () => {
    setLoading(true);
    const { data } = await supabase.from('sessions').select('*').order('created_at', { ascending: false });
    setSessions(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchSessions(); }, []);

  const openModal = (sess?: any) => {
    if (sess) {
      setEditing(sess);
      setName(sess.name);
      setCode(sess.code);
      setStartDate(sess.start_date || '');
      setEndDate(sess.end_date || '');
      setStatus(sess.status);
    } else {
      setEditing(null);
      setName('');
      setCode('');
      setStartDate('');
      setEndDate('');
      setStatus('open');
    }
    setOpen(true);
  };

  const handleSave = async () => {
    if (!name || !code) return;
    setSaving(true);
    const payload = {
      name,
      code,
      start_date: startDate || null,
      end_date: endDate || null,
      status
    };

    let error;
    if (editing) {
      ({ error } = await supabase.from('sessions').update(payload).eq('id', editing.id));
    } else {
      ({ error } = await supabase.from('sessions').insert(payload));
    }

    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else {
      toast({ title: editing ? 'Session Updated' : 'Session Added' });
      setOpen(false);
      fetchSessions();
    }
    setSaving(false);
  };

  const toggleStatus = async (sess: any) => {
    const newStatus = sess.status === 'open' ? 'closed' : 'open';
    const { error } = await supabase.from('sessions').update({ status: newStatus }).eq('id', sess.id);
    if (!error) {
      toast({ title: `Session ${newStatus}` });
      fetchSessions();
    }
  };

  if (loading) return <div className="p-4 text-center">Loading sessions...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Academic Sessions</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openModal()}><Plus size={16} className="mr-2" /> Add Session</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? 'Edit Session' : 'Add Session'}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Session Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. 2026/2027" />
              </div>
              <div className="space-y-2">
                <Label>Code</Label>
                <Input value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. 2026" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="open">Open (Registration Active)</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full">{saving ? <Loader2 className="animate-spin" /> : 'Save'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Code</TableHead><TableHead>Period</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {sessions.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>{s.code}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {s.start_date ? new Date(s.start_date).toLocaleDateString() : '?'} — {s.end_date ? new Date(s.end_date).toLocaleDateString() : '?'}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => toggleStatus(s)} className={s.status === 'open' ? 'text-green-600' : 'text-red-600'}>
                    {s.status.toUpperCase()}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => openModal(s)}><Edit size={14} /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
