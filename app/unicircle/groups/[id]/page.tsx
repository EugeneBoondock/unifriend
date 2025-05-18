import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useAuth } from '@/components/auth/AuthContext';

export default function GroupDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [group, setGroup] = React.useState<any>(null);
  const [members, setMembers] = React.useState<any[]>([]);
  const [discussions, setDiscussions] = React.useState<any[]>([]);
  const [resources, setResources] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isMember, setIsMember] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('discussions');
  const [newPost, setNewPost] = React.useState('');
  const [postLoading, setPostLoading] = React.useState(false);

  React.useEffect(() => {
    if (params.id) {
      fetchGroupDetails();
      fetchMembers();
      fetchDiscussions();
      fetchResources();
      if (user) {
        checkMembership();
      }
    }
  }, [params.id, user]);

  const fetchGroupDetails = async () => {
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      
      const { data, error } = await supabase
        .from('study_groups')
        .select(`
          *,
          profiles:created_by (id, name, image)
        `)
        .eq('id', params.id)
        .single();
      
      if (error) throw error;
      
      setGroup(data);
    } catch (error) {
      console.error('Error fetching group details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      
      const { data, error } = await supabase
        .from('study_group_members')
        .select(`
          user_id,
          is_admin,
          joined_at,
          profiles:user_id (id, name, image, university)
        `)
        .eq('group_id', params.id)
        .order('is_admin', { ascending: false });
      
      if (error) throw error;
      
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchDiscussions = async () => {
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      
      const { data, error } = await supabase
        .from('group_discussions')
        .select(`
          *,
          profiles:user_id (id, name, image)
        `)
        .eq('group_id', params.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setDiscussions(data || []);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    }
  };

  const fetchResources = async () => {
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      
      const { data, error } = await supabase
        .from('group_resources')
        .select(`
          *,
          profiles:user_id (id, name, image)
        `)
        .eq('group_id', params.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const checkMembership = async () => {
    if (!user) return;
    
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      
      const { data, error } = await supabase
        .from('study_group_members')
        .select('is_admin')
        .eq('group_id', params.id)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setIsMember(true);
        setIsAdmin(data.is_admin);
      } else {
        setIsMember(false);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking membership:', error);
    }
  };

  const joinGroup = async () => {
    if (!user) return;
    
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      
      // Add user as a member
      const { error: memberError } = await supabase
        .from('study_group_members')
        .insert([
          {
            group_id: params.id,
            user_id: user.id,
            is_admin: false
          }
        ]);
      
      if (memberError) throw memberError;
      
      // Increment member count
      const { error: updateError } = await supabase
        .from('study_groups')
        .update({
          member_count: supabase.rpc('increment', { x: 1 })
        })
        .eq('id', params.id);
      
      if (updateError) throw updateError;
      
      // Update local state
      setIsMember(true);
      fetchMembers();
      fetchGroupDetails();
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const leaveGroup = async () => {
    if (!user) return;
    
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      
      // Remove user from members
      const { error: memberError } = await supabase
        .from('study_group_members')
        .delete()
        .eq('group_id', params.id)
        .eq('user_id', user.id);
      
      if (memberError) throw memberError;
      
      // Decrement member count
      const { error: updateError } = await supabase
        .from('study_groups')
        .update({
          member_count: supabase.rpc('decrement', { x: 1 })
        })
        .eq('id', params.id);
      
      if (updateError) throw updateError;
      
      // Update local state
      setIsMember(false);
      setIsAdmin(false);
      fetchMembers();
      fetchGroupDetails();
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  const createPost = async () => {
    if (!user || !isMember || !newPost.trim()) return;
    
    setPostLoading(true);
    
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      
      const { data, error } = await supabase
        .from('group_discussions')
        .insert([
          {
            group_id: params.id,
            user_id: user.id,
            content: newPost,
            likes_count: 0,
            comments_count: 0
          }
        ])
        .select(`
          *,
          profiles:user_id (id, name, image)
        `)
        .single();
      
      if (error) throw error;
      
      // Add new post to discussions
      setDiscussions([data, ...discussions]);
      setNewPost('');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setPostLoading(false);
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
        <p className="mt-2 text-muted-foreground">Loading group details...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Group Not Found</h1>
        <p className="text-muted-foreground mb-6">The group you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/unicircle/groups">Back to Groups</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-8 pattern-container">
      <div className="max-w-6xl mx-auto">
        {/* Group Header */}
        <Card className="glass-card mb-6">
          <div className="h-48 bg-gradient-to-r from-primary/20 to-primary/5 relative">
            {/* Group banner would go here */}
          </div>
          <div className="px-6 pb-6 relative">
            <div className="h-20 w-20 bg-primary/10 rounded-full absolute -top-10 border-4 border-background flex items-center justify-center">
              <span className="text-2xl font-bold">{group.name.charAt(0)}</span>
            </div>
            
            <div className="pt-14 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">{group.name}</h1>
                <p className="text-muted-foreground">{group.university} • {group.course}</p>
              </div>
              
              {user && (
                <div>
                  {isMember ? (
                    <Button variant="outline" onClick={leaveGroup}>Leave Group</Button>
                  ) : (
                    <Button onClick={joinGroup}>Join Group</Button>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-muted-foreground mb-1">About</h2>
              <p>{group.description}</p>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>{group.member_count} members</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Created {formatDate(group.created_at)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Created by {group.profiles?.name}</span>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Group Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Members */}
          <div className="lg:col-span-1">
            <Card className="glass-card sticky top-20">
              <CardHeader>
                <CardTitle className="text-lg">Members ({group.member_count})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {members.slice(0, 10).map((member) => (
                    <div key={member.user_id} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.profiles?.image || '/placeholder-user.png'} />
                        <AvatarFallback>{member.profiles?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{member.profiles?.name}</h3>
                          {member.is_admin && (
                            <Badge variant="outline" className="text-xs">Admin</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{member.profiles?.university}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {members.length > 10 && (
                  <Button variant="outline" className="w-full" size="sm">
                    View All Members
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="discussions" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-6">
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>
              
              <TabsContent value="discussions" className="mt-0 space-y-6">
                {/* Create Post */}
                {isMember && (
                  <Card className="glass-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Start a Discussion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-3">
                        <Avatar>
                          <AvatarImage src={user?.user_metadata?.avatar_url || '/placeholder-user.png'} />
                          <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Textarea 
                            placeholder="Share something with the group..." 
                            className="mb-3"
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
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
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                Link
                              </Button>
                            </div>
                            <Button 
                              onClick={createPost} 
                              disabled={!newPost.trim() || postLoading}
                            >
                              {postLoading ? (
                                <>
                                  <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                                  Posting...
                                </>
                              ) : 'Post'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Discussions */}
                {discussions.length === 0 ? (
                  <Card className="glass-card">
                    <CardContent className="text-center py-10">
                      <h3 className="text-lg font-semibold mb-2">No discussions yet</h3>
                      <p className="text-muted-foreground mb-6">Be the first to start a discussion in this group</p>
                      {isMember ? (
                        <Button onClick={() => document.querySelector('textarea')?.focus()}>
                          Start Discussion
                        </Button>
                      ) : (
                        <Button onClick={joinGroup}>Join Group to Participate</Button>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  discussions.map((discussion) => (
                    <Card key={discussion.id} className="glass-card">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={discussion.profiles?.image || '/placeholder-user.png'} />
                            <AvatarFallback>{discussion.profiles?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{discussion.profiles?.name}</h3>
                            <p className="text-xs text-muted-foreground">{formatDate(discussion.created_at)}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-line">{discussion.content}</p>
                        {discussion.media_urls && discussion.media_urls.length > 0 && (
                          <div className="mt-3 grid gap-2">
                            {discussion.media_urls.map((url: string, index: number) => (
                              <img 
                                key={index} 
                                src={url} 
                                alt="Discussion media" 
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
                            {discussion.likes_count || 0} Likes
                          </Button>
                          <Button variant="ghost" size="sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {discussion.comments_count || 0} Comments
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
              
              <TabsContent value="resources" className="mt-0">
                <Card className="glass-card">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Group Resources</CardTitle>
                      {isMember && (
                        <Button size="sm" asChild>
                          <Link href={`/unicircle/groups/${params.id}/resources/add`}>
                            Add Resource
                          </Link>
                        </Button>
                      )}
                    </div>
                    <CardDescription>
                      Study materials shared by group members
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {resources.length === 0 ? (
                      <div className="text-center py-6">
                        <h3 className="text-lg font-semibold mb-2">No resources yet</h3>
                        <p className="text-muted-foreground mb-6">Share study materials with your group members</p>
                        {isMember ? (
                          <Button asChild>
                            <Link href={`/unicircle/groups/${params.id}/resources/add`}>
                              Add First Resource
                            </Link>
                          </Button>
                        ) : (
                          <Button onClick={joinGroup}>Join Group to Share Resources</Button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {resources.map((resource) => (
                          <div key={resource.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">{resource.title}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                                <div className="flex items-center gap-3 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Avatar className="h-5 w-5">
                                      <AvatarImage src={resource.profiles?.image || '/placeholder-user.png'} />
                                      <AvatarFallback>{resource.profiles?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <span>{resource.profiles?.name}</span>
                                  </div>
                                  <span>•</span>
                                  <span>{formatDate(resource.created_at)}</span>
                                </div>
                              </div>
                              <Badge>{resource.type}</Badge>
                            </div>
                            <div className="mt-4 flex gap-2">
                              <Button size="sm" asChild>
                                <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                                  View
                                </a>
                              </Button>
                              <Button size="sm" variant="outline" asChild>
                                <a href={resource.file_url} download>
                                  Download
                                </a>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="events" className="mt-0">
                <Card className="glass-card">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Group Events</CardTitle>
                      {isMember && (
                        <Button size="sm" asChild>
                          <Link href={`/unicircle/groups/${params.id}/events/create`}>
                            Create Event
                          </Link>
                        </Button>
                      )}
                    </div>
                    <CardDescription>
                      Study sessions and group activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6">
                      <h3 className="text-lg font-semibold mb-2">No events scheduled</h3>
                      <p className="text-muted-foreground mb-6">Plan study sessions and group activities</p>
                      {isMember ? (
                        <Button asChild>
                          <Link href={`/unicircle/groups/${params.id}/events/create`}>
                            Schedule First Event
                          </Link>
                        </Button>
                      ) : (
                        <Button onClick={joinGroup}>Join Group to Create Events</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
