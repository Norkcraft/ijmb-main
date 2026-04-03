
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  profile: any;
  user: any;
  signOut: () => void;
}

export const DashboardHeader = ({ profile, user, signOut }: DashboardHeaderProps) => {
  return (
    <header className="bg-white border-b sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
         <div className="flex items-center gap-3">
           <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">S</div>
           <div>
             <h1 className="font-heading font-bold text-lg leading-tight">Student Portal</h1>
             <p className="text-xs text-muted-foreground hidden sm:block">IJMB Registration System</p>
           </div>
         </div>
         <div className="flex items-center gap-4">
           <div className="hidden md:block text-right">
             <p className="text-sm font-medium">{profile?.full_name || 'Student'}</p>
             <p className="text-xs text-muted-foreground">{user?.email}</p>
           </div>
           <Button variant="ghost" size="icon" onClick={signOut} className="text-muted-foreground hover:text-red-600">
             <LogOut size={20} />
           </Button>
         </div>
      </div>
    </header>
  );
};
