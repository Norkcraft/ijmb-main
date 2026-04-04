'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, CreditCard, Download, FileText, Printer, Building, Banknote } from 'lucide-react';
import dynamic from 'next/dynamic';
const PaymentButton = dynamic(() => import('@/components/PaymentButton'), { ssr: false });
const DownloadApplicationPDF = dynamic(() => import('./DownloadApplicationPDF'), { ssr: false });
import { Separator } from '@/components/ui/separator';

interface DashboardMainProps {
  user: any;
  application: any;
  sessions: any[];
  centres: any[];
  combos: any[];
  olevelResults: any[];
  formFee: number;
  formFeePaid: boolean;
  appSubmitted: boolean;
  progressPercent: number;
  onSave: (data: any, submit?: boolean) => void;
  onPaymentSuccess: () => void;
}

export const DashboardMain = ({
  user,
  application,
  sessions,
  centres,
  combos,
  olevelResults,
  formFee,
  formFeePaid,
  appSubmitted,
  progressPercent,
  onSave,
  onPaymentSuccess
}: DashboardMainProps) => {
  const formFeeDisplay = `₦${formFee.toLocaleString()}`;
  const isAdmitted = application && ['admitted', 'fees_pending', 'active'].includes(application.status);

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md bg-gradient-to-br from-primary/90 to-primary text-primary-foreground overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <CardContent className="p-8 relative z-10">
          <h2 className="text-3xl font-heading font-bold mb-2">
            {isAdmitted ? "Congratulations!" : "Welcome back!"}
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-md">
            {isAdmitted
              ? "Your admission has been approved. Please follow the steps below to complete your clearance."
              : "Complete your application to secure your admission into the IJMB programme."}
          </p>

          <div className="bg-black/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex justify-between text-sm mb-2 font-medium">
              <span>Application Progress</span>
              <span>{isAdmitted ? 100 : progressPercent}%</span>
            </div>
            <Progress value={isAdmitted ? 100 : progressPercent} className="h-3 bg-white/20" />
          </div>
        </CardContent>
      </Card>

      {/* ADMISSION APPROVED: NEXT STEPS */}
      {isAdmitted && (
        <Card className="border-l-4 border-l-green-600 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-700 rounded-full">
                <CheckCircle size={24} />
              </div>
              <div>
                <CardTitle className="text-xl text-green-800">Admission Approved</CardTitle>
                <CardDescription>Your next steps for clearance and resumption.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50/50 p-4 rounded-lg border border-green-100">
               <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                 <Building size={18} /> Assigned Study Centre
               </h3>
               <div className="pl-6 space-y-1 text-sm text-green-800">
                  <p><span className="font-medium">Centre Name:</span> {centres.find(c => c.id === application?.preferred_centre_id)?.name || 'Main Campus'}</p>
                  <p><span className="font-medium">Location:</span> {centres.find(c => c.id === application?.preferred_centre_id)?.state || 'Lagos'}</p>
                  <p><span className="font-medium">Address:</span> {centres.find(c => c.id === application?.preferred_centre_id)?.address || 'No. 15, University Road'}</p>
               </div>
            </div>

            <Separator />

            <div className="space-y-4">
               <h3 className="font-semibold flex items-center gap-2">
                 <Banknote size={18} /> Clearance & Payment Steps
               </h3>
               <div className="grid gap-4 md:grid-cols-2">
                  <div className="border rounded-lg p-4 bg-muted/10">
                     <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold mb-2">1</span>
                     <h4 className="font-medium mb-1">Print Admission Letter</h4>
                     <p className="text-xs text-muted-foreground">Download and print your provisional admission letter from the sidebar.</p>
                  </div>
                  <div className="border rounded-lg p-4 bg-muted/10">
                     <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold mb-2">2</span>
                     <h4 className="font-medium mb-1">Pay Acceptance Fee</h4>
                     <p className="text-xs text-muted-foreground">Proceed to your study centre to pay the acceptance fee of ₦20,000.</p>
                  </div>
                  <div className="border rounded-lg p-4 bg-muted/10">
                     <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold mb-2">3</span>
                     <h4 className="font-medium mb-1">Physical Screening</h4>
                     <p className="text-xs text-muted-foreground">Present your printed slip, O-Level results, and passport at the centre.</p>
                  </div>
                  <div className="border rounded-lg p-4 bg-muted/10">
                     <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold mb-2">4</span>
                     <h4 className="font-medium mb-1">Tuition Payment</h4>
                     <p className="text-xs text-muted-foreground">Pay at least 50% of your tuition fee to collect textbooks and ID card.</p>
                  </div>
               </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3">
               <div className="text-blue-600 mt-1"><FileText size={18} /></div>
               <div className="text-sm text-blue-800">
                  <p className="font-semibold">Note:</p>
                  <p>All payments (Tuition & Acceptance) should be made directly at the study centre or via the official bank account provided on your admission letter. Do not pay to personal accounts.</p>
               </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Cards Grid */}
      <div className="grid gap-6">
        {/* 1. Payment Card */}
        <Card className={`transition-all duration-300 border-l-4 ${formFeePaid ? 'border-l-green-500' : 'border-l-orange-500 shadow-lg'}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${formFeePaid ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                  <CreditCard size={24} />
                </div>
                <div>
                   <CardTitle className="text-lg">Form Fee Payment</CardTitle>
                   <CardDescription>Required to process application</CardDescription>
                </div>
              </div>
              {formFeePaid && <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            {formFeePaid ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg border border-green-100">
                  <p className="text-sm text-green-700 flex items-center gap-2 font-medium"><CheckCircle size={16} /> Payment confirmed</p>
                  <Button variant="outline" size="sm" onClick={() => window.print()}>
                    <Printer size={14} className="mr-2" /> Receipt
                  </Button>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                        <Download size={18} /> Your Application Form
                    </h3>
                    <p className="text-sm text-blue-800">
                        Download your personalised IJMB application form with all your details pre-filled. Print and present it at your study centre.
                    </p>
                    {application?.id && (
                      <DownloadApplicationPDF applicationId={application.id} />
                    )}
                    <div className="text-xs text-blue-800 mt-2 space-y-1">
                        <p><strong>Instructions:</strong></p>
                        <ol className="list-decimal pl-4 space-y-1">
                            <li>Click the button above — your form opens in a new window.</li>
                            <li>Use <strong>File → Print → Save as PDF</strong> (or press Ctrl+P).</li>
                            <li>Print on A4 paper and sign the declaration section.</li>
                            <li>Present at your study centre for final documentation.</li>
                        </ol>
                    </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-accent/10 p-4 rounded-lg border border-accent/20">
                  <span className="text-sm font-medium text-muted-foreground">Amount Due</span>
                  <span className="text-2xl font-bold text-primary">{formFeeDisplay}</span>
                </div>
                {user && (
                  <PaymentButton
                    email={user.email || ''}
                    amount={formFee}
                    userId={user.id}
                    applicationId={application?.id}
                    paymentType="form_fee"
                    onSuccess={async () => onPaymentSuccess()}
                  />
                )}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
