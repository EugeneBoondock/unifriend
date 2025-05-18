'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';

// Define routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/study-groups',
  '/notifications',
  '/achievements',
  '/protest-planner/create',
  '/library/upload',
  '/business-ads/create',
  '/business-ads/manage',
  '/help-a-student/offer',
  '/exam-preparation/create',
  '/i-skipped-class/upload',
  '/assignment-playground/create',
  '/employment-recommendations/applications',
  '/employment-recommendations/resume',
  '/unicircle/messages',
  '/unicircle/groups/create',
  '/unishare/upload',
  '/uni-vendors/services/create',
  '/uni-vendors/products/create'
];

// Define routes that show different content when authenticated
const conditionalRoutes = [
  '/',
  '/unicircle',
  '/unishare',
  '/uni-vendors',
  '/protest-planner',
  '/library',
  '/business-ads',
  '/help-a-student',
  '/exam-preparation',
  '/i-skipped-class',
  '/assignment-playground',
  '/employment-recommendations'
];

export function RouteGuard({ children }) {
  const pathname = usePathname();
  
  // Check if current route requires authentication
  const requiresAuth = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Check if current route is conditional
  const isConditional = conditionalRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // If route requires authentication, wrap with AuthGuard
  if (requiresAuth) {
    return <AuthGuard>{children}</AuthGuard>;
  }
  
  // For all other routes, render normally
  return <>{children}</>;
}
