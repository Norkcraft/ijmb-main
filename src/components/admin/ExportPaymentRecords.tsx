'use client';

import { useRef, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { filterPaymentRecords, paymentLabels, type PaymentSnapshot } from '@/lib/paymentRecords';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function ExportPaymentRecords({ search = '', feeType = '' }: { search?: string; feeType?: string }) {
  const [open, setOpen] = useState(false);
  const [period, setPeriod] = useState('all');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [useFilters, setUseFilters] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const inFlight = useRef(false);
  const invalid = period === 'custom' && (!start || !end || start > end);
  const hasFilters = Boolean(search.trim() || feeType);

  async function generate() {
    if (inFlight.current || invalid) return;
    inFlight.current = true; setBusy(true); setError('');
    try {
      // Load static resources first so the snapshot is taken immediately before PDF creation.
      const [{ buildPaymentRecordsPDF }, logoResponse] = await Promise.all([
        import('@/lib/paymentRecordsPDF'), fetch('/ijmb-logo.jpeg'),
      ]);
      if (!logoResponse.ok) throw new Error('Unable to load the institution logo. Please try again.');
      const blob = await logoResponse.blob();
      const logo = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Unable to read the institution logo.'));
        reader.readAsDataURL(blob);
      });
      const { data, error: queryError } = await supabase.rpc('export_payment_records', {
        period, start_date: period === 'custom' ? start : null, end_date: period === 'custom' ? end : null,
      });
      if (queryError) throw new Error('Unable to retrieve current payment records. Please try again or contact your administrator.');
      if (!data || !Array.isArray(data.records) || !data.generatedAt) throw new Error('The payment report could not be loaded. Please try again.');
      const snapshot = data as PaymentSnapshot;
      const applyFilters = useFilters && hasFilters;
      snapshot.records = filterPaymentRecords(snapshot.records, applyFilters ? search : '', applyFilters ? feeType : '');
      if (!snapshot.records.length) { setError('No payment records match this date range and selection. Choose a different range.'); return; }
      const scope = applyFilters
        ? `Selection: ${feeType ? paymentLabels[feeType] || feeType : 'All payment types'}; search: ${search.trim() || 'None'}`
        : 'Selection: All students and payment types';
      const pdf = buildPaymentRecordsPDF(snapshot, logo, scope);
      pdf.save(`IJMB-Payment-Records-${snapshot.generatedAt.replace(/[:.]/g, '-')}.pdf`);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to export payment records. Please try again.');
    } finally { inFlight.current = false; setBusy(false); }
  }

  return (
    <Dialog open={open} onOpenChange={value => { if (!busy) { setOpen(value); setError(''); } }}>
      <DialogTrigger asChild><Button variant="outline"><Download className="mr-2 h-4 w-4" />Export Payment Records</Button></DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Export Payment Records</DialogTitle>
          <DialogDescription>Download a student-grouped PDF with intended centres, complete transaction histories, current statuses, and totals.</DialogDescription>
        </DialogHeader>
        <form onSubmit={event => { event.preventDefault(); void generate(); }} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payment-export-period">Payment date range</Label>
            <select id="payment-export-period" className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={period} disabled={busy} onChange={e => { setPeriod(e.target.value); setError(''); }}>
              <option value="today">Today</option><option value="week">This Week</option><option value="month">This Month</option><option value="custom">Custom Date Range</option><option value="all">All Records</option>
            </select>
            <p className="text-xs text-muted-foreground">Dates use Nigeria time (WAT). Weeks start on Monday. Payment date is the transaction date shown in the dashboard.</p>
          </div>
          {period === 'custom' && <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label htmlFor="payment-export-start">From</Label><Input id="payment-export-start" type="date" required max={end || undefined} value={start} disabled={busy} onChange={e => { setStart(e.target.value); setError(''); }} /></div>
            <div className="space-y-2"><Label htmlFor="payment-export-end">To (inclusive)</Label><Input id="payment-export-end" type="date" required min={start || undefined} value={end} disabled={busy} onChange={e => { setEnd(e.target.value); setError(''); }} /></div>
          </div>}
          {period === 'custom' && start && end && start > end && <p className="text-sm text-destructive">The end date must be on or after the start date.</p>}
          {hasFilters && <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1" checked={useFilters} disabled={busy} onChange={e => { setUseFilters(e.target.checked); setError(''); }} /><span>Apply current search and payment-type filters<span className="block text-xs text-muted-foreground break-words">{search || 'All students'} / {paymentLabels[feeType] || 'All payment types'}</span></span></label>}
          <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">Payments are grouped by student with the newest transaction first. Every payment and reference remains visible. Totals count successful payments only.</p>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" disabled={busy} onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={busy || invalid}>{busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}{busy ? 'Generating PDF...' : 'Download PDF'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
