'use client';

import React from 'react';
import { MainNav } from './MainNav';

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 w-full overflow-x-hidden">
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
