'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Bell, LogOut, LayoutDashboard, User, ChevronDown, ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import ijmbLogo from "@/assets/ijmb-logo.jpeg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const publicNavLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "How It Works", href: "/ijmb-registration" },
  { label: "Centres", href: "/ijmb-centres-in-nigeria" },
  { label: "Fees", href: "/ijmb-fees" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
];

const getInitials = (name: string | null | undefined, email: string | null | undefined) => {
  if (name) {
    const parts = name.trim().split(' ');
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return 'U';
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const isAdmin = profile?.role === 'super_admin' || profile?.role === 'coordinator';

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    router.push('/');
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const initials = getInitials(profile?.full_name, user?.email);
  const dashboardHref = isAdmin ? '/portal-admin' : '/dashboard';

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl backdrop-saturate-150 border-b border-border/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="IJMB Home">
            <Image
              src={ijmbLogo}
              alt="IJMB Logo"
              width={48}
              height={48}
              className="h-10 w-10 lg:h-12 lg:w-12 rounded-full object-cover ring-2 ring-primary/20"
            />
            <div className="hidden sm:block">
              <span className="font-heading font-bold text-lg lg:text-xl text-primary leading-none block">IJMB</span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wide leading-none">Portal</span>
            </div>
          </Link>

          {/* Desktop nav — only show public links when NOT logged in */}
          {!user && (
            <div className="hidden lg:flex items-center gap-0.5">
              {publicNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    pathname === link.href
                      ? "text-primary bg-primary/8"
                      : "text-muted-foreground hover:text-primary hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* When logged in, show role label in center */}
          {user && (
            <div className="hidden lg:flex items-center gap-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                isAdmin
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-primary/10 text-primary border border-primary/20'
              }`}>
                {isAdmin ? '⚙ Admin Portal' : '🎓 Student Portal'}
              </span>
            </div>
          )}

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                {/* Notification Bell */}
                <button
                  className="relative p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors"
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                </button>

                {/* Go to Dashboard shortcut */}
                <Link
                  href={dashboardHref}
                  className="px-4 py-2 text-sm font-medium text-primary hover:bg-secondary rounded-md transition-colors flex items-center gap-1.5"
                >
                  {isAdmin ? <ShieldCheck size={15} /> : <LayoutDashboard size={15} />}
                  {isAdmin ? 'Admin Panel' : 'Dashboard'}
                </Link>

                {/* User dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-border hover:border-primary/40 hover:bg-secondary transition-all focus:outline-none">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                        {displayName.split(' ')[0]}
                      </span>
                      <ChevronDown size={13} className="text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-0.5">
                        <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={dashboardHref} className="cursor-pointer">
                        {isAdmin ? <ShieldCheck size={15} className="mr-2" /> : <LayoutDashboard size={15} className="mr-2" />}
                        {isAdmin ? 'Admin Panel' : 'My Dashboard'}
                      </Link>
                    </DropdownMenuItem>
                    {!isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard?tab=profile" className="cursor-pointer">
                          <User size={15} className="mr-2" /> My Profile
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      disabled={signingOut}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      {signingOut
                        ? <><Loader2 size={15} className="mr-2 animate-spin" /> Signing Out...</>
                        : <><LogOut size={15} className="mr-2" /> Sign Out</>}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium rounded-md text-primary hover:bg-secondary transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 text-sm font-bold rounded-lg cta-gradient text-accent-foreground transition-all"
                >
                  Register Now →
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-foreground rounded-md hover:bg-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl shadow-xl animate-slide-up">
          <div className="px-4 py-4 space-y-1">

            {/* If logged in, show user info at top of mobile menu */}
            {user && (
              <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-secondary/50 rounded-lg">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            )}

            {/* Public nav links — hide when logged in on mobile too */}
            {!user && publicNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  pathname === link.href
                    ? "text-primary bg-primary/8 font-semibold"
                    : "text-muted-foreground hover:text-primary hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="space-y-1 pt-1">
                <Link
                  href={dashboardHref}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-md text-foreground hover:bg-secondary transition-colors"
                >
                  {isAdmin ? <ShieldCheck size={16} /> : <LayoutDashboard size={16} />}
                  {isAdmin ? 'Admin Panel' : 'My Dashboard'}
                </Link>
                {!isAdmin && (
                  <Link
                    href="/dashboard?tab=profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-md text-foreground hover:bg-secondary transition-colors"
                  >
                    <User size={16} /> My Profile
                  </Link>
                )}
                <button
                  onClick={() => { setOpen(false); handleSignOut(); }}
                  disabled={signingOut}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-60"
                >
                  {signingOut
                    ? <><Loader2 size={16} className="animate-spin" /> Signing Out...</>
                    : <><LogOut size={16} /> Sign Out</>}
                </button>
              </div>
            ) : (
              <div className="pt-2 space-y-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium rounded-md text-primary hover:bg-secondary transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="block w-full text-center px-5 py-3 text-sm font-bold rounded-lg cta-gradient text-accent-foreground"
                >
                  Register Now →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
