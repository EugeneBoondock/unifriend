"use client";
import { ReactNode } from "react";
import { AuthProvider as SupabaseAuthProvider } from "@/components/auth/AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>;
}
