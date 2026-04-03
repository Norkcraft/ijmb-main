import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, Loader2 } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;

    const maybeExchangeCode = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      if (!code) return;
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!cancelled) {
        if (error) {
          toast({ title: 'Error', description: error.message, variant: 'destructive' });
          setReady(false);
        } else {
          setReady(true);
        }
      }
    };

    maybeExchangeCode();

    // Listen for PASSWORD_RECOVERY event from the hash fragment
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
      }
    });
    // Also check hash for type=recovery
    if (window.location.hash.includes('type=recovery')) {
      setReady(true);
    }
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Password updated successfully!' });
      await supabase.auth.signOut();
      navigate('/login');
    }
    setLoading(false);
  };

  if (!ready) {
    return (
      <>
        <SEOHead title="Reset Password – IJMB" description="Set a new password for your IJMB account." canonical="https://www.ijmb.info/reset-password" />
        <section className="section-padding min-h-[60vh] flex items-center justify-center">
          <Card className="w-full max-w-md text-center p-8">
            <p className="text-muted-foreground">Loading password reset...</p>
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mt-4" />
          </Card>
        </section>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Reset Password – IJMB" description="Set a new password for your IJMB account." canonical="https://www.ijmb.info/reset-password" />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Reset Password' }]} />
      <section className="section-padding min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="text-primary" size={28} />
            </div>
            <CardTitle className="font-heading">Set New Password</CardTitle>
            <CardDescription>Choose a new password for your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" minLength={6} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input id="confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" minLength={6} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <><Loader2 className="animate-spin mr-2" size={16} /> Updating...</> : 'Update Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default ResetPassword;
