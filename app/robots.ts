import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/portal-admin', '/admin-login', '/api/'],
      },
    ],
    sitemap: 'https://www.ijmb.info/sitemap.xml',
  };
}
