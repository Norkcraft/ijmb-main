import type { Metadata } from 'next';
import Centres from '@/pages/Centres';

const yr = new Date().getFullYear();
const YEAR = `${yr}/${yr + 1}`;

export const metadata: Metadata = {
  title: `IJMB Study Centres in Nigeria ${YEAR} – Accredited List by State`,
  description: 'Find accredited IJMB study centres across all 36 states of Nigeria. Official list of approved IJMB centres in Lagos, Abuja, Kano, Ibadan, Port Harcourt, Ilorin and more.',
  keywords: ['IJMB study centres Nigeria', 'IJMB centres list 2026', 'accredited IJMB centres', 'IJMB centres in Lagos', 'IJMB centres in Abuja', 'IJMB centres near me', 'list of IJMB centres Nigeria'],
  alternates: { canonical: 'https://www.ijmb.info/ijmb-centres-in-nigeria' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
  openGraph: {
    title: `IJMB Study Centres in Nigeria ${YEAR} – Accredited List`,
    description: 'Official list of accredited IJMB study centres across all 36 states. Find the centre nearest to you.',
    url: 'https://www.ijmb.info/ijmb-centres-in-nigeria',
    images: [{ url: 'https://www.ijmb.info/ijmb-logo.jpeg', width: 400, height: 400, alt: 'IJMB Study Centres Nigeria' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `IJMB Study Centres in Nigeria ${YEAR}`,
    description: 'Accredited IJMB centres across all 36 states. Find one near you.',
    images: ['https://www.ijmb.info/ijmb-logo.jpeg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: `IJMB Accredited Study Centres in Nigeria ${YEAR}`,
  url: 'https://www.ijmb.info/ijmb-centres-in-nigeria',
  description: `Complete list of IJMB approved study centres across all 36 states of Nigeria for the ${YEAR} academic session.`,
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ijmb.info' },
      { '@type': 'ListItem', position: 2, name: 'IJMB Centres', item: 'https://www.ijmb.info/ijmb-centres-in-nigeria' },
    ],
  },
};

export default function CentresPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Centres />
    </>
  );
}
