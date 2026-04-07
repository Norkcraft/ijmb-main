import type { Metadata } from 'next';
import Fees from '@/pages/Fees';

const yr = new Date().getFullYear();
const YEAR = `${yr}/${yr + 1}`;

export const metadata: Metadata = {
  title: `IJMB Form Price & Fees ${YEAR} – Complete Cost Breakdown`,
  description: 'How much is IJMB form in 2026? IJMB registration form fee is ₦5,500. Full breakdown of tuition (₦85,000), hostel (₦45,000), acceptance (₦15,000) and exam fees.',
  keywords: ['IJMB form price 2026', 'IJMB fees Nigeria', 'how much is IJMB form', 'IJMB registration fee', 'IJMB tuition fee', 'IJMB cost 2026 2027'],
  alternates: { canonical: 'https://www.ijmb.info/ijmb-fees' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
  openGraph: {
    title: `IJMB Form Price & Fees ${YEAR} – Complete Breakdown`,
    description: `IJMB form fee is ₦5,500. See the complete cost breakdown for the ${YEAR} session including tuition, hostel and exam fees.`,
    url: 'https://www.ijmb.info/ijmb-fees',
    images: [{ url: 'https://www.ijmb.info/ijmb-logo.jpeg', width: 400, height: 400, alt: `IJMB Fees ${YEAR}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `IJMB Form Price & Fees ${YEAR}`,
    description: `IJMB form fee ₦5,500. Full cost breakdown for ${YEAR} session.`,
    images: ['https://www.ijmb.info/ijmb-logo.jpeg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: `IJMB Fees ${YEAR} – Complete Price Breakdown`,
  url: 'https://www.ijmb.info/ijmb-fees',
  description: `Full breakdown of IJMB fees for the ${YEAR} academic session in Nigeria.`,
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ijmb.info' },
      { '@type': 'ListItem', position: 2, name: 'IJMB Fees', item: 'https://www.ijmb.info/ijmb-fees' },
    ],
  },
};

export default function FeesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Fees />
    </>
  );
}
