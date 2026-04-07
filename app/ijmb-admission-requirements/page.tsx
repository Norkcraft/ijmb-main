import type { Metadata } from 'next';
import Requirements from '@/pages/Requirements';

const yr = new Date().getFullYear();
const YEAR = `${yr}/${yr + 1}`;

export const metadata: Metadata = {
  title: `IJMB Requirements ${YEAR} – O'Level & Admission Requirements`,
  description: `Complete IJMB admission requirements for ${YEAR}. Minimum 5 O'Level credits including English and Maths. Awaiting results accepted. See full list of documents needed.`,
  keywords: ['IJMB requirements 2026', 'IJMB admission requirements', 'requirements for IJMB registration', 'IJMB O level requirements', 'what do you need for IJMB', 'IJMB documents needed'],
  alternates: { canonical: 'https://www.ijmb.info/ijmb-admission-requirements' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
  openGraph: {
    title: `IJMB Requirements ${YEAR} – O'Level & Admission Requirements`,
    description: `Everything you need to register for IJMB ${YEAR}. O'Level requirements, subject combinations, documents and eligibility.`,
    url: 'https://www.ijmb.info/ijmb-admission-requirements',
    images: [{ url: 'https://www.ijmb.info/ijmb-logo.jpeg', width: 400, height: 400, alt: 'IJMB Admission Requirements 2026' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `IJMB Requirements ${YEAR}`,
    description: `Full list of IJMB admission requirements. O'Level credits, documents, eligibility.`,
    images: ['https://www.ijmb.info/ijmb-logo.jpeg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: `IJMB Admission Requirements ${YEAR}`,
  url: 'https://www.ijmb.info/ijmb-admission-requirements',
  description: 'Complete list of requirements to register for the IJMB A-Level programme in Nigeria.',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ijmb.info' },
      { '@type': 'ListItem', position: 2, name: 'IJMB Requirements', item: 'https://www.ijmb.info/ijmb-admission-requirements' },
    ],
  },
};

export default function RequirementsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Requirements />
    </>
  );
}
