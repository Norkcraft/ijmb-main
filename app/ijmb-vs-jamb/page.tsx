import type { Metadata } from 'next';
import IJMBvsJAMB from '@/pages/IJMBvsJAMB';

export const metadata: Metadata = {
  title: 'IJMB vs JAMB 2026 – Which is Better for University Admission in Nigeria?',
  description: 'IJMB vs JAMB/UTME: Detailed comparison for 2026. Why IJMB gives you a better shot at 200 level university admission than writing UTME repeatedly. Pros, cons, and which to choose.',
  keywords: ['IJMB vs JAMB', 'is IJMB better than JAMB', 'IJMB vs UTME 2026', 'direct entry vs UTME', 'IJMB or JAMB which is better', '200 level without UTME', 'IJMB JAMB comparison'],
  alternates: { canonical: 'https://www.ijmb.info/ijmb-vs-jamb' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
  openGraph: {
    title: 'IJMB vs JAMB 2026 – Which is Better for University Admission?',
    description: 'Complete comparison of IJMB and JAMB/UTME. Which route gives you the best chance of gaining university admission in Nigeria?',
    url: 'https://www.ijmb.info/ijmb-vs-jamb',
    images: [{ url: 'https://www.ijmb.info/ijmb-logo.jpeg', width: 400, height: 400, alt: 'IJMB vs JAMB Comparison' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IJMB vs JAMB 2026 – Which is Better?',
    description: 'Should you do IJMB or write JAMB UTME? Complete comparison guide.',
    images: ['https://www.ijmb.info/ijmb-logo.jpeg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'IJMB vs JAMB 2026 – Which is Better for University Admission in Nigeria?',
  description: 'A detailed comparison of the IJMB A-Level programme vs JAMB UTME for university admission in Nigeria.',
  url: 'https://www.ijmb.info/ijmb-vs-jamb',
  image: 'https://www.ijmb.info/ijmb-logo.jpeg',
  publisher: {
    '@type': 'Organization',
    name: 'IJMB Info',
    logo: { '@type': 'ImageObject', url: 'https://www.ijmb.info/ijmb-logo.jpeg' },
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ijmb.info' },
      { '@type': 'ListItem', position: 2, name: 'IJMB vs JAMB', item: 'https://www.ijmb.info/ijmb-vs-jamb' },
    ],
  },
};

export default function IJMBvsJAMBPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <IJMBvsJAMB />
    </>
  );
}
