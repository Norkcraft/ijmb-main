import AdminApplicationDetail from '@/pages/AdminApplicationDetail';
import AdminRoute from '@/components/AdminRoute';

export const dynamic = 'force-dynamic';

export default function AdminApplicationDetailPage() {
  return (
    <AdminRoute>
      <AdminApplicationDetail />
    </AdminRoute>
  );
}
