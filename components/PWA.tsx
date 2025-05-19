'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Extend the Window interface to include workbox
declare global {
  interface Window {
    workbox?: {
      register: () => Promise<ServiceWorkerRegistration>;
    };
  }
}

export default function PWA() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Check if workbox is loaded
      if (window.workbox) {
        // Register service worker using workbox
        window.workbox.register()
          .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
          });
      } else {
        // Fallback for when workbox is not available
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
          });
      }
    }
  }, [pathname]);

  return null;
}
