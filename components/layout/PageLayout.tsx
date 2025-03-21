"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function PageLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Skip navigation and footer on specific pages
  const skipNav = ["/signin", "/signup"].includes(pathname);

  return (
    <div className="min-h-screen flex flex-col pattern-container">
      {!skipNav && <Navbar />}

      <main className="flex-1 w-full">
        {children}
      </main>

      {!skipNav && <Footer />}
    </div>
  );
}
