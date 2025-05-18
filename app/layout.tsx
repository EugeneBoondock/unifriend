import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ClientLayout from './client-layout';

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
  return (
    <html 
      lang="en" 
      className={`${geistSans.variable} ${geistMono.variable} overflow-x-hidden`} 
      suppressHydrationWarning
    >
      <body className="min-h-screen w-full overflow-x-hidden bg-background text-foreground">
        <div id="__next" className="min-h-screen flex flex-col bg-background">
          <ClientLayout>{children}</ClientLayout>
        </div>
      </body>
    </html>
  );
}
