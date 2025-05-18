'use client';

import React from 'react';

export function GlassCard({ children, className = '' }) {
  return (
    <div className={`bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function MeerkatThemeContainer({ children, className = '' }) {
  return (
    <div className={`pattern-container relative ${className}`}>
      <div className="meerkat-pattern-overlay absolute inset-0 pointer-events-none opacity-5"></div>
      {children}
    </div>
  );
}

export function MeerkatIcon({ size = 24, className = '' }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`meerkat-icon ${className}`}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
      <circle cx="12" cy="10" r="3" />
      <path d="M8 16s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  );
}

export function AnimatedBackground({ className = '' }) {
  return (
    <div className={`animated-background fixed inset-0 z-0 pointer-events-none ${className}`}>
      <div className="meerkats">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="meerkat" style={{ 
            left: `${Math.random() * 100}%`, 
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          }}>
            <MeerkatIcon size={24 + Math.floor(Math.random() * 24)} />
          </div>
        ))}
      </div>
    </div>
  );
}
