'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import SEOHead from '@/components/SEOHead';
import { useSearchParams } from "next/navigation";
import AdminDashboardOverview from '@/components/admin/AdminDashboardOverview';
import AdminApplications from '@/components/admin/AdminApplications';
import AdminCentres from '@/components/admin/AdminCentres';
import AdminSubjects from '@/components/admin/AdminSubjects';
import AdminSessions from '@/components/admin/AdminSessions';
import AdminPayments from '@/components/admin/AdminPayments';
import AdminFees from '@/components/admin/AdminFees';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminMobileHeader } from '@/components/admin/AdminMobileHeader';

const AdminDashboard = () => {
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get('tab') || 'overview';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newNotifications, setNewNotifications] = useState(false);

  useEffect(() => {
    // Listen for new payments in real-time
    const channel = supabase
      .channel('admin-dashboard-payments')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'payments' },
        (payload) => {
          const payment = payload.new;
          toast({
            title: "New Payment Received!",
            description: `Amount: ₦${payment.amount?.toLocaleString()}`,
            duration: 10000,
          });
          setNewNotifications(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // Reset notification when viewing payments
  useEffect(() => {
    if (currentTab === 'payments') {
        setNewNotifications(false);
    }
  }, [currentTab]);

  return (
    <>
      <SEOHead title="Admin Dashboard – IJMB Portal" description="IJMB admin dashboard for managing applications." canonical="https://www.ijmb.info/portal-admin" />

      <div className="flex h-screen bg-muted/20">
        {/* Sidebar (Desktop) */}
        <AdminSidebar
            user={user}
            signOut={signOut}
            newNotifications={newNotifications}
        />

        {/* Mobile Header & Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminMobileHeader
             isMobileMenuOpen={isMobileMenuOpen}
             setIsMobileMenuOpen={setIsMobileMenuOpen}
             signOut={signOut}
             newNotifications={newNotifications}
          />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-heading font-bold text-foreground capitalize">
                  {currentTab}
                </h1>
                <p className="text-muted-foreground text-sm">Manage your platform settings and data.</p>
              </div>

              <div className="bg-card rounded-xl border shadow-sm p-1">
                {currentTab === 'overview' && <AdminDashboardOverview />}
                {currentTab === 'applications' && <AdminApplications />}
                {currentTab === 'payments' && <AdminPayments />}
                {currentTab === 'centres' && <AdminCentres />}
                {currentTab === 'subjects' && <AdminSubjects />}
                {currentTab === 'sessions' && <AdminSessions />}
                {currentTab === 'fees' && <AdminFees />}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
