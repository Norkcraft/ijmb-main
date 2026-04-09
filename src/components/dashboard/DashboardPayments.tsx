'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
const PaymentButton = dynamic(() => import('@/components/PaymentButton'), { ssr: false });

interface DashboardPaymentsProps {
  user: any;
  application: any;
  onFeePaymentSuccess: (feeName: string) => Promise<void>;
}

export const DashboardPayments = ({
  user,
  application,
  onFeePaymentSuccess
}: DashboardPaymentsProps) => {
  const isAdmitted = application && ['admitted', 'fees_pending', 'active'].includes(application.status);
  const { toast } = useToast();
  const [fees, setFees] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hostelNeeded, setHostelNeeded] = useState(application?.hostel_needed || false);
  const [processing, setProcessing] = useState(false);
  // Optimistic paid state — updated immediately on payment success so the UI
  // shows "Paid" right away without waiting for the Paystack webhook to fire.
  const [optimisticPaid, setOptimisticPaid] = useState<Set<string>>(new Set());

  // Toggle Hostel
  const toggleHostel = async (val: boolean) => {
    setHostelNeeded(val);
    if (application?.id) {
        setProcessing(true);
        await supabase.from('applications').update({ hostel_needed: val }).eq('id', application.id);
        setProcessing(false);
    }
  };

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    const [feesRes, payRes] = await Promise.all([
      supabase.from('fees').select('*').order('name'),
      supabase.from('payments').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ]);

    if (feesRes.error) toast({ title: 'Error', description: feesRes.error.message, variant: 'destructive' });
    if (payRes.error) toast({ title: 'Error', description: payRes.error.message, variant: 'destructive' });

    setFees(feesRes.data || []);
    setPayments(payRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const paidFeeNames = useMemo(() => {
    const set = new Set<string>();
    for (const p of payments) {
      if (p.status !== 'success') continue;
      const t = p.metadata?.payment_type;
      if (typeof t === 'string' && t) set.add(t);
    }
    return set;
  }, [payments]);

  const feeLabel = (name: string) => {
    const labels: Record<string, string> = {
      form_fee: 'Registration Form Fee',
      acceptance_fee: 'Acceptance Fee',
      tuition_fee: 'Tuition Fee',
      hostel_fee: 'Hostel Fee',
    };
    return labels[name] || name;
  };

  const requiresAdmission = (name: string) => ['acceptance_fee', 'tuition_fee', 'hostel_fee'].includes(name);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Payment History</CardTitle>
          <CardDescription>Manage your application and programme fees.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="p-6 text-center text-muted-foreground">Loading payments...</div>
          ) : (
            <>
              {isAdmitted && (
                <div className="flex items-center space-x-2 mb-6 p-4 bg-muted/20 rounded-lg border">
                  <Switch
                    id="hostel-mode"
                    checked={hostelNeeded}
                    onCheckedChange={toggleHostel}
                    disabled={processing}
                  />
                  <Label htmlFor="hostel-mode" className="font-medium">I require Hostel Accommodation (Optional)</Label>
                </div>
              )}

              <div className="grid gap-4">
                {fees.map((fee) => {
                  const name = fee.name;
                  if (name === 'hostel_fee' && !hostelNeeded) return null;

                  const amount = Number(fee.amount) || 0;

                  // Determine status
                  let paid = false;
                  let isPartPaid = false;
                  let amountPaid = 0;

                  if (name === 'form_fee') {
                    paid = !!application?.form_fee_paid || optimisticPaid.has('form_fee');
                  } else if (name === 'tuition_fee') {
                    paid = application?.tuition_payment_status === 'fully_paid' || optimisticPaid.has('tuition_fee');
                    isPartPaid = !paid && application?.tuition_payment_status === 'part_paid';
                    amountPaid = Number(application?.tuition_amount_paid) || 0;
                  } else if (name === 'hostel_fee') {
                    paid = !!application?.hostel_fee_paid || optimisticPaid.has('hostel_fee');
                  } else {
                    paid = paidFeeNames.has(name) || optimisticPaid.has(name);
                  }

                  // Force form_fee to always be visible and actionable if not paid
                  // For other fees, require admission
                  const isFormFee = name === 'form_fee';
                  const blocked = !isFormFee && requiresAdmission(name) && !isAdmitted;
                  const notConfigured = amount <= 0;

                  // Installment logic
                  const showInstallment = name === 'tuition_fee' && application?.installments_allowed && !paid;
                  const balance = amount - amountPaid;

                  // If this is the form fee payment stage (application not admitted yet), hide other fees to avoid confusion
                  // unless they are already paid
                  if (!isAdmitted && !isFormFee && !paid) {
                    return null;
                  }

                  return (
                    <div key={fee.id} className="border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-lg">{feeLabel(name)}</h3>
                          {paid ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle size={12} className="mr-1" /> Paid
                            </Badge>
                          ) : isPartPaid ? (
                            <Badge className="bg-blue-100 text-blue-800">
                              <Clock size={12} className="mr-1" /> Part Paid
                            </Badge>
                          ) : (
                            <Badge className="bg-orange-100 text-orange-800">
                              <Clock size={12} className="mr-1" /> Pending
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{fee.description || '—'}</p>

                        <div className="text-xl font-bold">
                          {notConfigured ? '₦—' : `₦${amount.toLocaleString()}`}
                        </div>

                        {isPartPaid && (
                          <div className="text-sm mt-1">
                            <span className="text-green-600 font-medium">Paid: ₦{amountPaid.toLocaleString()}</span>
                            <span className="mx-2">|</span>
                            <span className="text-destructive font-medium">Balance: ₦{balance.toLocaleString()}</span>
                          </div>
                        )}

                        {blocked && (
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> Available after admission is approved.
                          </p>
                        )}
                      </div>

                      <div className="shrink-0 w-full md:w-auto space-y-2">
                        {paid ? (
                          <div className="text-sm text-green-700 bg-green-50 px-4 py-2 rounded-md border border-green-200 w-full text-center flex items-center justify-center">
                            <CheckCircle size={16} className="mr-2" /> Payment Confirmed
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2 w-full md:w-56">
                            {user && (
                              <>
                                <PaymentButton
                                  email={user.email || ''}
                                  amount={isPartPaid ? balance : amount}
                                  userId={user.id}
                                  applicationId={application?.id}
                                  paymentType={name}
                                  label={isPartPaid ? `Pay Balance (₦${balance.toLocaleString()})` : `Pay Now (₦${amount.toLocaleString()})`}
                                  disabled={blocked || notConfigured}
                                  onSuccess={async ({ paymentType }) => {
                                    // Mark paid immediately in local state so UI updates at once
                                    setOptimisticPaid(prev => new Set([...prev, paymentType]));
                                    await onFeePaymentSuccess(paymentType);
                                    await fetchData();
                                  }}
                                />

                                {showInstallment && !isPartPaid && (
                                  <PaymentButton
                                    email={user.email || ''}
                                    amount={amount / 2}
                                    userId={user.id}
                                    applicationId={application?.id}
                                    paymentType={name}
                                    label={`Pay Installment (₦${(amount / 2).toLocaleString()})`}
                                    disabled={blocked || notConfigured}
                                    variant="outline"
                                    onSuccess={async ({ paymentType }) => {
                                      await onFeePaymentSuccess(paymentType);
                                      await fetchData();
                                    }}
                                  />
                                )}

                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Transactions</h3>
                {payments.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No payments recorded yet.</div>
                ) : (
                  <div className="space-y-2">
                    {payments.slice(0, 10).map((p) => (
                      <div key={p.id} className="flex items-center justify-between border rounded-lg p-3 text-sm">
                        <div className="space-y-0.5">
                          <div className="font-medium">{feeLabel(p.metadata?.payment_type || 'payment')}</div>
                          <div className="text-xs text-muted-foreground">{p.reference}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">₦{Number(p.amount).toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

        </CardContent>
      </Card>
    </div>
  );
};
