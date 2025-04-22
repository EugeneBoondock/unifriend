"use client";
import { useEffect, useState } from "react";
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ClientBody from './ClientBody';
import { PageLayout } from '../components/layout/PageLayout';
import Sidebar from '../components/layout/Sidebar';
import { AuthProvider } from './providers/AuthProvider';
import { redirect } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [session, setSession] = useState(null);
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, [supabase]);
  useEffect(() => {
    if (!session && pathname !== "/signin" && pathname !== "/signup") {
      redirect('/signin');
    }
  }, [session, pathname]);
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className='flex h-screen'>
        <ClientBody>
          <AuthProvider>
            {session && <Sidebar />}
            <div className={`ml-0 ${session ? 'md:ml-64' : 'md:ml-0'} flex-1 overflow-auto`}>
              <PageLayout>{children}</PageLayout>
            </div>
          </AuthProvider>
        </ClientBody>
      </body>
    </html>
  );
}
