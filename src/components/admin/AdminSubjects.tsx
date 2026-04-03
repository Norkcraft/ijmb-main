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
  
  // Modals
  const [openSub, setOpenSub] = useState(false);
  const [openCombo, setOpenCombo] = useState(false);
  const [editingSub, setEditingSub] = useState<any>(null);
  const [editingCombo, setEditingCombo] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Form
  const [subName, setSubName] = useState('');
  const [subCode, setSubCode] = useState('');
  
  const [comboName, setComboName] = useState('');
  const [comboTrack, setComboTrack] = useState('Science');
  const [comboActive, setComboActive] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [s, c] = await Promise.all([
      supabase.from('subjects').select('*').order('name'),
      supabase.from('subject_combinations').select('*').order('name')
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
    
    if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Subject Saved' });
      setOpenSub(false);
      // Reset form
      setSubName('');
      setSubCode('');
      setEditingSub(null);
      await fetchData();
    }
    setSaving(false);
  };

  const saveCombo = async () => {
    if (!comboName) return;
    setSaving(true);
    const payload = { name: comboName, track: comboTrack, active: comboActive };
    let error;
    if (editingCombo) {
      ({ error } = await supabase.from('subject_combinations').update(payload).eq('id', editingCombo.id));
    } else {
      ({ error } = await supabase.from('subject_combinations').insert(payload));
    }
    
    if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Combination Saved' });
      setOpenCombo(false);
      // Reset form
      setComboName('');
      setComboTrack('Science');
      setComboActive(true);
      setEditingCombo(null);
      await fetchData();
    }
    setSaving(false);
  };

  const openSubModal = (s?: any) => {
    setEditingSub(s || null);
    setSubName(s?.name || '');
    setSubCode(s?.code || '');
    setOpenSub(true);
  };

  const openComboModal = (c?: any) => {
    setEditingCombo(c || null);
    setComboName(c?.name || '');
    setComboTrack(c?.track || 'Science');
    setComboActive(c?.active ?? true);
    setOpenCombo(true);
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <Card>
      <Tabs defaultValue="combos" className="w-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Manage Subjects</CardTitle>
          <TabsList>
            <TabsTrigger value="combos">Combinations</TabsTrigger>
            <TabsTrigger value="subjects">Individual Subjects</TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <CardContent>
          <TabsContent value="combos" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => openComboModal()}><Plus size={16} className="mr-2" /> Add Combination</Button>
            </div>
            
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Track</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {combos.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell><Badge variant="outline">{c.track}</Badge></TableCell>
                    <TableCell>
                      <Badge className={c.active ? 'bg-green-600' : 'bg-red-600'}>{c.active ? 'Active' : 'Inactive'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => openComboModal(c)}><Edit size={14} /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Dialog open={openCombo} onOpenChange={setOpenCombo}>
              <DialogContent>
                <DialogHeader><DialogTitle>{editingCombo ? 'Edit Combo' : 'Add Combo'}</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Combination Name</Label>
                    <Input value={comboName} onChange={e => setComboName(e.target.value)} placeholder="e.g. Phy, Chem, Bio" />
                  </div>
                  <div className="space-y-2">
                    <Label>Track</Label>
                    <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={comboTrack} onChange={e => setComboTrack(e.target.value)}>
                      <option value="Science">Science</option>
                      <option value="Social Science">Social Science</option>
                      <option value="Arts">Arts</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={comboActive} onChange={e => setComboActive(e.target.checked)} id="active" />
                    <Label htmlFor="active">Active</Label>
                  </div>
                  <Button onClick={saveCombo} disabled={saving} className="w-full">{saving ? <Loader2 className="animate-spin" /> : 'Save'}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => openSubModal()} variant="outline"><Plus size={16} className="mr-2" /> Add Subject</Button>
            </div>
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Code</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {subjects.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.code || '—'}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => openSubModal(s)}><Edit size={14} /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <Dialog open={openSub} onOpenChange={setOpenSub}>
              <DialogContent>
                <DialogHeader><DialogTitle>{editingSub ? 'Edit Subject' : 'Add Subject'}</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Subject Name</Label>
                    <Input value={subName} onChange={e => setSubName(e.target.value)} placeholder="e.g. Physics" />
                  </div>
                  <div className="space-y-2">
                    <Label>Code</Label>
                    <Input value={subCode} onChange={e => setSubCode(e.target.value)} placeholder="e.g. PHY" />
                  </div>
                  <Button onClick={saveSubject} disabled={saving} className="w-full">{saving ? <Loader2 className="animate-spin" /> : 'Save'}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
