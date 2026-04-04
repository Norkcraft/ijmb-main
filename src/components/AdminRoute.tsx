'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const isAdmin = ['super_admin', 'coordinator'].includes(profile?.role || '');

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/admin-login');
      return;
    }
    if (!isAdmin) {
      router.push('/admin-login');
    }
  }, [user, profile, loading, router, isAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return <>{children}</>;
};

export default AdminRoute;
