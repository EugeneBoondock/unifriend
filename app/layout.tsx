import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/meerkat-theme.css";
import ClientBody from "./ClientBody";
import { PageLayout } from "../components/layout/PageLayout";
import { AuthProvider } from "./providers/AuthProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { RouteGuard } from "@/components/auth/RouteGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Unifriend - South Africa University Student Community",
  description: "A platform for South African university students to connect, share advice, get help with applications, NSFAS, and build a community.",
  keywords: ["South Africa", "university", "students", "NSFAS", "applications", "forum", "community", "advice"],
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body>
        <ClientBody>
          <AuthProvider>
            <ThemeProvider>
              <RouteGuard>
                <PageLayout>
                  {children}
                </PageLayout>
              </RouteGuard>
            </ThemeProvider>
          </AuthProvider>
        </ClientBody>
      </body>
    </html>
  );
}
