import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, UserProfile, AuthError } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: Partial<UserProfile>) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: AuthError | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for active session on mount
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          setUser(null);
        } else if (session) {
          const { data: userData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching user profile:', profileError);
          } else if (userData) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: userData.name,
              university: userData.university,
              studentId: userData.student_id,
              course: userData.course,
              yearOfStudy: userData.year_of_study,
              bio: userData.bio,
              image: userData.image,
              createdAt: userData.created_at,
              updatedAt: userData.updated_at
            });
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Fetch user profile after sign in
          const { data: userData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching user profile:', profileError);
          } else if (userData) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: userData.name,
              university: userData.university,
              studentId: userData.student_id,
              course: userData.course,
              yearOfStudy: userData.year_of_study,
              bio: userData.bio,
              image: userData.image,
              createdAt: userData.created_at,
              updatedAt: userData.updated_at
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    checkSession();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData?: Partial<UserProfile>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        // Create user profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              name: userData?.name || null,
              university: userData?.university || null,
              student_id: userData?.studentId || null,
              course: userData?.course || null,
              year_of_study: userData?.yearOfStudy || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          return { error: { message: 'Failed to create user profile' } };
        }
      }

      toast.success('Account created! Please check your email to verify your account.');
      return { error: null };
    } catch (err) {
      console.error('Sign up error:', err);
      return { error: { message: 'An unexpected error occurred' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      toast.success('Signed in successfully!');
      router.push('/dashboard');
      return { error: null };
    } catch (err) {
      console.error('Sign in error:', err);
      return { error: { message: 'An unexpected error occurred' } };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push('/');
      toast.success('Signed out successfully');
    } catch (err) {
      console.error('Sign out error:', err);
      toast.error('Failed to sign out');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { error };
      }

      toast.success('Password reset instructions sent to your email');
      return { error: null };
    } catch (err) {
      console.error('Reset password error:', err);
      return { error: { message: 'An unexpected error occurred' } };
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) {
      return { error: { message: 'You must be logged in to update your profile' } };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          university: data.university,
          student_id: data.studentId,
          course: data.course,
          year_of_study: data.yearOfStudy,
          bio: data.bio,
          image: data.image,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        return { error: { message: 'Failed to update profile' } };
      }

      // Update local user state
      setUser({
        ...user,
        ...data,
        updatedAt: new Date().toISOString()
      });

      toast.success('Profile updated successfully');
      return { error: null };
    } catch (err) {
      console.error('Update profile error:', err);
      return { error: { message: 'An unexpected error occurred' } };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
