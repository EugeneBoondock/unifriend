import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useAuth } from '@/components/auth/AuthContext';

export default function UniCircleProfilePage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [profile, setProfile] = React.useState<any>(null);
  const [posts, setPosts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [connectionStatus, setConnectionStatus] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    if (params.id) {
      fetchProfile();
      fetchPosts();
      if (user) {
        checkConnectionStatus();
      }
    }
  }, [params.id, user]);

  const fetchProfile = async () => {
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .eq('user_id', params.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const checkConnectionStatus = async () => {
    if (!user) return;
    
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      
      // Check if there's a connection where user is requester
      const { data: asRequester, error: requesterError } = await supabase
        .from('social_connections')
        .select('status')
        .eq('requester_id', user.id)
        .eq('addressee_id', params.id)
        .maybeSingle();

      if (requesterError) throw requesterError;

      if (asRequester) {
        setConnectionStatus(asRequester.status);
        return;
      }

      // Check if there's a connection where user is addressee
      const { data: asAddressee, error: addresseeError } = await supabase
        .from('social_connections')
        .select('status')
        .eq('requester_id', params.id)
        .eq('addressee_id', user.id)
        .maybeSingle();

      if (addresseeError) throw addresseeError;

      if (asAddressee) {
        setConnectionStatus(asAddressee.status);
        return;
      }

      // No connection found
      setConnectionStatus(null);
    } catch (error) {
      console.error('Error checking connection status:', error);
    }
  };

  const sendConnectionRequest = async () => {
    if (!user) return;
    
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      
      const { error } = await supabase
        .from('social_connections')
        .insert([
          {
            requester_id: user.id,
            addressee_id: params.id,
            status: 'pending'
          }
        ]);

      if (error) throw error;
      
      setConnectionStatus('pending');
    } catch (error) {
      console.error('Error sending connection request:', error);
    }
  };

  const acceptConnectionRequest = async () => {
    if (!user) return;
    
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      
      const { error } = await supabase
        .from('social_connections')
        .update({ status: 'accepted' })
        .eq('requester_id', params.id)
        .eq('addressee_id', user.id);

      if (error) throw error;
      
      setConnectionStatus('accepted');
    } catch (error) {
      console.error('Error accepting connection request:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="container py-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
        <p className="text-muted-foreground mb-6">The profile you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/unicircle">Back to UniCircle</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-8 pattern-container">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="glass-card mb-6">
          <div className="h-48 bg-gradient-to-r from-primary/20 to-primary/5 relative">
            {profile.cover_image && (
              <img 
                src={profile.cover_image} 
                alt="Cover" 
                className="w-full h-full object-cover absolute inset-0"
              />
            )}
          </div>
          <div className="px-6 pb-6 relative">
            <Avatar className="h-24 w-24 absolute -top-12 border-4 border-background">
              <AvatarImage src={profile.image || '/placeholder-user.png'} />
              <AvatarFallback>{profile.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            
            <div className="pt-16 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-muted-foreground">{profile.university || 'University Student'}</p>
              </div>
              
              {user && user.id !== params.id && (
                <div>
                  {connectionStatus === 'accepted' ? (
                    <Badge className="px-3 py-1">Friends</Badge>
                  ) : connectionStatus === 'pending' ? (
                    <Button variant="outline" disabled>Request Sent</Button>
                  ) : (
                    <Button onClick={sendConnectionRequest}>Connect</Button>
                  )}
                </div>
              )}
            </div>
            
            {profile.bio && (
              <div className="mt-4">
                <h2 className="text-sm font-semibold text-muted-foreground mb-1">About</h2>
                <p>{profile.bio}</p>
              </div>
            )}
            
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-2 bg-primary/5 rounded-md">
                <p className="text-lg font-bold">{posts.length}</p>
                <p className="text-xs text-muted-foreground">Posts</p>
              </div>
              <div className="text-center p-2 bg-primary/5 rounded-md">
                <p className="text-lg font-bold">0</p>
                <p className="text-xs text-muted-foreground">Friends</p>
              </div>
              <div className="text-center p-2 bg-primary/5 rounded-md">
                <p className="text-lg font-bold">0</p>
                <p className="text-xs text-muted-foreground">Photos</p>
              </div>
              <div className="text-center p-2 bg-primary/5 rounded-md">
                <p className="text-lg font-bold">0</p>
                <p className="text-xs text-muted-foreground">Groups</p>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Posts Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Posts</h2>
          
          {posts.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="text-center py-10">
                <p className="text-muted-foreground">No posts yet.</p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="glass-card">
                <CardHeader className="pb-3">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={profile.image || '/placeholder-user.png'} />
                        <AvatarFallback>{profile.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{profile.name}</h3>
                        <p className="text-xs text-muted-foreground">{formatDate(post.created_at)}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{post.privacy_level}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{post.content}</p>
                  {post.media_urls && post.media_urls.length > 0 && (
                    <div className="mt-3 grid gap-2">
                      {post.media_urls.map((url: string, index: number) => (
                        <img 
                          key={index} 
                          src={url} 
                          alt="Post media" 
                          className="rounded-md max-h-96 w-auto object-contain"
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-3">
                  <div className="flex justify-between w-full">
                    <Button variant="ghost" size="sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {post.likes_count || 0} Likes
                    </Button>
                    <Button variant="ghost" size="sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {post.comments_count || 0} Comments
                    </Button>
                    <Button variant="ghost" size="sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
