import type { Metadata } from 'next';
import { Suspense } from 'react';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminRoute from '@/components/AdminRoute';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin Dashboard – IJMB Portal',
  robots: { index: false },
};

export default function AdminDashboardPage() {
  return (
    <Suspense>
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    </Suspense>
  );
}
