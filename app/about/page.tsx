import type { Metadata } from 'next';
import About from '@/pages/About';

export const metadata: Metadata = {
  title: 'About Dynamic School of Advanced Studies – IJMB Study Centre',
  description:
    'Dynamic School of Advanced Studies is a leading IJMB study centre in Nigeria. We help students gain direct 200-Level university admission without UTME. Learn about our mission, story, and values.',
  keywords: [
    'Dynamic School of Advanced Studies',
    'about IJMB study centre',
    'IJMB school Nigeria',
    'IJMB study centre Nigeria',
    'IJMB portal about',
    'IJMB direct entry school',
  ],
  alternates: { canonical: 'https://www.ijmb.info/about' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'About Dynamic School of Advanced Studies – IJMB Study Centre',
    description:
      "Learn about Dynamic School of Advanced Studies — Nigeria's trusted IJMB study centre helping students bypass UTME and gain 200-Level university admission.",
    url: 'https://www.ijmb.info/about',
    images: [
      {
        url: 'https://www.ijmb.info/ijmb-logo.jpeg',
        width: 400,
        height: 400,
        alt: 'Dynamic School of Advanced Studies – IJMB Study Centre',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'About Dynamic School of Advanced Studies',
    description:
      "Nigeria's trusted IJMB study centre. Direct 200-Level admission without UTME.",
    images: ['https://www.ijmb.info/ijmb-logo.jpeg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Dynamic School of Advanced Studies',
  url: 'https://www.ijmb.info/about',
  description:
    'IJMB study centre offering A-Level tuition for direct 200-Level university admission in Nigeria.',
  knowsAbout: 'IJMB (Interim Joint Matriculation Board) A-Level Programme',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ijmb.info' },
      { '@type': 'ListItem', position: 2, name: 'About', item: 'https://www.ijmb.info/about' },
    ],
  },
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <About />
    </>
  );
}
