
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, RefreshCw } from 'lucide-react';

interface Fee {
  id: string;
  name: string;
  amount: number;
  description: string;
}

const FEE_LABELS: Record<string, string> = {
  form_fee: 'Registration Form Fee',
  acceptance_fee: 'Acceptance Fee',
  tuition_fee: 'Tuition Fee (Standard)',
  hostel_fee: 'Hostel Fee (Standard)',
};

const AdminFees = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchFees = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('fees')
      .select('*')
      .order('name');
    
    if (error) {
      toast({ title: 'Error fetching fees', description: error.message, variant: 'destructive' });
    } else {
      setFees(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleUpdate = async (id: string, newAmount: string) => {
    setSaving(id);
    const amount = parseFloat(newAmount);
    
    if (isNaN(amount) || amount < 0) {
      toast({ title: 'Invalid amount', description: 'Please enter a valid positive number.', variant: 'destructive' });
      setSaving(null);
      return;
    }

    const { error } = await supabase
      .from('fees')
      .update({ amount, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Fee updated successfully' });
      // Update local state
      setFees(prev => prev.map(f => f.id === id ? { ...f, amount } : f));
    }
    setSaving(null);
  };

  if (loading) {
    return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Fee Management</CardTitle>
          <CardDescription>Configure global fee amounts for the platform.</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={fetchFees}>
          <RefreshCw size={16} className="mr-2" /> Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {fees.map((fee) => (
            <div key={fee.id} className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
              <div className="mb-4">
                <Label htmlFor={fee.name} className="text-base font-semibold">
                  {FEE_LABELS[fee.name] || fee.name}
                </Label>
                <p className="text-sm text-muted-foreground">{fee.description}</p>
              </div>
              
              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">₦</span>
                  <Input 
                    id={fee.name}
                    type="number" 
                    defaultValue={fee.amount}
                    className="pl-8"
                    onBlur={(e) => {
                      if (parseFloat(e.target.value) !== fee.amount) {
                        handleUpdate(fee.id, e.target.value);
                      }
                    }}
                  />
                </div>
                <Button 
                  size="icon" 
                  disabled={saving === fee.id}
                  onClick={() => {
                    const input = document.getElementById(fee.name) as HTMLInputElement;
                    handleUpdate(fee.id, input.value);
                  }}
                >
                  {saving === fee.id ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminFees;
