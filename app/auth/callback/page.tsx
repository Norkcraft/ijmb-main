'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');

    // Safety net: redirect to dashboard after 10 seconds no matter what
    const fallback = setTimeout(() => router.replace('/dashboard'), 10000);

    if (code) {
      // PKCE flow: code is a query param
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        clearTimeout(fallback);
        router.replace(error ? '/login?error=verification_failed' : '/dashboard');
      });
    } else {
      // Implicit flow: check if session already exists first
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          clearTimeout(fallback);
          router.replace('/dashboard');
          return;
        }

        // Listen for auth state change
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
            clearTimeout(fallback);
            subscription.unsubscribe();
            router.replace('/dashboard');
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
        Verifying your email…
      </div>
    </div>
  );
}
