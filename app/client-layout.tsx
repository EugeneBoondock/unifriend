'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Session } from '@supabase/supabase-js';

import { PageLayout } from '../components/layout/PageLayout';
import Sidebar from '../components/layout/Sidebar';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { RouteGuard } from '@/components/auth/RouteGuard';
import dynamic from 'next/dynamic';

// Dynamically import PWA component with no SSR
const PWA = dynamic(() => import('@/components/PWA'), { ssr: false });

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, setSession] = useState<Session | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    setMounted(true);
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase]);

  // Handle redirects - only redirect to signin if not on a public route
  useEffect(() => {
    const publicRoutes = ['/', '/signin', '/signup', '/about', '/contact'];
    const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/auth/');
    
    if (mounted && !session && !isPublicRoute) {
      router.push('/signin');
    }
  }, [session, pathname, router, mounted]);

  // Prevent flash of unauthorized content
  if (!mounted) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <RouteGuard>
          <div className="flex min-h-screen w-full">
            {session && <Sidebar />}
            <main className={`flex-1 transition-all duration-200 ${session ? 'md:ml-64' : ''} w-full`}>
              <PageLayout>
                {children}
                <PWA />
              </PageLayout>
            </main>
          </div>
        </RouteGuard>
      </AuthProvider>
    </ThemeProvider>
  );
}
