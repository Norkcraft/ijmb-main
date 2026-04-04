'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const StickyMobileCTA = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  if (user) return null;

  const hiddenPrefixes = ['/register', '/login', '/forgot-password', '/reset-password', '/verify-email', '/dashboard', '/portal-admin', '/admin-login'];
  if (hiddenPrefixes.some((p) => pathname?.startsWith(p))) return null;

  return (
    <div className="sticky-mobile-cta">
      <Link
        href="/register"
        className="block w-full text-center py-3 font-bold text-sm rounded-lg cta-gradient text-accent-foreground"
      >
        Register for IJMB Now →
      </Link>
    </div>
  );
};

export default StickyMobileCTA;
