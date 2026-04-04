'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  // useState ensures a new QueryClient is created per request (important for SSR)
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          {children}
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
