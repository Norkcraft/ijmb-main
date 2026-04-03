
import { Loader2, Download, Eye, Printer, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { useStudentDashboard } from '@/hooks/useStudentDashboard';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardPrintView } from '@/components/dashboard/DashboardPrintView';
import { DashboardPayments } from '@/components/dashboard/DashboardPayments';
import { ApplicationForm } from '@/components/application/ApplicationForm';
import { useSearchParams } from 'react-router-dom';

const Dashboard = () => {
  const {
    user,
    profile,
    application,
    olevelResults,
    sessions,
    centres,
    combos,
    formFee,
    loading,
    saving,
    uploading,
    saveApplication,
    handleFileUpload,
    handlePaymentSuccess,
    fetchData
  } = useStudentDashboard();

  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'dashboard';

  // Step calculation
  const formFeePaid = application?.form_fee_paid || false;
  
  const isAdmitted = application && ['admitted', 'fees_pending', 'active'].includes(application.status);
  const hasPaidAcceptanceFee = application && ['fees_pending', 'active'].includes(application.status);
  const hasAdmissionLetter = isAdmitted && application?.admission_letter_path;
  const isPaymentPending = application?.status === 'payment_pending';
  const isDraft = !application || application.status === 'draft' || !application.status;

  const formFeeDisplay = `₦${formFee.toLocaleString()}`;

  const downloadAdmissionLetter = async () => {
    if (!application?.admission_letter_path) return;
    const { data } = await supabase.storage.from('student-documents').createSignedUrl(application.admission_letter_path, 300);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank');
  };

  const handleDownloadApplicationForm = async (action: 'download' | 'preview' | 'print') => {
    if (application?.application_form_url) {
      if (action === 'print') {
        // Open in new tab and trigger print
        const printWindow = window.open(application.application_form_url, '_blank');
        printWindow?.addEventListener('load', () => {
          printWindow.print();
        });
      } else {
         window.open(application.application_form_url, action === 'preview' ? '_blank' : '_self');
      }
    } else if (application?.id) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        const response = await fetch(`/api/application/${application.id}/download`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          
          if (action === 'download') {
            const a = document.createElement('a');
            a.href = url;
            a.download = `IJMB-Application-${application.application_number || application.id.substring(0,8)}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          } else {
             const newWindow = window.open(url, '_blank');
             if (action === 'print' && newWindow) {
                newWindow.addEventListener('load', () => newWindow.print());
             }
          }
          
          // Cleanup
          setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        } else {
          // If 404 or other error, fallback to browser print
          console.warn('PDF not found via API, falling back to browser print');
          window.print();
        }
      } catch (err) {
        console.error('Error handling PDF:', err);
        window.print();
      }
    } else {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // 1. Application Form Stage
  if (isDraft) {
    return (
      <>
        <SEOHead title="Complete Application – IJMB" description="Complete your IJMB application." />
        <div className="min-h-screen bg-muted/20 pb-20">
          <DashboardHeader profile={profile} user={user} signOut={async () => await supabase.auth.signOut()} />
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Complete Your IJMB Application</h1>
              <p className="text-muted-foreground">Please fill in all required information to proceed with your application.</p>
            </div>
            <ApplicationForm 
              application={application}
              initialOlevels={olevelResults}
              user={user}
              sessions={sessions}
              centres={centres}
              combos={combos}
              onSave={saveApplication}
              onFileUpload={handleFileUpload}
              uploading={uploading}
            />
          </main>
        </div>
      </>
    );
  }

  // 2. Payment Stage (Form Fee)
  if (isPaymentPending && !formFeePaid) {
    return (
      <>
        <SEOHead title="Payment – IJMB" description="Pay your IJMB registration fee." />
        <div className="min-h-screen bg-muted/20 pb-20">
          <DashboardHeader profile={profile} user={user} signOut={async () => await supabase.auth.signOut()} />
          <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
             <div className="text-center space-y-2 mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Application Submitted Successfully</h1>
              <p className="text-muted-foreground">Please pay the registration form fee to complete the process and send your application for review.</p>
            </div>
            <DashboardPayments 
              user={user}
              application={application}
              onFeePaymentSuccess={async (feeName) => {
                if (feeName === 'form_fee') {
                  await handlePaymentSuccess();
                }
              }}
            />
          </main>
        </div>
      </>
    );
  }

  // 3. Submitted Dashboard Stage
  if (currentTab === 'payments') {
    return (
      <>
        <SEOHead title="Payments – IJMB" description="Pay your IJMB fees." />
        <div className="min-h-screen bg-muted/20 pb-20">
          <DashboardHeader profile={profile} user={user} signOut={async () => await supabase.auth.signOut()} />
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="flex items-center gap-4 mb-6">
               <Button variant="ghost" onClick={() => window.location.href = '/dashboard'}>
                 &larr; Back to Dashboard
               </Button>
               <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
            </div>
            
            <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
               <h3 className="font-semibold mb-1 flex items-center gap-2">
                 <Loader2 size={16} /> Payment Instructions
               </h3>
               <p className="text-sm">
                 After your admission is granted, you will be required to pay the Acceptance Fee to download your admission letter. 
                 Subsequent payments (Tuition, Hostel) will be enabled after acceptance.
               </p>
            </div>

            <DashboardPayments 
              user={user}
              application={application}
              onFeePaymentSuccess={async (feeName) => {
                if (feeName === 'form_fee') {
                  await handlePaymentSuccess();
                } else if (application?.id) {
                  if (feeName === 'acceptance_fee' && application.status === 'admitted') {
                    await supabase.from('applications').update({
                      status: 'fees_pending',
                      updated_at: new Date().toISOString(),
                    }).eq('id', application.id);
                  }
                  if (feeName === 'tuition_fee' && ['admitted', 'fees_pending'].includes(application.status)) {
                    await supabase.from('applications').update({
                      status: 'active',
                      updated_at: new Date().toISOString(),
                    }).eq('id', application.id);
                  }
                }
                await fetchData();
              }}
            />
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Student Dashboard – IJMB" description="Manage your IJMB application." canonical="https://www.ijmb.info/dashboard" />
      
      {/* Print-only section for PDF generation */}
      <DashboardPrintView 
        application={application}
        profile={profile}
        user={user}
        sessions={sessions}
        centres={centres}
        combos={combos}
        olevelResults={olevelResults}
        formFee={formFee}
      />

      <div className="min-h-screen bg-muted/20 pb-20 print:hidden">
        <DashboardHeader profile={profile} user={user} signOut={async () => await supabase.auth.signOut()} />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Application Status</h3>
                  <div className="font-medium text-lg capitalize">{application?.status === 'submitted' ? 'Submitted' : application?.status}</div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Payment Status</h3>
                  <div className="font-medium text-lg text-green-600">Paid</div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Review Status</h3>
                  <div className="font-medium text-lg">
                    {application?.status === 'submitted' ? 'Under Review' : 
                     application?.status === 'review' ? 'Under Review' : 
                     application?.status === 'admitted' ? 'Approved' : 
                     application?.status === 'rejected' ? 'Rejected' : 'Under Review'}
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  {isAdmitted && !hasPaidAcceptanceFee && (
                    <Button className="w-full justify-start" onClick={() => window.location.href = '?tab=payments'}>
                      Pay Acceptance Fee
                    </Button>
                  )}
                  {isAdmitted && hasPaidAcceptanceFee && (
                    <Button className="w-full justify-start" onClick={downloadAdmissionLetter}>
                      Download Admission Letter
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-bold mb-4">Application Details</h2>
                
                {!isAdmitted && application?.status !== 'rejected' && (
                  <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
                    <p>Your application is currently under review. You will be notified once a decision has been made.</p>
                  </div>
                )}
                
                {isAdmitted && !hasPaidAcceptanceFee && (
                  <div className="mb-6 p-4 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-200">
                    <h3 className="font-bold text-lg mb-1">Admission Approved!</h3>
                    <p>Congratulations! You have been offered admission. Please pay your acceptance fee to unlock your admission letter.</p>
                  </div>
                )}

                {isAdmitted && hasPaidAcceptanceFee && (
                  <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-md border border-green-200">
                    <h3 className="font-bold text-lg mb-1">Congratulations!</h3>
                    <p>Your admission is fully confirmed. You can now download your admission letter.</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground block">Full Name</span>
                      <span className="font-medium">{application?.surname} {application?.first_name} {application?.middle_name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Application ID</span>
                      <span className="font-medium">{application?.id?.split('-')[0].toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Preferred Centre</span>
                      <span className="font-medium">{centres.find(c => c.id === application?.preferred_centre_id)?.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Course of Choice</span>
                      <span className="font-medium">{application?.intended_course}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Documents Section */}
              {formFeePaid && (
                <div className="bg-white p-6 rounded-lg shadow-sm border mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="text-primary" />
                    <h2 className="text-xl font-bold">Application Documents</h2>
                  </div>
                  
                  <div className="border rounded-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-base">Your Application Form</h3>
                      <p className="text-sm text-muted-foreground">ID: {application?.application_number || application?.id?.split('-')[0].toUpperCase()}</p>
                    </div>
                    
                    {!application?.application_form_url ? (
                       <div className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded border border-amber-100 flex items-center gap-2">
                         <Loader2 className="animate-spin h-4 w-4" />
                         Your form is being generated, please check back shortly.
                       </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <Button variant="outline" size="sm" onClick={() => handleDownloadApplicationForm('preview')} className="flex-1 sm:flex-none">
                          <Eye className="mr-2 h-4 w-4" /> Preview
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDownloadApplicationForm('print')} className="flex-1 sm:flex-none">
                          <Printer className="mr-2 h-4 w-4" /> Print
                        </Button>
                        <Button size="sm" onClick={() => handleDownloadApplicationForm('download')} className="flex-1 sm:flex-none w-full sm:w-auto mt-2 sm:mt-0">
                          <Download className="mr-2 h-4 w-4" /> Download PDF
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
