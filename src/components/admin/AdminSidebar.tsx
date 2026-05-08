'use client';

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  LayoutDashboard, CreditCard, MapPin, BookOpen, Calendar,
  DollarSign, LogOut, Bell, Users, FileText, ChevronRight, Loader2
} from "lucide-react";
import { useState } from "react";

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

interface AdminSidebarProps {
  className?: string;
  user: any;
  signOut: () => void;
  newNotifications?: boolean;
  newStudentNotification?: boolean;
}

export function AdminSidebar({ className, user, signOut, newNotifications, newStudentNotification }: AdminSidebarProps) {
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get('tab') || 'overview';
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
  };

  return (
    <aside className={cn("hidden lg:flex w-64 flex-col h-screen shrink-0", className)}
      style={{ background: 'hsl(145, 63%, 12%)' }}>

      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
            <span className="text-white font-bold text-sm">IJ</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">IJMB Admin</p>
            <p className="text-white/50 text-[11px] mt-0.5">Portal Management</p>
          </div>
        </div>
        {newNotifications && (
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {sidebarItems.map((item) => {
          const isActive = item.id === currentTab;
          return (
            <Link key={item.id} href={item.href}>
              <div className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer group",
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              )}>
                <item.icon size={16} className={isActive ? "text-white" : "text-white/50 group-hover:text-white"} />
                <span className="flex-1">{item.label}</span>
                {item.id === 'payments' && newNotifications && (
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                )}
                {item.id === 'students' && newStudentNotification && (
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                )}
                {isActive && <ChevronRight size={14} className="text-white/40" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-white/10 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.email}</p>
            <p className="text-white/50 text-[11px]">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-all disabled:opacity-60"
        >
          {signingOut
            ? <><Loader2 size={16} className="animate-spin" /> Signing Out...</>
            : <><LogOut size={16} /> Sign Out</>}
        </button>
      </div>
    </aside>
  );
}
