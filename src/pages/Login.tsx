'use client';

import { useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Lock, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, profile } = useAuth();

  if (user) {
    const isAdmin = profile?.role === 'super_admin' || profile?.role === 'coordinator';
    router.replace(isAdmin ? '/portal-admin' : '/dashboard');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
      setLoading(false);
      return;
    }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profileData?.role === 'super_admin' || profileData?.role === 'coordinator') {
      router.push('/portal-admin');
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <>
      <SEOHead title="IJMB Student Login" description="Login to your IJMB student portal to manage your application." canonical="https://www.ijmb.info/login" />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Login' }]} />
      <section className="section-padding min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-primary" size={28} />
            </div>
            <CardTitle className="font-heading">Student Login</CardTitle>
            <CardDescription>Access your IJMB application portal</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
              <Button type="submit" className="w-full cta-gradient" disabled={loading}>
                {loading ? <><Loader2 className="animate-spin mr-2" size={16} /> Signing In...</> : 'Sign In'}
              </Button>
              <div className="flex justify-between text-sm">
                <Link href="/forgot-password" className="text-primary hover:underline">Forgot Password?</Link>
                <Link href="/register" className="text-primary hover:underline">Create Account</Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default Login;
