'use client';

import { Button } from "@/components/ui/button";
import { Menu, LogOut, LayoutDashboard, CreditCard, MapPin, BookOpen, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/portal-admin", id: 'overview' },
  { icon: CreditCard, label: "Payments", href: "/portal-admin?tab=payments", id: 'payments' },
  { icon: MapPin, label: "Centres", href: "/portal-admin?tab=centres", id: 'centres' },
  { icon: BookOpen, label: "Subjects", href: "/portal-admin?tab=subjects", id: 'subjects' },
  { icon: Calendar, label: "Sessions", href: "/portal-admin?tab=sessions", id: 'sessions' },
  { icon: DollarSign, label: "Fees", href: "/portal-admin?tab=fees", id: 'fees' },
];

interface AdminMobileHeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  signOut: () => void;
  newNotifications?: boolean;
}

export const AdminMobileHeader = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  signOut,
  newNotifications
}: AdminMobileHeaderProps) => {
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get('tab') || 'overview';

  return (
    <>
      <header className="lg:hidden bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">A</div>
          <span className="font-heading font-bold text-lg">IJMB Admin</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu size={24} />
        </Button>
      </header>

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute inset-0 z-50 bg-background border-b shadow-lg p-4 space-y-2 h-fit">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">Menu</span>
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)}>Close</Button>
          </div>
          {sidebarItems.map((item) => {
            const isActive = item.id === currentTab;
            return (
              <Link key={item.id} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md ${
                    isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                  {item.id === 'payments' && newNotifications && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                  )}
                </button>
              </Link>
            );
          })}
          <div className="pt-4 mt-4 border-t">
            <Button variant="outline" className="w-full justify-start text-red-600" onClick={signOut}>
              <LogOut size={16} className="mr-2" /> Logout
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
