import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useAuth } from '@/components/auth/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function UniCirclePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);

  useEffect(() => {
    if (user) {
      fetchPosts();
      fetchFriends();
      fetchSuggestedFriends();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      // Fetch posts from friends and public posts
      const { data, error } = await supabase
        .from('social_posts')
        .select(`
          *,
          profiles:user_id (id, name, image)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFriends = async () => {
    try {
      // Fetch accepted connections where user is either requester or addressee
      const { data, error } = await supabase
        .from('social_connections')
        .select(`
          requester_id, 
          addressee_id,
          requester:requester_id (id, name, image),
          addressee:addressee_id (id, name, image)
        `)
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
        .eq('status', 'accepted')
        .limit(10);

      if (error) throw error;

      // Transform data to get friend profiles
      const friendsList = data.map(connection => {
        if (connection.requester_id === user.id) {
          return connection.addressee;
        } else {
          return connection.requester;
        }
      });

      setFriends(friendsList || []);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchSuggestedFriends = async () => {
    try {
      // Simple suggestion algorithm - users from same university
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('university')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      if (userProfile?.university) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('university', userProfile.university)
          .neq('id', user.id)
          .limit(5);

        if (error) throw error;
        setSuggestedFriends(data || []);
      }
    } catch (error) {
      console.error('Error fetching suggested friends:', error);
    }
  };

  const createPost = async () => {
    if (!postContent.trim() || !user) return;

    try {
      const { data, error } = await supabase
        .from('social_posts')
        .insert([
          {
            user_id: user.id,
            content: postContent,
            privacy_level: 'public'
          }
        ])
        .select();

      if (error) throw error;

      // Fetch user profile to add to the post
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('name, image')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Add the new post to the posts array
      const newPost = {
        ...data[0],
        profiles: {
          id: user.id,
          name: profileData.name,
          image: profileData.image
        }
      };

      setPosts([newPost, ...posts]);
      setPostContent('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const likePost = async (postId) => {
    if (!user) return;

    try {
      // Check if user already liked the post
      const { data: existingLike, error: checkError } = await supabase
        .from('social_likes')
        .select('*')
        .eq('content_id', postId)
        .eq('content_type', 'post')
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingLike) {
        // Unlike the post
        const { error: unlikeError } = await supabase
          .from('social_likes')
          .delete()
          .eq('id', existingLike.id);

        if (unlikeError) throw unlikeError;

        // Update post likes count
        const { error: updateError } = await supabase
          .from('social_posts')
          .update({ likes_count: supabase.rpc('decrement', { x: 1 }) })
          .eq('id', postId);

        if (updateError) throw updateError;
      } else {
        // Like the post
        const { error: likeError } = await supabase
          .from('social_likes')
          .insert([
            {
              content_id: postId,
              content_type: 'post',
              user_id: user.id
            }
          ]);

        if (likeError) throw likeError;

        // Update post likes count
        const { error: updateError } = await supabase
          .from('social_posts')
          .update({ likes_count: supabase.rpc('increment', { x: 1 }) })
          .eq('id', postId);

        if (updateError) throw updateError;
      }

      // Refresh posts
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // If user is not logged in, show welcome page
  if (!user) {
    return (
      <div className="container py-8 md:py-12 pattern-container">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">UniCircle Community</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect with students who share your interests, join study groups, and build your university network.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Study Groups</CardTitle>
                <CardDescription>
                  Join or create subject-specific study groups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Connect with other students taking the same courses. Share notes, practice together, and improve your academic performance.</p>
                <Button className="w-full">Browse Study Groups</Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Interest Circles</CardTitle>
                <CardDescription>
                  Find students who share your hobbies and interests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">From photography to debate clubs, gaming to hiking - discover communities based on shared passions.</p>
                <Button className="w-full">Explore Interests</Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Campus Events</CardTitle>
                <CardDescription>
                  Never miss important events on your campus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Stay updated on workshops, seminars, social gatherings and academic events at your university.</p>
                <Button className="w-full">View Calendar</Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Mentorship Connections</CardTitle>
                <CardDescription>
                  Connect with senior students for guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Get advice on courses, career paths, and university life from experienced students who've been in your shoes.</p>
                <Button className="w-full">Find a Mentor</Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 text-center">
            <Card className="glass-card p-6 max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>Ready to join UniCircle?</CardTitle>
                <CardDescription>
                  Create your profile to personalize your experience and start connecting with other students.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                  <Button size="lg" asChild>
                    <Link href="/signup">Create Account</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-8 pattern-container">
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="feed" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="w-full max-w-md grid grid-cols-3">
              <TabsTrigger value="feed">Feed</TabsTrigger>
              <TabsTrigger value="friends">Friends</TabsTrigger>
              <TabsTrigger value="discover">Discover</TabsTrigger>
            </TabsList>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <div className="hidden lg:block">
              <Card className="glass-card sticky top-20">
                <CardHeader>
                  <CardTitle className="text-lg">My Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-20 w-20 mb-2">
                      <AvatarImage src={user?.user_metadata?.avatar_url || '/placeholder-user.png'} />
                      <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg">{user?.user_metadata?.full_name || 'Student'}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="text-center">
                      <p className="font-bold">{friends.length}</p>
                      <p className="text-muted-foreground">Friends</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">{posts.filter(post => post.user_id === user.id).length}</p>
                      <p className="text-muted-foreground">Posts</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">0</p>
                      <p className="text-muted-foreground">Groups</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/profile">View Profile</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <TabsContent value="feed" className="space-y-6 mt-0">
                {/* Create Post */}
                <Card className="glass-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Create Post</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={user?.user_metadata?.avatar_url || '/placeholder-user.png'} />
                        <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea 
                          placeholder="What's on your mind?" 
                          className="mb-3"
                          value={postContent}
                          onChange={(e) => setPostContent(e.target.value)}
                        />
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Photo
                            </Button>
                            <Button variant="outline" size="sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Video
                            </Button>
                          </div>
                          <Button onClick={createPost} disabled={!postContent.trim()}>Post</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts Feed */}
                {isLoading ? (
                  <div className="text-center py-10">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading posts...</p>
                  </div>
                ) : posts.length === 0 ? (
                  <Card className="glass-card">
                    <CardContent className="text-center py-10">
                      <p className="text-muted-foreground">No posts yet. Be the first to post!</p>
                    </CardContent>
                  </Card>
                ) : (
                  posts.map((post) => (
                    <Card key={post.id} className="glass-card">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={post.profiles?.image || '/placeholder-user.png'} />
                              <AvatarFallback>{post.profiles?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{post.profiles?.name || 'Anonymous'}</h3>
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
                            {post.media_urls.map((url, index) => (
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
                          <Button variant="ghost" size="sm" onClick={() => likePost(post.id)}>
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
              </TabsContent>

              <TabsContent value="friends" className="space-y-6 mt-0">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">My Friends</CardTitle>
                    <CardDescription>Connect with your university network</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {friends.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">You haven't connected with any friends yet.</p>
                        <Button className="mt-2" onClick={() => setActiveTab('discover')}>Find Friends</Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {friends.map((friend) => (
                          <div key={friend.id} className="flex items-center gap-3 p-3 border rounded-lg">
                            <Avatar>
                              <AvatarImage src={friend.image || '/placeholder-user.png'} />
                              <AvatarFallback>{friend.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold">{friend.name}</h3>
                              <p className="text-xs text-muted-foreground">Friend</p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/unicircle/profile/${friend.id}`}>View</Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discover" className="space-y-6 mt-0">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Find Friends</CardTitle>
                    <CardDescription>Discover students from your university</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Input placeholder="Search for students..." />
                    </div>
                    
                    <h3 className="font-semibold mb-3">Suggested Friends</h3>
                    {suggestedFriends.length === 0 ? (
                      <p className="text-muted-foreground text-center py-2">No suggestions available</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {suggestedFriends.map((person) => (
                          <div key={person.id} className="flex items-center gap-3 p-3 border rounded-lg">
                            <Avatar>
                              <AvatarImage src={person.image || '/placeholder-user.png'} />
                              <AvatarFallback>{person.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold">{person.name}</h3>
                              <p className="text-xs text-muted-foreground">{person.university}</p>
                            </div>
                            <Button size="sm">Connect</Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>

            {/* Right Sidebar */}
            <div className="hidden lg:block">
              <Card className="glass-card sticky top-20">
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-primary/10 text-primary rounded-md p-2 text-center">
                        <div className="text-xs">APR</div>
                        <div className="text-lg font-bold">15</div>
                      </div>
                      <div>
                        <h4 className="font-semibold">End of Semester Party</h4>
                        <p className="text-xs text-muted-foreground">Student Union, 7:00 PM</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">Interested</Button>
                      <Button size="sm" className="flex-1">Going</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-primary/10 text-primary rounded-md p-2 text-center">
                        <div className="text-xs">APR</div>
                        <div className="text-lg font-bold">20</div>
                      </div>
                      <div>
                        <h4 className="font-semibold">Career Fair</h4>
                        <p className="text-xs text-muted-foreground">Main Hall, 10:00 AM</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">Interested</Button>
                      <Button size="sm" className="flex-1">Going</Button>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/events">View All Events</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
