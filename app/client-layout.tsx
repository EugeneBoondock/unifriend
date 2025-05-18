'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Session } from '@supabase/supabase-js';

import ClientBody from './ClientBody';
import { PageLayout } from '../components/layout/PageLayout';
import Sidebar from '../components/layout/Sidebar';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { RouteGuard } from '@/components/auth/RouteGuard';

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, setSession] = useState<Session | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, [supabase]);

  useEffect(() => {
    if (!session && pathname !== '/signin' && pathname !== '/signup') {
      router.push('/signin');
    }
  }, [session, pathname, router]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AuthProvider>
        <ThemeProvider>
          <RouteGuard>
            <div className="flex flex-1">
              {session && <Sidebar />}
              <div className={`flex-1 ${session ? 'md:ml-64' : ''} w-[calc(100vw-16rem)] max-w-full`}>
                <PageLayout>{children}</PageLayout>
              </div>
            </div>
          </RouteGuard>
        </ThemeProvider>
      </AuthProvider>
    </div>
  );
}
