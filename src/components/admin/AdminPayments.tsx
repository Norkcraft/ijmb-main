import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';

const FEE_LABELS: Record<string, string> = {
  form_fee: 'Registration Fee',
  acceptance_fee: 'Acceptance Fee',
  tuition_fee: 'Tuition Fee',
  hostel_fee: 'Hostel Fee',
};

const FEE_COLORS: Record<string, string> = {
  form_fee: 'bg-blue-100 text-blue-800',
  acceptance_fee: 'bg-purple-100 text-purple-800',
  tuition_fee: 'bg-green-100 text-green-800',
  hostel_fee: 'bg-orange-100 text-orange-800',
};

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('payments')
        .select(`
          *,
          profiles:user_id(full_name, phone)
        `)
        .order('created_at', { ascending: false });
      setPayments(data || []);
      setLoading(false);
    };
    fetchPayments();
  }, []);

  const filtered = payments.filter(p => {
    const feeType = p.metadata?.payment_type || p.fee_type || '';
    if (filterType && feeType !== filterType) return false;
    if (search) {
      const q = search.toLowerCase();
      const name = (p.profiles?.full_name || '').toLowerCase();
      const ref = (p.reference || '').toLowerCase();
      if (!name.includes(q) && !ref.includes(q)) return false;
    }
    return true;
  });

  // Totals by type
  const totals = payments.reduce((acc: Record<string, number>, p) => {
    if (p.status !== 'success') return acc;
    const type = p.metadata?.payment_type || p.fee_type || 'other';
    acc[type] = (acc[type] || 0) + Number(p.amount);
    return acc;
  }, {});

  if (loading) return <div className="p-4 text-center"><Loader2 className="animate-spin inline mr-2" /> Loading payments...</div>;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(FEE_LABELS).map(([key, label]) => (
          <Card key={key}>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground uppercase font-medium mb-1">{label}</p>
              <p className="text-xl font-bold">₦{(totals[key] || 0).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {payments.filter(p => (p.metadata?.payment_type || p.fee_type) === key && p.status === 'success').length} payment(s)
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
          <CardDescription>All transactions across all students.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[180px]">
              <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
              <Input placeholder="Search name or reference..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="">All Fee Types</option>
              {Object.entries(FEE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Fee Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No payments found.</TableCell></TableRow>
                ) : (
                  filtered.map(p => {
                    const feeType = p.metadata?.payment_type || p.fee_type || '';
                    return (
                      <TableRow key={p.id}>
                        <TableCell className="font-mono text-xs">{p.reference}</TableCell>
                        <TableCell>
                          <div className="font-medium">{p.profiles?.full_name || 'Unknown'}</div>
                          <div className="text-xs text-muted-foreground">{p.profiles?.phone}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={FEE_COLORS[feeType] || 'bg-gray-100 text-gray-700'}>
                            {FEE_LABELS[feeType] || feeType || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">₦{Number(p.amount).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={p.status === 'success' ? 'default' : 'destructive'} className={p.status === 'success' ? 'bg-green-600' : ''}>
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">{new Date(p.created_at).toLocaleString()}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
