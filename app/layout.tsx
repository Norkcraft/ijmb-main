import type { Metadata } from 'next';
import { Manrope, Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import AppShell from '@/components/AppShell';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const yr = new Date().getFullYear();
const YEAR = `${yr}/${yr + 1}`;

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ijmb.info'),
  title: {
    default: `IJMB Registration Nigeria ${YEAR} – 200 Level Admission Without UTME`,
    template: '%s | IJMB Info',
  },
  description: `Register for IJMB programme in Nigeria. Gain direct entry admission into 200 level without UTME. Apply for ${YEAR} session now. Accepted by 200+ universities.`,
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
    <html lang="en" className={`${manrope.variable} ${plusJakartaSans.variable} ${playfairDisplay.variable}`}>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
