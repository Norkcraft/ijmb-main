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

      // Notify admin of new registration (fire-and-forget)
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'admin_new_registration',
          data: { fullName, email, phone: fullPhone },
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
