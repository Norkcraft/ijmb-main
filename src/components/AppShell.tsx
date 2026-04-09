'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import WhatsAppButton from '@/components/WhatsAppButton';

const APP_ROUTES = ['/dashboard', '/portal-admin'];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAppRoute = APP_ROUTES.some((r) => pathname.startsWith(r));

  return (
    <>
      {!isAppRoute && <Navbar />}
      {!isAppRoute && <ScrollToTop />}
      <main className="min-h-screen">{children}</main>
      {!isAppRoute && <Footer />}
      {!isAppRoute && <StickyMobileCTA />}
      {!isAppRoute && <WhatsAppButton />}
    </>
  );
}
