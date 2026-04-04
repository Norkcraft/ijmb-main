'use client';

// SEOHead is now a no-op — all metadata is handled server-side via Next.js
// generateMetadata in each app/**/page.tsx. This component is kept only
// to avoid breaking existing page components that still reference it.

const SEOHead = (_props: {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string;
  schema?: object;
  noindex?: boolean;
}) => null;

export default SEOHead;
