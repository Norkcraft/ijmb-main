'use client';

import { useState } from 'react';
import Link from "next/link";
import { supabase } from '@/lib/supabaseClient';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Loader2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <>
      <SEOHead title="Forgot Password – IJMB" description="Reset your IJMB account password." canonical="https://www.ijmb.info/forgot-password" />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Forgot Password' }]} />
      <section className="section-padding min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-primary" size={28} />
            </div>
            <CardTitle className="font-heading">Forgot Password</CardTitle>
            <CardDescription>{sent ? 'Check your email for the reset link.' : 'Enter your email to receive a password reset link.'}</CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-center">
                <p className="text-muted-foreground mb-4">We sent a reset link to <strong>{email}</strong></p>
                <Link href="/login"><Button variant="outline">Back to Login</Button></Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <><Loader2 className="animate-spin mr-2" size={16} /> Sending...</> : 'Send Reset Link'}
                </Button>
                <p className="text-center text-sm"><Link href="/login" className="text-primary hover:underline">Back to Login</Link></p>
              </form>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default ForgotPassword;
