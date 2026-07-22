
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Loader2, MapPin, Trash2 } from 'lucide-react';
import { STATES_OF_NIGERIA } from '@/types/application';

export default function AdminCentres() {
  const { toast } = useToast();
  const [centres, setCentres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [state, setState] = useState('');
  const [phone, setPhone] = useState('');
  const [tuitionFee, setTuitionFee] = useState('');
  const [hostelFee, setHostelFee] = useState('');
  const [active, setActive] = useState(true);

  const fetchCentres = async () => {
    setLoading(true);
    const { data } = await supabase.from('centres').select('*').order('name');
    setCentres(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCentres(); }, []);

  const openModal = (centre?: any) => {
    if (centre) {
      setEditing(centre);
      setName(centre.name);
      setLocation(centre.location);
      setState(centre.state);
      setPhone(centre.contact_phone || '');
      setTuitionFee(centre.tuition_fee || '0');
      setHostelFee(centre.hostel_fee || '0');
      setActive(centre.active);
    } else {
      setEditing(null);
      setName('');
      setLocation('');
      setState('');
      setPhone('');
      setTuitionFee('0');
      setHostelFee('0');
      setActive(true);
    }
    setOpen(true);
  };

  const handleSave = async () => {
    if (!name || !state) {
      toast({ title: 'Validation Error', description: 'Name and State are required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const payload = {
      name,
      location,
      state,
      contact_phone: phone,
      tuition_fee: parseFloat(tuitionFee) || 0,
      hostel_fee: parseFloat(hostelFee) || 0,
      active,
      updated_at: new Date().toISOString()
    };

    let error;
    if (editing) {
      ({ error } = await supabase.from('centres').update(payload).eq('id', editing.id));
    } else {
      ({ error } = await supabase.from('centres').insert(payload));
    }

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: editing ? 'Centre Updated' : 'Centre Added' });
      setOpen(false);
      fetchCentres();
    }
    setSaving(false);
  };

  const handleDelete = async (centre: any) => {
    // Check if any applications reference this centre
    const { count } = await supabase
      .from('applications')
      .select('id', { count: 'exact', head: true })
      .or(`preferred_centre_id.eq.${centre.id},assigned_centre_id.eq.${centre.id}`);

    if ((count || 0) > 0) {
      toast({
        title: 'Cannot delete',
        description: `This centre has ${count} application(s) referencing it. Deactivate it instead.`,
        variant: 'destructive',
      });
      return;
    }

    if (!confirm(`Delete "${centre.name}"? This cannot be undone.`)) return;

    setDeletingId(centre.id);
    const { error } = await supabase.from('centres').delete().eq('id', centre.id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Centre deleted' });
      fetchCentres();
    }
    setDeletingId(null);
  };

  const toggleStatus = async (centre: any) => {
    const { error } = await supabase.from('centres').update({ active: !centre.active }).eq('id', centre.id);
    if (!error) {
      toast({ title: `Centre ${!centre.active ? 'Activated' : 'Deactivated'}` });
      fetchCentres();
    }
  };

  if (loading) return <div className="p-4 text-center">Loading centres...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <CardTitle>Manage Study Centres</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openModal()}><Plus size={16} className="mr-2" /> Add Centre</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? 'Edit Centre' : 'Add New Centre'}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Centre Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Brainiacs Academy" />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={state} onChange={e => setState(e.target.value)}>
                  <option value="">Select State</option>
                  {STATES_OF_NIGERIA.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Location/Address</Label>
                <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Full address" />
              </div>
              <div className="space-y-2">
                <Label>Contact Phone</Label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="080..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Tuition Fee (₦)</Label>
                    <Input type="number" value={tuitionFee} onChange={e => setTuitionFee(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Hostel Fee (₦)</Label>
                    <Input type="number" value={hostelFee} onChange={e => setHostelFee(e.target.value)} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} id="active" />
                <Label htmlFor="active">Active (Visible to students)</Label>
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? <Loader2 className="animate-spin" /> : 'Save Centre'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Tuition</TableHead>
                <TableHead className="hidden sm:table-cell">Hostel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {centres.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">
                    {c.name}
                    <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin size={10} /> {c.location}</div>
                  </TableCell>
                  <TableCell>{c.state}</TableCell>
                  <TableCell>₦{c.tuition_fee?.toLocaleString() || '0'}</TableCell>
                  <TableCell className="hidden sm:table-cell">₦{c.hostel_fee?.toLocaleString() || '0'}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => toggleStatus(c)} className={c.active ? 'text-green-600' : 'text-red-600'}>
                      {c.active ? 'Active' : 'Inactive'}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => openModal(c)}><Edit size={14} /></Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:border-destructive"
                        onClick={() => handleDelete(c)}
                        disabled={deletingId === c.id}
                      >
                        {deletingId === c.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
