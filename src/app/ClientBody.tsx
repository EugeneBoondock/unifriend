"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <body>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="min-h-screen dark:bg-dark-pattern bg-light-pattern">
          {children}
        </div>
      </ThemeProvider>
    </body>
  );
}
