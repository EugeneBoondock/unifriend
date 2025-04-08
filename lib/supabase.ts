import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserCredentials = {
  email: string;
  password: string;
};

export type UserRegistration = UserCredentials & {
  name?: string;
  university?: string;
  studentId?: string;
  course?: string;
  yearOfStudy?: number;
};

export type UserProfile = {
  id: string;
  email: string;
  name?: string;
  university?: string;
  studentId?: string;
  course?: string;
  yearOfStudy?: number;
  bio?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthError = {
  message: string;
};

export type AuthResponse = {
  user: UserProfile | null;
  error: AuthError | null;
};
