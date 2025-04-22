import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'development') {
    try {
      // Sign out the user with Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: 'Signed out successfully' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Sign out error:', error);
      return NextResponse.json(
        { error: 'An unexpected error occurred' },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: 'ok' },
      { status: 200 }
    );
  }
}
