import type { Metadata } from 'next';
import Contact from '@/pages/Contact';

export const metadata: Metadata = {
  title: 'Contact IJMB – Admission Support & Registration Enquiries',
  description: 'Contact the IJMB Info support team for help with registration, fees, study centres and admission enquiries. Reach us via phone, email or WhatsApp.',
  keywords: ['contact IJMB', 'IJMB support', 'IJMB helpline Nigeria', 'IJMB office contact', 'IJMB WhatsApp', 'IJMB admission enquiries'],
  alternates: { canonical: 'https://www.ijmb.info/contact' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Contact IJMB – Admission Support & Enquiries',
    description: 'Get in touch with IJMB Info. We help with registration, study centres, fees and all admission questions.',
    url: 'https://www.ijmb.info/contact',
    images: [{ url: 'https://www.ijmb.info/ijmb-logo.jpeg', width: 400, height: 400, alt: 'Contact IJMB Info' }],
  },
  twitter: {
    card: 'summary',
    title: 'Contact IJMB Info',
    description: 'Reach our admission support team for help with IJMB registration.',
    images: ['https://www.ijmb.info/ijmb-logo.jpeg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact IJMB Info',
  url: 'https://www.ijmb.info/contact',
  description: 'Contact page for IJMB Info admission support team.',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ijmb.info' },
      { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://www.ijmb.info/contact' },
    ],
  },
};

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Contact />
    </>
  );
}
