'use client';

import { useEffect, useState } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import './globals.css';
import '../styles/meerkat-theme.css';
import ClientBody from './ClientBody';
import { PageLayout } from '../components/layout/PageLayout';
import Sidebar from '../components/layout/Sidebar';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { RouteGuard } from '@/components/auth/RouteGuard';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Unifriend - South Africa University Student Community',
  description:
    'A platform for South African university students to connect, share advice, get help with applications, NSFAS, and build a community.',
  keywords: [
    'South Africa',
    'university',
    'students',
    'NSFAS',
    'applications',
    'forum',
    'community',
    'advice',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, setSession] = useState(null);
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="flex h-screen">
        <ClientBody>
          <AuthProvider>
            <ThemeProvider>
              <RouteGuard>
                {session && <Sidebar />}
                <div className={`ml-0 ${session ? 'md:ml-64' : 'md:ml-0'} flex-1 overflow-auto`}>
                  <PageLayout>{children}</PageLayout>
                </div>
              </RouteGuard>
            </ThemeProvider>
          </AuthProvider>
        </ClientBody>
      </body>
    </html>
  );
}
