import type { Metadata } from 'next';
import Register from '@/pages/Register';

export const metadata: Metadata = {
  title: 'Create Account – IJMB Registration Portal',
  description: 'Create your IJMB student account to start your application for direct entry admission.',
  alternates: { canonical: 'https://www.ijmb.info/register' },
  robots: { index: false },
};

export default function RegisterPage() {
  return <Register />;
}
