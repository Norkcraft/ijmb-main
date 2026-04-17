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
import { UserPlus, Loader2, AlertTriangle, LogOut } from 'lucide-react';

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
  const [signingOut, setSigningOut] = useState(false);
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

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    router.replace('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const fullPhone = `${countryCode}${phone.replace(/^0+/, '')}`;

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
        if (error.message?.includes('email') || error.message?.includes('unique')) {
          setEmailConflict(true);
          setSubmitting(false);
          return;
        }
        toast({ title: 'Failed to save profile', description: error.message, variant: 'destructive' });
        setSubmitting(false);
        return;
      }

      // Verify the profile was actually saved before navigating
      const { data: savedProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user!.id)
        .maybeSingle();

      if (!savedProfile) {
        toast({ title: 'Something went wrong', description: 'Profile could not be saved. Please try again.', variant: 'destructive' });
        setSubmitting(false);
        return;
      }

      await refreshProfile();
      router.push('/dashboard');
    } catch {
      toast({ title: 'Something went wrong', description: 'Please try again or sign out and log in with email and password.', variant: 'destructive' });
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

  // Email already belongs to a different account
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
              You already have an account with this email address registered using email and password.
              Please sign out and log in with your email and password instead.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {signingOut ? <><Loader2 size={15} className="animate-spin" /> Signing Out...</> : <><LogOut size={15} /> Sign Out & Go to Login</>}
            </button>
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

          {/* Always-visible escape hatch */}
          <div className="mt-4 pt-4 border-t">
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors disabled:opacity-60"
            >
              {signingOut ? <><Loader2 size={13} className="animate-spin" /> Signing Out...</> : <><LogOut size={13} /> Sign out and use a different account</>}
            </button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default CompleteProfile;
