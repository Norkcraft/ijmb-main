'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Loader2, AlertTriangle } from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+234', flag: '🇳🇬' },
  { code: '+233', flag: '🇬🇭' },
  { code: '+44', flag: '🇬🇧' },
  { code: '+1', flag: '🇺🇸' },
];

const CompleteProfile = () => {
  const { user, profile, loading, refreshProfile, signOut } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+234');
  const [submitting, setSubmitting] = useState(false);
  const [emailConflict, setEmailConflict] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/register');
      return;
    }
    if (profile) {
      router.replace('/dashboard');
      return;
    }
    // Pre-fill name from OAuth provider metadata
    const name = user.user_metadata?.full_name || user.user_metadata?.name || '';
    setFullName(name);
  }, [user, profile, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const fullPhone = `${countryCode}${phone.replace(/^0+/, '')}`;

      // Check if this email is already registered to a different account
      const { data: existingEmail } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', user!.email)
        .maybeSingle();

      if (existingEmail && existingEmail.id !== user!.id) {
        // Email belongs to a different account — sign out this Google session
        // and tell the user to log in with their original account
        setEmailConflict(true);
        await signOut();
        setSubmitting(false);
        return;
      }

      // Check phone uniqueness
      const { data: existingPhone } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', fullPhone)
        .maybeSingle();

      if (existingPhone) {
        toast({
          title: 'Phone already in use',
          description: 'An account with this phone number already exists. Please use a different number.',
          variant: 'destructive',
        });
        setSubmitting(false);
        return;
      }

      const { error } = await supabase.from('profiles').upsert({
        id: user!.id,
        full_name: fullName,
        phone: fullPhone,
        email: user!.email,
      });

      if (error) {
        // Catch email unique constraint violation as a fallback
        if (error.message?.includes('email') && error.message?.includes('unique')) {
          setEmailConflict(true);
          await signOut();
          setSubmitting(false);
          return;
        }
        toast({ title: 'Failed to save profile', description: error.message, variant: 'destructive' });
        setSubmitting(false);
        return;
      }

      await refreshProfile();
      router.push('/dashboard');
    } catch {
      toast({ title: 'Something went wrong', description: 'Please try again or log in with your email and password.', variant: 'destructive' });
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Email already registered — show a clear message instead of crashing
  if (emailConflict) {
    return (
      <section className="section-padding min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-amber-600" size={28} />
            </div>
            <CardTitle className="font-heading">Account Already Exists</CardTitle>
            <CardDescription>
              An account with this email address already exists. You registered previously with email and password.
              Please log in with your email and password instead.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/login">
              <Button className="w-full cta-gradient">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!user || profile) return null;

  return (
    <section className="section-padding min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-primary" size={28} />
          </div>
          <CardTitle className="font-heading">Complete Your Profile</CardTitle>
          <CardDescription>Just a few more details to finish setting up your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <select
                  className="flex h-10 w-24 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  {COUNTRY_CODES.map(({ code, flag }) => (
                    <option key={code} value={code}>{flag} {code}</option>
                  ))}
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
            <Button type="submit" className="w-full cta-gradient" disabled={submitting}>
              {submitting ? <><Loader2 className="animate-spin mr-2" size={16} /> Saving...</> : 'Save & Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default CompleteProfile;
