// This is a Server Component by default
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ClientLayout from './client-layout';

export { metadata } from './metadata';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </head>
      <body className="min-h-screen w-full text-foreground">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
