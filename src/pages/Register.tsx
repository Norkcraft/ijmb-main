'use client';

import { useState } from 'react';
import Link from "next/link";
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Loader2 } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+234');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  if (user) {
    router.replace('/dashboard');
    return null;
  }

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const fullPhone = `${countryCode}${phone.replace(/^0+/, '')}`;

    // ── 1. Check phone uniqueness ─────────────────────────────────────────
    const { data: existingPhone } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone', fullPhone)
      .maybeSingle();

    if (existingPhone) {
      toast({
        title: 'Phone number already registered',
        description: 'An account with this phone number already exists. Please log in or use a different number.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    // ── 2. Sign up with Supabase Auth (handles email uniqueness) ──────────
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { full_name: fullName, phone: fullPhone },
      },
    });

    if (error) {
      const msg =
        error.message?.toLowerCase().includes('already registered') ||
        error.message?.toLowerCase().includes('already been registered')
          ? 'An account with this email already exists. Please log in instead.'
          : error.message;
      toast({ title: 'Registration failed', description: msg, variant: 'destructive' });
      setLoading(false);
      return;
    }

    // ── 3. Supabase silent duplicate — returns user with no identities ────
    if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
      toast({
        title: 'Email already registered',
        description: 'An account with this email already exists. Please log in instead.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    // ── 4. Create profile ─────────────────────────────────────────────────
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        phone: fullPhone,
        email,
      });

      // Send welcome email (fire-and-forget)
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'welcome',
          data: { fullName, email },
        }),
      }).catch(() => {});
    }

    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <>
        <SEOHead title="Check Your Email – IJMB Registration" description="Verify your email to complete IJMB registration." canonical="https://www.ijmb.info/verify-email" />
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Register' }, { label: 'Verify Email' }]} />
        <section className="section-padding min-h-[60vh] flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="text-primary" size={28} />
              </div>
              <CardTitle className="font-heading">Check Your Email</CardTitle>
              <CardDescription>We've sent a verification link to <strong>{email}</strong>. Click the link to verify your account, then log in.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/login">
                <Button variant="outline" className="mt-2">Go to Login</Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Register for IJMB – Create Account" description="Create your IJMB student account to begin your admission process." canonical="https://www.ijmb.info/register" />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Register' }]} />
      <section className="section-padding min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="text-primary" size={28} />
            </div>
            <CardTitle className="font-heading">Create Your Account</CardTitle>
            <CardDescription>Register to start your IJMB admission journey</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <select
                    className="flex h-10 w-24 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                  >
                    <option value="+234">🇳🇬 +234</option>
                    <option value="+233">🇬🇭 +233</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+1">🇺🇸 +1</option>
                  </select>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="8012345678"
                    className="flex-1"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" minLength={6} required />
              </div>
              <Button type="submit" className="w-full cta-gradient" disabled={loading}>
                {loading ? <><Loader2 className="animate-spin mr-2" size={16} /> Creating Account...</> : 'Create Account'}
              </Button>
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                <GoogleIcon />
                Continue with Google
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account? <Link href="/login" className="text-primary hover:underline">Login</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default Register;
