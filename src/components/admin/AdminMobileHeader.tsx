'use client';

import { Menu, X, LogOut, LayoutDashboard, CreditCard, MapPin, BookOpen, Calendar, DollarSign, FileText, Users, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview",     href: "/portal-admin",                    id: 'overview' },
  { icon: FileText,        label: "Applications", href: "/portal-admin?tab=applications",   id: 'applications' },
  { icon: Users,           label: "Students",     href: "/portal-admin?tab=students",       id: 'students' },
  { icon: CreditCard,      label: "Payments",     href: "/portal-admin?tab=payments",       id: 'payments' },
  { icon: MapPin,          label: "Centres",      href: "/portal-admin?tab=centres",        id: 'centres' },
  { icon: BookOpen,        label: "Subjects",     href: "/portal-admin?tab=subjects",       id: 'subjects' },
  { icon: Calendar,        label: "Sessions",     href: "/portal-admin?tab=sessions",       id: 'sessions' },
  { icon: DollarSign,      label: "Fees",         href: "/portal-admin?tab=fees",           id: 'fees' },
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
      {/* Top bar */}
      <header className="lg:hidden border-b flex items-center justify-between px-4 py-3"
        style={{ background: 'hsl(145, 63%, 12%)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
            <span className="text-white font-bold text-xs">IJ</span>
          </div>
          <span className="text-white font-bold text-base">IJMB Admin</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Slide-down menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute inset-x-0 top-[52px] z-50 shadow-2xl border-b"
          style={{ background: 'hsl(145, 63%, 10%)' }}>
          <nav className="px-3 py-3 space-y-0.5">
            {sidebarItems.map((item) => {
              const isActive = item.id === currentTab;
              return (
                <Link key={item.id} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
                  }`}>
                    <item.icon size={16} />
                    <span className="flex-1">{item.label}</span>
                    {item.id === 'payments' && newNotifications && (
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    )}
                    {isActive && <ChevronRight size={13} className="text-white/40" />}
                  </div>
                </Link>
              );
            })}
          </nav>
          <div className="px-3 pb-4 border-t border-white/10 pt-3">
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-all"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </>
  );
};
