import { createMiddleware } from 'next-api-middleware';
import { supabase } from '@/lib/supabaseClient';

// Authentication middleware for API routes
export const withAuth = createMiddleware(async (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    
    // Add the user to the request object
    req.user = user;
    
    // Continue to the next middleware or API route handler
    return next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
});

// Client-side authentication check
export const requireAuth = (gssp) => {
  return async (context) => {
    const { req } = context;
    
    // Get the session cookie
    const { data: { session }, error } = await supabase.auth.getSession();
    
    // If no session or error, redirect to login
    if (!session || error) {
      return {
        redirect: {
          destination: '/signin?redirect=' + encodeURIComponent(req.url),
          permanent: false,
        },
      };
    }
    
    // Call the original getServerSideProps
    const gsspData = await gssp(context);
    
    // Add the user to the props
    return {
      ...gsspData,
      props: {
        ...gsspData.props,
        user: session.user,
      },
    };
  };
};

// Authentication hook for client components
export const useRequireAuth = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin?redirect=' + encodeURIComponent(router.asPath));
    }
  }, [user, isLoading, router]);
  
  return { user, isLoading };
};

// Route guard component
export const AuthGuard = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin?redirect=' + encodeURIComponent(router.asPath));
    }
  }, [user, isLoading, router]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return null;
  }
  
  return <>{children}</>;
};
