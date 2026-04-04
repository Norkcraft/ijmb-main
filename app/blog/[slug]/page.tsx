import type { Metadata } from 'next';
import { blogPosts } from '@/data/blogPosts';
import BlogPost from '@/pages/BlogPost';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return { title: 'Post Not Found | IJMB Info', robots: { index: false, follow: false } };

  return {
    title: `${post.title} | IJMB Info`,
    description: post.excerpt,
    alternates: { canonical: `https://www.ijmb.info/blog/${post.slug}` },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://www.ijmb.info/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      siteName: 'IJMB Info',
      images: [{ url: post.image || 'https://www.ijmb.info/ijmb-logo.jpeg', alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image || 'https://www.ijmb.info/ijmb-logo.jpeg'],
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  const jsonLd = post ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.image || 'https://www.ijmb.info/ijmb-logo.jpeg',
    datePublished: post.date,
    url: `https://www.ijmb.info/blog/${post.slug}`,
    author: {
      '@type': 'Organization',
      name: 'IJMB Info',
      url: 'https://www.ijmb.info',
    },
    publisher: {
      '@type': 'Organization',
      name: 'IJMB Info',
      logo: { '@type': 'ImageObject', url: 'https://www.ijmb.info/ijmb-logo.jpeg' },
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ijmb.info' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.ijmb.info/blog' },
        { '@type': 'ListItem', position: 3, name: post.title, item: `https://www.ijmb.info/blog/${post.slug}` },
      ],
    },
  } : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <BlogPost slug={params.slug} />
    </>
  );
}
