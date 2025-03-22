"use client";

import { cn } from "@/lib/utils";

interface UfLogoProps {
  className?: string;
  size?: number;
}

export function UfLogo({ className, size = 40 }: UfLogoProps) {
  return (
    <div className={cn("flex-shrink-0", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="min-w-[40px]"
      >
        <circle cx="20" cy="20" r="20" fill="#513c64"/>
        <path
          d="M13 15.5V25H15.5V20.8H19V25H21.5V15.5H19V18.5H15.5V15.5H13Z"
          fill="white"
        />
        <path
          d="M27 15.5H24.5V25H27V22.3H29.5V19.8H27V18H30V15.5H27Z"
          fill="white"
        />
      </svg>
    </div>
  );
}
