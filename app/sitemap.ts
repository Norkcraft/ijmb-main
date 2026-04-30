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
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date('2026-04-30'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date('2026-04-30'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/ijmb-registration`,
      lastModified: new Date('2026-04-01'),
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/ijmb-admission-requirements`,
      lastModified: new Date('2026-04-01'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/ijmb-fees`,
      lastModified: new Date('2026-04-01'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/ijmb-centres-in-nigeria`,
      lastModified: new Date('2026-04-01'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/universities-accepting-ijmb`,
      lastModified: new Date('2026-04-01'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/ijmb-vs-jamb`,
      lastModified: new Date('2026-03-01'),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date('2026-03-01'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date('2026-04-13'),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date('2026-04-29'),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: new Date('2026-04-01'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date('2026-04-01'),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
  ];

  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${BASE_URL}/ijmb-city/${city}`,
    lastModified: new Date('2026-03-01'),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...cityPages, ...blogPages];
}
