import type { Metadata } from 'next';
import { Suspense } from 'react';
import Dashboard from '@/pages/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My Dashboard – IJMB Portal',
  description: 'Manage your IJMB application, upload documents, and track your admission status.',
  robots: { index: false },
};

export default function DashboardPage() {
  return (
    <Suspense>
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    </Suspense>
  );
}
