'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';

export function AuthGuard({ children, fallback }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    
    if (!isLoading && !user) {
      router.push('/signin?redirect=' + encodeURIComponent(window.location.pathname));
    }
  }, [user, isLoading, router]);

  // Show loading state
  if (isLoading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show fallback if not authenticated
  if (!user) {
    if (fallback) {
      return fallback;
    }
    return null;
  }

  // Show children if authenticated
  return <>{children}</>;
}
