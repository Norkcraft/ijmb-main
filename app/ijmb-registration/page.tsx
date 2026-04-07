import type { Metadata } from 'next';
import Registration from '@/pages/Registration';

const yr = new Date().getFullYear();
const YEAR = `${yr}/${yr + 1}`;

export const metadata: Metadata = {
  title: `IJMB Registration Form ${YEAR} – Apply Online Now | IJMB Info`,
  description: `Register for IJMB ${YEAR} online. Complete your IJMB form, pay the ₦5,500 form fee, and gain direct entry into 200 level without UTME. Apply now.`,
  keywords: ['IJMB registration form 2026', 'register for IJMB online', 'IJMB form 2026 2027', 'IJMB application form', 'buy IJMB form online Nigeria', 'IJMB form fee'],
  alternates: { canonical: 'https://www.ijmb.info/ijmb-registration' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
  openGraph: {
    title: `IJMB Registration Form ${YEAR} – Apply Online Now`,
    description: `Register for IJMB ${YEAR} and gain direct entry into 200 level without UTME. Form fee ₦5,500. Apply now.`,
    url: 'https://www.ijmb.info/ijmb-registration',
    images: [{ url: 'https://www.ijmb.info/ijmb-logo.jpeg', width: 400, height: 400, alt: `IJMB Registration Form ${YEAR}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `IJMB Registration Form ${YEAR} – Apply Online`,
    description: 'Register for IJMB online. Direct entry 200 level without UTME. Form fee ₦5,500.',
    images: ['https://www.ijmb.info/ijmb-logo.jpeg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      name: `IJMB Registration Form ${YEAR}`,
      url: 'https://www.ijmb.info/ijmb-registration',
      description: `Official IJMB online registration form for the ${YEAR} academic session.`,
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ijmb.info' },
          { '@type': 'ListItem', position: 2, name: 'IJMB Registration', item: 'https://www.ijmb.info/ijmb-registration' },
        ],
      },
    },
    {
      '@type': 'Offer',
      name: `IJMB Registration Form ${YEAR}`,
      description: 'Online registration form for the IJMB A-Level programme. Gain direct entry into 200 level without UTME.',
      price: '5500',
      priceCurrency: 'NGN',
      availability: 'https://schema.org/InStock',
      url: 'https://www.ijmb.info/ijmb-registration',
    },
  ],
};

export default function RegistrationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Registration />
    </>
  );
}
