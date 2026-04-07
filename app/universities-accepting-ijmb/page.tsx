import type { Metadata } from 'next';
import Universities from '@/pages/Universities';

const yr = new Date().getFullYear();
const YEAR = `${yr}/${yr + 1}`;

export const metadata: Metadata = {
  title: `Universities That Accept IJMB for Direct Entry ${YEAR} – Full List`,
  description: 'Complete list of 200+ federal, state and private universities that accept IJMB for direct entry into 200 level in Nigeria. UNILAG, ABU Zaria, UI, UNILORIN, UNIBEN and more.',
  keywords: ['universities that accept IJMB', 'IJMB direct entry universities', 'universities accepting IJMB 2026', 'does UNILAG accept IJMB', 'federal universities accepting IJMB', 'IJMB accepted universities Nigeria'],
  alternates: { canonical: 'https://www.ijmb.info/universities-accepting-ijmb' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
  openGraph: {
    title: `Universities That Accept IJMB for Direct Entry ${YEAR}`,
    description: 'Over 200 Nigerian universities accept IJMB for direct entry into 200 level. See the full list.',
    url: 'https://www.ijmb.info/universities-accepting-ijmb',
    images: [{ url: 'https://www.ijmb.info/ijmb-logo.jpeg', width: 400, height: 400, alt: 'Universities That Accept IJMB Nigeria' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Universities That Accept IJMB ${YEAR}`,
    description: '200+ Nigerian universities accept IJMB for direct entry. See the complete list.',
    images: ['https://www.ijmb.info/ijmb-logo.jpeg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: `Universities That Accept IJMB for Direct Entry ${YEAR}`,
  url: 'https://www.ijmb.info/universities-accepting-ijmb',
  description: 'Complete list of Nigerian universities that accept IJMB A-Level certificate for direct entry admission into 200 level.',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ijmb.info' },
      { '@type': 'ListItem', position: 2, name: 'Universities Accepting IJMB', item: 'https://www.ijmb.info/universities-accepting-ijmb' },
    ],
  },
};

export default function UniversitiesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Universities />
    </>
  );
}
