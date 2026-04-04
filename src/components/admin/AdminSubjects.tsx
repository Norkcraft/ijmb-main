import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminSubjects() {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [openSub, setOpenSub] = useState(false);
  const [openCombo, setOpenCombo] = useState(false);
  const [editingSub, setEditingSub] = useState<any>(null);
  const [editingCombo, setEditingCombo] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [subName, setSubName] = useState('');
  const [subCode, setSubCode] = useState('');

  const [comboName, setComboName] = useState('');
  const [comboTrack, setComboTrack] = useState('Science');
  const [comboSubject1, setComboSubject1] = useState('');
  const [comboSubject2, setComboSubject2] = useState('');
  const [comboSubject3, setComboSubject3] = useState('');
  const [comboActive, setComboActive] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [s, c] = await Promise.all([
      supabase.from('subjects').select('*').order('name'),
      supabase.from('subject_combinations').select('*').order('name'),
    ]);
    setSubjects(s.data || []);
    setCombos(c.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const saveSubject = async () => {
    if (!subName) return;
    setSaving(true);
    const payload = { name: subName, code: subCode };
    let error;
    if (editingSub) {
      ({ error } = await supabase.from('subjects').update(payload).eq('id', editingSub.id));
    } else {
      ({ error } = await supabase.from('subjects').insert(payload));
    }
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Subject Saved' }); setOpenSub(false); setSubName(''); setSubCode(''); setEditingSub(null); await fetchData(); }
    setSaving(false);
  };

  const resetComboForm = () => {
    setEditingCombo(null); setComboName(''); setComboTrack('Science');
    setComboSubject1(''); setComboSubject2(''); setComboSubject3(''); setComboActive(true);
  };

  const saveCombo = async () => {
    if (!comboName || !comboSubject1 || !comboSubject2 || !comboSubject3) {
      toast({ title: 'Validation Error', description: 'Please fill in the name and all three subjects.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const payload = { name: comboName, track: comboTrack, subject1: comboSubject1, subject2: comboSubject2, subject3: comboSubject3, active: comboActive };
    let error;
    if (editingCombo) {
      ({ error } = await supabase.from('subject_combinations').update(payload).eq('id', editingCombo.id));
    } else {
      ({ error } = await supabase.from('subject_combinations').insert(payload));
    }
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: editingCombo ? 'Combination Updated' : 'Combination Added' }); setOpenCombo(false); resetComboForm(); await fetchData(); }
    setSaving(false);
  };

  const openSubModal = (s?: any) => { setEditingSub(s || null); setSubName(s?.name || ''); setSubCode(s?.code || ''); setOpenSub(true); };

  const openComboModal = (c?: any) => {
    if (c) { setEditingCombo(c); setComboName(c.name); setComboTrack(c.track); setComboSubject1(c.subject1 || ''); setComboSubject2(c.subject2 || ''); setComboSubject3(c.subject3 || ''); setComboActive(c.active ?? true); }
    else resetComboForm();
    setOpenCombo(true);
  };

  const toggleComboStatus = async (combo: any) => {
    const { error } = await supabase.from('subject_combinations').update({ active: !combo.active }).eq('id', combo.id);
    if (!error) { toast({ title: `Combination ${!combo.active ? 'activated' : 'deactivated'}` }); fetchData(); }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading subjects...</div>;

  const subjectNames = subjects.map(s => s.name);

  return (
    <Card>
      <Tabs defaultValue="combos" className="w-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Manage Subjects & Combinations</CardTitle>
          <TabsList>
            <TabsTrigger value="combos">Combinations</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>

          {/* Combinations */}
          <TabsContent value="combos" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => openComboModal()}><Plus size={16} className="mr-2" /> Add Combination</Button>
            </div>
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Track</TableHead><TableHead>Subjects</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {combos.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell><Badge variant="outline">{c.track}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{[c.subject1, c.subject2, c.subject3].filter(Boolean).join(' · ')}</TableCell>
                    <TableCell>
                      <button onClick={() => toggleComboStatus(c)}>
                        <Badge className={c.active ? 'bg-green-600 hover:bg-green-700 cursor-pointer' : 'bg-red-500 hover:bg-red-600 cursor-pointer'}>{c.active ? 'Active' : 'Inactive'}</Badge>
                      </button>
                    </TableCell>
                    <TableCell><Button variant="ghost" size="sm" onClick={() => openComboModal(c)}><Edit size={14} /></Button></TableCell>
                  </TableRow>
                ))}
                {combos.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No combinations yet.</TableCell></TableRow>}
              </TableBody>
            </Table>

            <Dialog open={openCombo} onOpenChange={(o) => { if (!o) resetComboForm(); setOpenCombo(o); }}>
              <DialogContent className="max-w-md">
                <DialogHeader><DialogTitle>{editingCombo ? 'Edit Combination' : 'Add Subject Combination'}</DialogTitle></DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Combination Name</Label>
                    <Input value={comboName} onChange={e => setComboName(e.target.value)} placeholder="e.g. Physics, Chemistry & Maths" />
                  </div>
                  <div className="space-y-2">
                    <Label>Track</Label>
                    <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={comboTrack} onChange={e => setComboTrack(e.target.value)}>
                      <option value="Science">Science</option>
                      <option value="Social Science">Social Science</option>
                      <option value="Arts">Arts</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>
                  {[
                    { label: 'Subject 1', val: comboSubject1, set: setComboSubject1 },
                    { label: 'Subject 2', val: comboSubject2, set: setComboSubject2 },
                    { label: 'Subject 3', val: comboSubject3, set: setComboSubject3 },
                  ].map(({ label, val, set }) => (
                    <div key={label} className="space-y-2">
                      <Label>{label}</Label>
                      <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={val} onChange={e => set(e.target.value)}>
                        <option value="">Select subject...</option>
                        {subjectNames.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="combo-active" checked={comboActive} onChange={e => setComboActive(e.target.checked)} />
                    <Label htmlFor="combo-active">Active (visible to students)</Label>
                  </div>
                  <Button onClick={saveCombo} disabled={saving} className="w-full">
                    {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : null}Save Combination
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Subjects */}
          <TabsContent value="subjects" className="space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => openSubModal()}><Plus size={16} className="mr-2" /> Add Subject</Button>
            </div>
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Code</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {subjects.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="text-muted-foreground">{s.code || '—'}</TableCell>
                    <TableCell><Button variant="ghost" size="sm" onClick={() => openSubModal(s)}><Edit size={14} /></Button></TableCell>
                  </TableRow>
                ))}
                {subjects.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">No subjects yet.</TableCell></TableRow>}
              </TableBody>
            </Table>
            <Dialog open={openSub} onOpenChange={setOpenSub}>
              <DialogContent>
                <DialogHeader><DialogTitle>{editingSub ? 'Edit Subject' : 'Add Subject'}</DialogTitle></DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Subject Name</Label>
                    <Input value={subName} onChange={e => setSubName(e.target.value)} placeholder="e.g. Physics" />
                  </div>
                  <div className="space-y-2">
                    <Label>Short Code (optional)</Label>
                    <Input value={subCode} onChange={e => setSubCode(e.target.value)} placeholder="e.g. PHY" maxLength={5} />
                  </div>
                  <Button onClick={saveSubject} disabled={saving} className="w-full">
                    {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : null}Save Subject
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

        </CardContent>
      </Tabs>
    </Card>
  );
}
