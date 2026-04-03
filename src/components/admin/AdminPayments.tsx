import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-4 text-center"><Loader2 className="animate-spin inline mr-2" /> Loading payments...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Records</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No payments found.</TableCell></TableRow>
            ) : (
              payments.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.reference}</TableCell>
                  <TableCell>
                    <div className="font-medium">{p.profiles?.full_name || 'Unknown'}</div>
                    <div className="text-xs text-muted-foreground">{p.profiles?.phone}</div>
                  </TableCell>
                  <TableCell>₦{p.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === 'success' ? 'default' : 'destructive'} className={p.status === 'success' ? 'bg-green-600' : ''}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(p.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
