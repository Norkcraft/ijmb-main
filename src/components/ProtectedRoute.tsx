'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    const provider = user.app_metadata?.provider;
    const emailVerified = !!user.email_confirmed_at || provider === 'google' || provider === 'phone';
    if (!emailVerified) {
      router.push('/verify-email');
      return;
    }
    // Only redirect to complete-profile if not already there — prevents redirect loop
    if (!profile && pathname !== '/complete-profile') {
      router.push('/complete-profile');
    }
  }, [user, profile, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const provider = user.app_metadata?.provider;
  const emailVerified = !!user.email_confirmed_at || provider === 'google' || provider === 'phone';

  if (!emailVerified) return null;
  if (!profile) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
