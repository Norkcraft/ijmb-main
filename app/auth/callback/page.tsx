'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');

    const fallback = setTimeout(() => router.replace('/login'), 10000);

    const handleSession = async (userId: string) => {
      // Check if this user already has a profile
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('id', userId)
        .maybeSingle();

      clearTimeout(fallback);

      if (!profile) {
        // Check if registration metadata is available (email/password signup flow)
        const meta = user?.user_metadata;
        const fullName = meta?.full_name;
        const phone = meta?.phone;

        if (fullName && phone) {
          // Auto-create profile from registration data — no need to visit complete-profile
          await supabase.from('profiles').upsert({
            id: userId,
            full_name: fullName,
            phone: phone,
            email: user?.email,
            email_verified: true,
          });
          router.replace('/dashboard');
        } else {
          // OAuth or missing data — needs to complete their profile
          router.replace('/complete-profile');
        }
      } else {
        // Profile exists — mark email as verified
        await supabase.from('profiles').update({ email_verified: true }).eq('id', userId);
        if (profile.role === 'super_admin' || profile.role === 'coordinator') {
          router.replace('/portal-admin');
        } else {
          router.replace('/dashboard');
        }
      }
    };

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(async ({ data, error }) => {
        if (error || !data.user) {
          clearTimeout(fallback);
          router.replace('/login?error=verification_failed');
          return;
        }
        await handleSession(data.user.id);
      });
    } else {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session) {
          await handleSession(session.user.id);
          return;
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' && session) {
            subscription.unsubscribe();
            await handleSession(session.user.id);
          }
        });
      });
    }

    return () => clearTimeout(fallback);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        Signing you in…
      </div>
    </div>
  );
}
