'use client';

import React, { useEffect, useState } from 'react';

export function PatternBackground() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Don't render anything on the server or during hydration
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Background pattern will be applied via CSS */}
    </div>
  );
}
