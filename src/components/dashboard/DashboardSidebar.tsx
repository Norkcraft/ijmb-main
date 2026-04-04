'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Download, Loader2, Upload, User, FileText, Home, CreditCard } from 'lucide-react';
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from '@/lib/utils';

interface Step {
  label: string;
  done: boolean;
  icon: any;
}

interface DashboardSidebarProps {
  steps: Step[];
  application: any;
  uploading: string | null;
  appSubmitted: boolean;
  isAdmitted: boolean;
  hasAdmissionLetter: boolean;
  onFileUpload: (type: 'passport' | 'olevel') => void;
  onDownloadAdmissionLetter: () => void;
  className?: string;
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'Registration Started',
  submitted: 'Registration Submitted',
  payment_pending: 'Payment Pending',
  payment_completed: 'Payment Completed',
  review: 'Under Review',
  admitted: 'Admission Approved',
  fees_pending: 'Programme Fees Pending',
  active: 'Active Student',
  rejected: 'Rejected',
};

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  submitted: 'bg-blue-100 text-blue-800',
  payment_pending: 'bg-orange-100 text-orange-800',
  payment_completed: 'bg-green-100 text-green-800',
  review: 'bg-purple-100 text-purple-800',
  admitted: 'bg-green-100 text-green-800',
  fees_pending: 'bg-yellow-100 text-yellow-800',
  active: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
};

const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: FileText, label: "My Application", href: "/dashboard?tab=application" },
    { icon: CreditCard, label: "Payments", href: "/dashboard?tab=payments" },
];

export const DashboardSidebar = ({
  steps,
  application,
  uploading,
  appSubmitted,
  isAdmitted,
  hasAdmissionLetter,
  onFileUpload,
  onDownloadAdmissionLetter,
  className
}: DashboardSidebarProps) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentTab = searchParams?.get('tab') || 'dashboard';

  return (
    <div className={cn("space-y-6", className)}>

        {/* Navigation Menu - SaaS Style */}
        <Card>
            <CardContent className="p-2">
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const itemTab = item.href.split('?tab=')[1];
                        const isActive = itemTab
                          ? currentTab === itemTab
                          : currentTab === 'dashboard';
                        return (
                            <Link key={item.label} href={item.href}>
                                <button className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}>
                                    <item.icon size={18} />
                                    {item.label}
                                </button>
                            </Link>
                        )
                    })}
                </nav>
            </CardContent>
        </Card>

       {/* Steps Checklist */}
       <Card>
        <CardHeader>
          <CardTitle className="text-lg">Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {steps.map((step, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${step.done ? 'bg-green-50/50' : ''}`}>
              <div className={`${step.done ? 'text-green-600' : 'text-muted-foreground'}`}>
                {step.done ? <CheckCircle size={20} className="fill-green-100" /> : <Circle size={20} />}
              </div>
              <span className={`text-sm font-medium ${step.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Document Upload Widget */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Documents</CardTitle>
          <CardDescription>Passport & O-Level Results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {/* Passport */}
            <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${application?.passport_path ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                  <User size={16} />
                </div>
                <div className="text-sm">
                  <p className="font-medium">Passport</p>
                  <p className="text-xs text-muted-foreground">{application?.passport_path ? 'Uploaded' : 'Required'}</p>
                </div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => onFileUpload('passport')} disabled={uploading === 'passport' || !!appSubmitted}>
                 {uploading === 'passport' ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
              </Button>
            </div>

            {/* O-Level */}
            <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${application?.olevel_path ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                  <FileText size={16} />
                </div>
                 <div className="text-sm">
                  <p className="font-medium">O-Level</p>
                  <p className="text-xs text-muted-foreground">{application?.olevel_path ? 'Uploaded' : 'Required'}</p>
                </div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => onFileUpload('olevel')} disabled={uploading === 'olevel' || !!appSubmitted}>
                 {uploading === 'olevel' ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
              </Button>
            </div>
          </div>
          {appSubmitted && (
            <div className="text-xs text-center text-muted-foreground bg-muted p-2 rounded">
              Documents locked after submission
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admission Status */}
      <Card className={`${isAdmitted ? 'border-green-500 bg-green-50' : ''}`}>
        <CardHeader>
          <CardTitle className="text-lg">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
             <Badge className={`w-fit text-sm px-3 py-1 ${STATUS_COLORS[application?.status] || 'bg-muted text-muted-foreground'}`}>
                {STATUS_LABELS[application?.status] || 'Not Started'}
             </Badge>

             {hasAdmissionLetter && (
                <Button onClick={onDownloadAdmissionLetter} className="w-full bg-green-600 hover:bg-green-700">
                  <Download size={16} className="mr-2" /> Admission Letter
                </Button>
             )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
