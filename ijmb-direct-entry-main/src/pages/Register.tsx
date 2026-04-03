import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName, phone },
      },
    });

    if (error) {
      toast({ title: 'Registration failed', description: error.message, variant: 'destructive' });
      setLoading(false);
      return;
    }

    // Create profile row (role stored separately per security architecture)
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        phone,
      });
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
              <Link to="/login">
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
                <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="08012345678" required />
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
                Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default Register;
