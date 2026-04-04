'use client';

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard, CreditCard, MapPin, BookOpen, Calendar,
  DollarSign, LogOut, Bell, Users, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/portal-admin", id: 'overview' },
  { icon: FileText, label: "Applications", href: "/portal-admin?tab=applications", id: 'applications' },
  { icon: Users, label: "Students", href: "/portal-admin?tab=students", id: 'students' },
  { icon: MapPin, label: "Centres", href: "/portal-admin?tab=centres", id: 'centres' },
  { icon: CreditCard, label: "Payments", href: "/portal-admin?tab=payments", id: 'payments' },
  { icon: BookOpen, label: "Subjects", href: "/portal-admin?tab=subjects", id: 'subjects' },
  { icon: Calendar, label: "Sessions", href: "/portal-admin?tab=sessions", id: 'sessions' },
  { icon: DollarSign, label: "Fees", href: "/portal-admin?tab=fees", id: 'fees' },
];

interface AdminSidebarProps {
  className?: string;
  user: any;
  signOut: () => void;
  newNotifications?: boolean;
}

export function AdminSidebar({ className, user, signOut, newNotifications }: AdminSidebarProps) {
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get('tab') || 'overview';

  return (
    <aside className={cn("hidden lg:flex w-64 flex-col bg-white border-r h-screen", className)}>
      <div className="p-6 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">A</div>
          <span className="font-heading font-bold text-lg">IJMB Admin</span>
        </div>
        {newNotifications && <Bell size={16} className="text-red-500 animate-pulse" />}
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = item.id === currentTab;
          return (
            <Link key={item.id} href={item.href}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon size={18} />
                {item.label}
                {item.id === 'payments' && newNotifications && (
                   <span className="ml-auto h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                )}
              </button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.email}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>
        <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={signOut}>
          <LogOut size={16} className="mr-2" /> Logout
        </Button>
      </div>
    </aside>
  );
}
