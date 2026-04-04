import type { Metadata } from 'next';
import Login from '@/pages/Login';

export const metadata: Metadata = {
  title: 'Student Login – IJMB Portal',
  description: 'Login to your IJMB student portal to manage your application and track your admission status.',
  alternates: { canonical: 'https://www.ijmb.info/login' },
  robots: { index: false },
};

export default function LoginPage() {
  return <Login />;
}
