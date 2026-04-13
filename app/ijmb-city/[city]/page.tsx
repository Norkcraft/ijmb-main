import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LocationPage from '@/pages/LocationPage';

export const dynamicParams = true;

const yr = new Date().getFullYear();
const YEAR = `${yr}/${yr + 1}`;

const cities = [
  'lagos', 'abuja', 'ibadan', 'ilorin', 'port-harcourt', 'benin', 'kano',
  'kaduna', 'jos', 'enugu', 'owerri', 'aba', 'uyo', 'akure', 'ado-ekiti',
  'abeokuta', 'osogbo', 'minna', 'lokoja', 'makurdi', 'anambra', 'awka',
  'onitsha', 'asaba', 'calabar', 'warri', 'sokoto', 'zaria',
];

export async function generateStaticParams() {
  return cities.map((city) => ({ city }));
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const cityName = (params.city ?? '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    title: `IJMB in ${cityName} ${YEAR} – Accredited Study Centres & Registration`,
    description: `Find accredited IJMB study centres in ${cityName}. Register for IJMB ${YEAR}, gain direct entry into 200 level without UTME. Fees, requirements and how to apply in ${cityName}.`,
    keywords: [`IJMB in ${cityName}`, `IJMB centres in ${cityName}`, `IJMB ${cityName}`, `register IJMB ${cityName}`, `IJMB 2026 ${cityName}`, `direct entry ${cityName}`],
    // Canonical always points to the user-facing /ijmb-in-{city} URL
    alternates: { canonical: `https://www.ijmb.info/ijmb-in-${params.city}` },
    robots: { index: true, follow: true },
    openGraph: {
      title: `IJMB in ${cityName} ${YEAR} – Accredited Centres & Registration`,
      description: `Accredited IJMB study centres in ${cityName}. Register online for ${YEAR} session and gain direct entry into 200 level.`,
      url: `https://www.ijmb.info/ijmb-in-${params.city}`,
      images: [{ url: 'https://www.ijmb.info/ijmb-logo.jpeg', width: 400, height: 400, alt: `IJMB in ${cityName}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `IJMB in ${cityName} ${YEAR}`,
      description: `Register for IJMB in ${cityName}. Direct entry 200 level without UTME.`,
      images: ['https://www.ijmb.info/ijmb-logo.jpeg'],
    },
  };
}

const validCities = new Set(cities);

export default function CityLocationPage({ params }: { params: { city: string } }) {
  const city = (params.city ?? '').toLowerCase();
  if (!validCities.has(city)) notFound();
  return <LocationPage city={city} />;
}
