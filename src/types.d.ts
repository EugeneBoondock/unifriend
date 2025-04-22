// Extend Next.js types for proper page props
import { Metadata } from 'next';
import { ReactNode } from 'react';

declare module 'next' {
  // Define the type for page parameters
  export interface PageProps {
    params: Record<string, string>;
    searchParams: Record<string, string | string[]>;
  }
}

// Define types for page components
declare namespace App {
  interface PageProps {
    params: Record<string, string>;
    searchParams?: Record<string, string | string[]>;
  }
}

export {};
