'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (!user.email_confirmed_at && !user.app_metadata?.provider?.includes('google')) {
      // If email not confirmed (and not a social login which usually auto-confirms), redirect
      router.push('/verify-email');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  if (!user.email_confirmed_at && !user.app_metadata?.provider?.includes('google')) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
