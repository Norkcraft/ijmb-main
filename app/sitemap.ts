import { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blogPosts';

const BASE_URL = 'https://www.ijmb.info';

const cities = [
  'lagos', 'abuja', 'ibadan', 'ilorin', 'port-harcourt', 'benin', 'kano',
  'kaduna', 'jos', 'enugu', 'owerri', 'aba', 'uyo', 'akure', 'ado-ekiti',
  'abeokuta', 'osogbo', 'minna', 'lokoja', 'makurdi', 'anambra', 'awka',
  'onitsha', 'asaba', 'calabar', 'warri', 'sokoto', 'zaria',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/ijmb-registration`, priority: 0.95, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/ijmb-admission-requirements`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/ijmb-fees`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/ijmb-centres-in-nigeria`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/universities-accepting-ijmb`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/ijmb-vs-jamb`, priority: 0.85, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/faq`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/blog`, priority: 0.85, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/contact`, priority: 0.6, changeFrequency: 'yearly' as const },
  ];

  const cityPages = cities.map((city) => ({
    url: `${BASE_URL}/ijmb-in-${city}`,
    priority: 0.75,
    changeFrequency: 'monthly' as const,
  }));

  const blogPages = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
    lastModified: new Date(post.date),
  }));

  return [...staticPages, ...cityPages, ...blogPages];
}
