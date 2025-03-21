"use client";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { usePathname } from "next/navigation";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const pathname = usePathname();

  // Skip navigation and footer on specific pages
  const skipNav = ["/signin", "/signup"].includes(pathname);

  return (
    <div className="flex min-h-screen flex-col pattern-container">
      {!skipNav && <Navbar />}
      <main className="flex-1">{children}</main>
      {!skipNav && <Footer />}
    </div>
  );
}
