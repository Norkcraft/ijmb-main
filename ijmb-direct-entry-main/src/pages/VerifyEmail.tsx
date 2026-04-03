import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MailCheck } from 'lucide-react';

const VerifyEmail = () => (
  <>
    <SEOHead title="Verify Your Email – IJMB" description="Check your email to verify your IJMB account." canonical="https://www.ijmb.info/verify-email" />
    <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Verify Email' }]} />
    <section className="section-padding min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MailCheck className="text-primary" size={28} />
          </div>
          <CardTitle className="font-heading">Check Your Email</CardTitle>
          <CardDescription>We've sent a verification link to your email address. Click the link to verify your account and then log in.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/login"><Button>Go to Login</Button></Link>
        </CardContent>
      </Card>
    </section>
  </>
);

export default VerifyEmail;
