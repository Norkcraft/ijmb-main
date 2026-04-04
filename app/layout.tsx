import type { Metadata } from 'next';
import { Space_Grotesk, DM_Sans } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import WhatsAppButton from '@/components/WhatsAppButton';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ijmb.info'),
  title: {
    default: 'IJMB Registration Nigeria 2026/2027 – 200 Level Admission Without UTME',
    template: '%s | IJMB Info',
  },
  description: 'Register for IJMB programme in Nigeria. Gain direct entry admission into 200 level without UTME. Apply for 2026/2027 session now. Accepted by 200+ universities.',
  keywords: ['IJMB registration', 'IJMB programme', 'direct entry admission', '200 level without UTME', 'IJMB Nigeria'],
  icons: {
    icon: [
      { url: '/ijmb-logo.jpeg', type: 'image/jpeg' },
    ],
    shortcut: '/ijmb-logo.jpeg',
    apple: '/ijmb-logo.jpeg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://www.ijmb.info',
    siteName: 'IJMB Info',
    images: [{ url: '/ijmb-logo.jpeg', width: 400, height: 400, alt: 'IJMB Registration Portal Nigeria' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ijmbinfo',
    images: ['/ijmb-logo.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable}`}>
      <body>
        <Providers>
          <Navbar />
          <ScrollToTop />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <StickyMobileCTA />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
