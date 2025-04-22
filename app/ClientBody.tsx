"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "./theme/ThemeProvider";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Apply dark mode by default
    document.documentElement.classList.add("dark");
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen pattern-container">
        {children}
      </div>
    </ThemeProvider>
  );
}
