import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MailCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const VerifyEmail = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    if (!user?.email) return;
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
      options: { emailRedirectTo: window.location.origin }
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Email Sent", description: "Verification link resent successfully." });
    }
    setResending(false);
  };

  return (
    <>
      <SEOHead title="Verify Your Email – IJMB" description="Check your email to verify your IJMB account." canonical="https://www.ijmb.info/verify-email" />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Verify Email' }]} />
      <section className="section-padding min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MailCheck className="text-primary" size={28} />
            </div>
            <CardTitle className="font-heading">Verify Your Email</CardTitle>
            <CardDescription>
              {user 
                ? `You need to verify your email address (${user.email}) to access the dashboard.` 
                : "We've sent a verification link to your email address. Click the link to verify your account."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user && (
              <Button onClick={handleResend} variant="outline" disabled={resending} className="w-full">
                {resending ? "Sending..." : "Resend Verification Email"}
              </Button>
            )}
            
            <div className="flex justify-center">
               {user ? (
                 <Button variant="ghost" onClick={() => supabase.auth.signOut()}>Logout</Button>
               ) : (
                 <Link to="/login"><Button>Go to Login</Button></Link>
               )}
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default VerifyEmail;