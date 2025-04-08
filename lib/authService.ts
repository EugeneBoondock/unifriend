import { User, AuthError, UserCredentials, UserRegistration } from '@/lib/types';
import supabase from '@/lib/supabaseClient';

// Authentication service functions
export const signUp = async (
  email: string, 
  password: string, 
  userData?: Partial<User>
): Promise<{ user: User | null; error: AuthError | null }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { user: null, error: { message: error.message } };
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
        return { user: null, error: { message: 'Failed to create user profile' } };
      }

      return { 
        user: {
          id: data.user.id,
          email: data.user.email || '',
          name: userData?.name,
          university: userData?.university,
          studentId: userData?.studentId,
          course: userData?.course,
          yearOfStudy: userData?.yearOfStudy,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, 
        error: null 
      };
    }

    return { user: null, error: { message: 'Failed to create user' } };
  } catch (err) {
    console.error('Sign up error:', err);
    return { user: null, error: { message: 'An unexpected error occurred' } };
  }
};

export const signIn = async (
  email: string, 
  password: string
): Promise<{ user: User | null; error: AuthError | null }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: { message: error.message } };
    }

    if (data.user) {
      // Fetch user profile
      const { data: userData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        return { user: null, error: { message: 'Failed to fetch user profile' } };
      }

      return { 
        user: {
          id: data.user.id,
          email: data.user.email || '',
          name: userData.name,
          university: userData.university,
          studentId: userData.student_id,
          course: userData.course,
          yearOfStudy: userData.year_of_study,
          bio: userData.bio,
          image: userData.image,
          createdAt: userData.created_at,
          updatedAt: userData.updated_at
        }, 
        error: null 
      };
    }

    return { user: null, error: { message: 'Failed to sign in' } };
  } catch (err) {
    console.error('Sign in error:', err);
    return { user: null, error: { message: 'An unexpected error occurred' } };
  }
};

export const signOut = async (): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: { message: error.message } };
    }

    return { error: null };
  } catch (err) {
    console.error('Sign out error:', err);
    return { error: { message: 'An unexpected error occurred' } };
  }
};

export const resetPassword = async (email: string): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return { error: { message: error.message } };
    }

    return { error: null };
  } catch (err) {
    console.error('Reset password error:', err);
    return { error: { message: 'An unexpected error occurred' } };
  }
};

export const updateUserPassword = async (password: string): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      return { error: { message: error.message } };
    }

    return { error: null };
  } catch (err) {
    console.error('Update password error:', err);
    return { error: { message: 'An unexpected error occurred' } };
  }
};

export const getCurrentUser = async (): Promise<{ user: User | null; error: AuthError | null }> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      return { user: null, error: { message: error.message } };
    }

    if (!session) {
      return { user: null, error: null };
    }

    // Fetch user profile
    const { data: userData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
      
    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return { user: null, error: { message: 'Failed to fetch user profile' } };
    }

    return { 
      user: {
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
      }, 
      error: null 
    };
  } catch (err) {
    console.error('Get current user error:', err);
    return { user: null, error: { message: 'An unexpected error occurred' } };
  }
};

export const updateUserProfile = async (
  userId: string, 
  data: Partial<User>
): Promise<{ error: AuthError | null }> => {
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
      .eq('id', userId);

    if (error) {
      return { error: { message: 'Failed to update profile' } };
    }

    return { error: null };
  } catch (err) {
    console.error('Update profile error:', err);
    return { error: { message: 'An unexpected error occurred' } };
  }
};
