'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');

    if (code) {
      // PKCE flow: code is a query param
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        router.replace(error ? '/login?error=verification_failed' : '/dashboard');
      });
    } else {
      // Implicit flow: tokens are in the URL hash (#access_token=...).
      // Supabase client auto-detects the hash — listen for the sign-in event.
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          subscription.unsubscribe();
          router.replace('/dashboard');
        }
      });

      // Also check if a session already exists (already verified)
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) router.replace('/dashboard');
      });

      return () => subscription.unsubscribe();
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        Verifying your email…
      </div>
    </div>
  );
}
