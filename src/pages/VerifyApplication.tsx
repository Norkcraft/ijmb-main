'use client';

import { useEffect, useState } from 'react';
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from '@/lib/supabaseClient';
import { CheckCircle2, XCircle, Loader2, ShieldCheck, Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/SEOHead';
const logo = '/ijmb-logo.jpeg';

const VerifyApplication = () => {
  const params = useParams(); const applicationId = params?.applicationId as string;
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!applicationId) {
        setError("Invalid application ID");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('applications')
          .select(`
            id,
            application_number,
            surname,
            first_name,
            middle_name,
            created_at,
            intended_course,
            status,
            centres (
              name,
              state
            )
          `)
          .eq('id', applicationId)
          .single();

        if (error) throw error;
        setApplication(data);
      } catch (err) {
        console.error('Verification error:', err);
        setError("Application record not found or invalid.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Verifying application record...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <>
        <SEOHead title="Verification Failed - IJMB" noindex />
        <div className="min-h-screen bg-muted/20 flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-lg border-destructive/20">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-destructive/10 p-4 rounded-full mb-4 w-fit">
                <XCircle className="h-12 w-12 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold text-destructive">Verification Failed</h1>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-muted-foreground">
                {error || "The application record you are looking for does not exist or has been removed."}
              </p>
              <div className="pt-4 border-t">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" /> Return Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const fullName = `${application.surname} ${application.first_name} ${application.middle_name || ''}`.trim();
  const displayId = application.application_number || application.id.split('-')[0].toUpperCase();
  const centreName = application.centres ? `${application.centres.name}, ${application.centres.state}` : 'Not Assigned';

  return (
    <>
      <SEOHead title={`Verify Application: ${fullName}`} noindex />
      <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">

        {/* Verification Card */}
        <Card className="max-w-lg w-full shadow-xl border-t-4 border-t-green-600 overflow-hidden">
          {/* Header */}
          <div className="bg-white p-6 pb-0 text-center">
            <img src={logo} alt="IJMB Logo" className="h-16 w-16 mx-auto mb-4 object-contain" />
            <h2 className="text-sm font-bold text-muted-foreground tracking-widest uppercase mb-1">Official Verification</h2>
            <h1 className="text-2xl font-bold text-green-700 flex items-center justify-center gap-2">
              <CheckCircle2 className="h-6 w-6" /> Application Verified
            </h1>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Status Badge */}
            <div className="flex justify-center">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-4 py-1 text-sm border-green-200">
                <ShieldCheck className="w-3 h-3 mr-1" /> VALID RECORD
              </Badge>
            </div>

            {/* Details Grid */}
            <div className="bg-muted/30 rounded-lg border p-5 space-y-4">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-muted-foreground col-span-1">Student Name:</span>
                <span className="font-semibold col-span-2 text-foreground">{fullName}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-muted-foreground col-span-1">Application ID:</span>
                <span className="font-mono font-medium col-span-2 text-primary">{displayId}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-muted-foreground col-span-1">Course:</span>
                <span className="font-medium col-span-2">{application.intended_course || 'Not Specified'}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-muted-foreground col-span-1">Centre:</span>
                <span className="font-medium col-span-2">{centreName}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-muted-foreground col-span-1">Reg. Date:</span>
                <span className="font-medium col-span-2">
                  {new Date(application.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Footer Note */}
            <div className="text-center pt-4 border-t">
              <p className="text-xs text-muted-foreground italic">
                This record is from the official IJMB application system.
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Generated on {new Date().toLocaleString()}
              </p>
            </div>

            <Button asChild variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-primary">
              <Link href="/">
                &larr; Go to Official Website
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default VerifyApplication;
