'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Email verification is no longer required — redirect to dashboard
const VerifyEmail = () => {
  const router = useRouter();
  useEffect(() => { router.replace('/dashboard'); }, [router]);
  return null;
};

export default VerifyEmail;
