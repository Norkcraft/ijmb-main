import type { Metadata } from 'next';
import Blog from '@/pages/Blog';

export const metadata: Metadata = {
  title: 'IJMB Blog – Latest News, Guides & Admission Updates 2026',
  description: 'Stay updated with IJMB news, registration guides, direct entry tips, and university admission updates for 2026. Nigeria\'s #1 source for IJMB information.',
  keywords: ['IJMB blog', 'IJMB news 2026', 'IJMB updates', 'direct entry admission guide Nigeria', 'IJMB registration guide 2026'],
  alternates: { canonical: 'https://www.ijmb.info/blog' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
  openGraph: {
    title: 'IJMB Blog – Latest News, Guides & Admission Updates 2026',
    description: 'IJMB registration guides, news and university admission tips for Nigerian students.',
    url: 'https://www.ijmb.info/blog',
    images: [{ url: 'https://www.ijmb.info/ijmb-logo.jpeg', width: 400, height: 400, alt: 'IJMB Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IJMB Blog 2026 – Guides & Admission Updates',
    description: 'Latest IJMB news, guides and university admission tips.',
    images: ['https://www.ijmb.info/ijmb-logo.jpeg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'IJMB Info Blog',
  url: 'https://www.ijmb.info/blog',
  description: 'IJMB registration guides, admission news and direct entry tips for Nigerian students.',
  publisher: {
    '@type': 'Organization',
    name: 'IJMB Info',
    logo: { '@type': 'ImageObject', url: 'https://www.ijmb.info/ijmb-logo.jpeg' },
  },
};

export default function BlogPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Blog />
    </>
  );
}
