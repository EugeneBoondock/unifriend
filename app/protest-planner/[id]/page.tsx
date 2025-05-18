import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useAuth } from '@/components/auth/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function ProtestDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [protest, setProtest] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [isParticipating, setIsParticipating] = useState(false);
  const [participantLoading, setParticipantLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (params.id) {
      fetchProtestDetails();
    }
  }, [params.id, user]);

  const fetchProtestDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('protests')
        .select(`
          *,
          profiles:organizer_id (id, name, image, email)
        `)
        .eq('id', params.id)
        .single();
      
      if (error) throw error;
      
      setProtest(data);
      
      // Fetch participants
      const { data: participantsData, error: participantsError } = await supabase
        .from('protest_participants')
        .select(`
          *,
          profiles:user_id (id, name, image)
        `)
        .eq('protest_id', params.id);
      
      if (participantsError) throw participantsError;
      
      setParticipants(participantsData || []);
      
      // Check if current user is participating
      if (user) {
        const isUserParticipating = participantsData?.some(p => p.user_id === user.id) || false;
        setIsParticipating(isUserParticipating);
      }
      
      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('protest_comments')
        .select(`
          *,
          profiles:user_id (id, name, image)
        `)
        .eq('protest_id', params.id)
        .order('created_at', { ascending: true });
      
      if (commentsError) throw commentsError;
      
      setComments(commentsData || []);
    } catch (error) {
      console.error('Error fetching protest details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinProtest = async () => {
    if (!user || !protest) return;
    
    setParticipantLoading(true);
    
    try {
      if (isParticipating) {
        // Leave the protest
        const { data: participantData, error: findError } = await supabase
          .from('protest_participants')
          .select('id')
          .eq('protest_id', params.id)
          .eq('user_id', user.id)
          .single();
        
        if (findError) throw findError;
        
        const { error: deleteError } = await supabase
          .from('protest_participants')
          .delete()
          .eq('id', participantData.id);
        
        if (deleteError) throw deleteError;
        
        // Update local state
        setIsParticipating(false);
        setParticipants(participants.filter(p => p.user_id !== user.id));
      } else {
        // Join the protest
        const { data, error } = await supabase
          .from('protest_participants')
          .insert([
            { protest_id: params.id, user_id: user.id }
          ])
          .select(`
            *,
            profiles:user_id (id, name, image)
          `)
          .single();
        
        if (error) throw error;
        
        // Update local state
        setIsParticipating(true);
        setParticipants([...participants, data]);
        
        // Send notification to organizer
        await supabase
          .from('notifications')
          .insert([
            {
              user_id: protest.organizer_id,
              type: 'protest_join',
              content: `${user.name || 'Someone'} joined your protest "${protest.title}"`,
              link: `/protest-planner/${params.id}`,
              is_read: false
            }
          ]);
      }
    } catch (error) {
      console.error('Error joining/leaving protest:', error);
    } finally {
      setParticipantLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !protest || !newComment.trim()) return;
    
    setCommentLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('protest_comments')
        .insert([
          {
            protest_id: params.id,
            user_id: user.id,
            content: newComment
          }
        ])
        .select(`
          *,
          profiles:user_id (id, name, image)
        `)
        .single();
      
      if (error) throw error;
      
      // Update local state
      setComments([...comments, data]);
      setNewComment('');
      
      // Send notification to organizer if commenter is not the organizer
      if (user.id !== protest.organizer_id) {
        await supabase
          .from('notifications')
          .insert([
            {
              user_id: protest.organizer_id,
              type: 'protest_comment',
              content: `${user.name || 'Someone'} commented on your protest "${protest.title}"`,
              link: `/protest-planner/${params.id}?tab=discussion`,
              is_read: false
            }
          ]);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isPastEvent = () => {
    if (!protest) return false;
    const protestDate = new Date(protest.date);
    return protestDate < new Date();
  };

  if (isLoading) {
    return (
      <div className="container py-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading protest details...</p>
      </div>
    );
  }

  if (!protest) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Protest Not Found</h1>
        <p className="text-muted-foreground mb-6">The protest you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/protest-planner">Back to Protests</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-8 pattern-container">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild className="mb-4">
            <Link href="/protest-planner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Protests
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold">{protest.title}</h1>
            <Badge className={`${protest.status === 'Approved' ? 'bg-green-500' : protest.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'}`}>
              {protest.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">{protest.category} • {protest.location}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="participants">Participants ({participants.length})</TabsTrigger>
                <TabsTrigger value="discussion">Discussion ({comments.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6 mt-6">
                <Card className="glass-card">
                  {protest.image_url && (
                    <div className="w-full h-64 overflow-hidden">
                      <img 
                        src={protest.image_url} 
                        alt={protest.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h3 className="font-semibold mb-1">Date</h3>
                        <p>{formatDate(protest.date)}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Time</h3>
                        <p>{formatTime(protest.date)}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Meeting Point</h3>
                        <p>{protest.meeting_point}</p>
                      </div>
                      {protest.expected_duration && (
                        <div>
                          <h3 className="font-semibold mb-1">Expected Duration</h3>
                          <p>{protest.expected_duration}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-1">Description</h3>
                      <p className="text-sm whitespace-pre-line">{protest.description}</p>
                    </div>
                    
                    {protest.safety_measures && (
                      <div>
                        <h3 className="font-semibold mb-1">Safety Measures</h3>
                        <p className="text-sm whitespace-pre-line">{protest.safety_measures}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 pt-2 border-t">
                      <Avatar>
                        <AvatarImage src={protest.profiles?.image || '/placeholder-user.png'} />
                        <AvatarFallback>{protest.profiles?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{protest.profiles?.name}</p>
                        <p className="text-xs text-muted-foreground">Organizer</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Important Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded-md">
                      <h3 className="font-medium mb-2">Before Attending:</h3>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                        <li>Bring water and wear comfortable clothing</li>
                        <li>Know your rights and emergency contacts</li>
                        <li>Follow organizer instructions during the protest</li>
                        <li>Be respectful of others and property</li>
                        <li>Consider carpooling or using public transportation</li>
                      </ul>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-md">
                      <h3 className="font-medium mb-2">University Policy:</h3>
                      <p className="text-sm text-muted-foreground">
                        All protests must remain peaceful and comply with university policies. Disruption of classes, 
                        damage to property, or threatening behavior may result in disciplinary action. The university 
                        respects the right to free speech and peaceful assembly.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="participants" className="space-y-6 mt-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Participants ({participants.length})</CardTitle>
                    <CardDescription>
                      People who have joined this protest
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {participants.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground mb-4">
                          No one has joined this protest yet. Be the first to join!
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {participants.map((participant) => (
                          <div key={participant.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                            <Avatar>
                              <AvatarImage src={participant.profiles?.image || '/placeholder-user.png'} />
                              <AvatarFallback>{participant.profiles?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="truncate">
                              <p className="font-medium truncate">{participant.profiles?.name}</p>
                              {participant.user_id === protest.organizer_id && (
                                <p className="text-xs text-primary">Organizer</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="discussion" className="space-y-6 mt-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Discussion</CardTitle>
                    <CardDescription>
                      Ask questions and share information about this protest
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {user ? (
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Write a comment or ask a question..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          rows={3}
                        />
                        <div className="flex justify-end">
                          <Button 
                            onClick={handleSubmitComment} 
                            disabled={!newComment.trim() || commentLoading}
                          >
                            {commentLoading ? (
                              <>
                                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                                Posting...
                              </>
                            ) : 'Post Comment'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground mb-4">
                          You need to sign in to join the discussion
                        </p>
                        <Button asChild>
                          <Link href="/signin">Sign In</Link>
                        </Button>
                      </div>
                    )}
                    
                    <div className="border-t pt-4">
                      {comments.length === 0 ? (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">
                            No comments yet. Be the first to start the discussion!
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarImage src={comment.profiles?.image || '/placeholder-user.png'} />
                                <AvatarFallback>{comment.profiles?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm">{comment.profiles?.name}</p>
                                    {comment.user_id === protest.organizer_id && (
                                      <Badge variant="outline" className="text-xs">Organizer</Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">{formatDateTime(comment.created_at)}</p>
                                </div>
                                <p className="text-sm">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Protest Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">Date:</span>
                  </div>
                  <span>{formatDate(protest.date)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Time:</span>
                  </div>
                  <span>{formatTime(protest.date)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-medium">Participants:</span>
                  </div>
                  <span>{participants.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Status:</span>
                  </div>
                  <Badge className={`${protest.status === 'Approved' ? 'bg-green-500' : protest.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                    {protest.status}
                  </Badge>
                </div>
                
                {protest.status === 'Approved' && !isPastEvent() && (
                  <Button 
                    className="w-full mt-4" 
                    variant={isParticipating ? "secondary" : "default"}
                    onClick={handleJoinProtest}
                    disabled={participantLoading}
                  >
                    {participantLoading ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                        {isParticipating ? 'Leaving...' : 'Joining...'}
                      </>
                    ) : (
                      isParticipating ? 'Leave Protest' : 'Join Protest'
                    )}
                  </Button>
                )}
                
                {protest.status === 'Pending' && (
                  <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md text-sm mt-4">
                    This protest is awaiting approval from moderators. Once approved, it will be visible to all users.
                  </div>
                )}
                
                {isPastEvent() && (
                  <div className="bg-muted p-3 rounded-md text-sm mt-4">
                    This protest has already taken place.
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Contact Organizer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={protest.profiles?.image || '/placeholder-user.png'} />
                    <AvatarFallback>{protest.profiles?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{protest.profiles?.name}</p>
                    <p className="text-xs text-muted-foreground">Organizer</p>
                  </div>
                </div>
                
                {user ? (
                  <div className="space-y-2">
                    {protest.profiles?.email && (
                      <Button variant="outline" className="w-full flex items-center gap-2" asChild>
                        <a href={`mailto:${protest.profiles.email}?subject=Regarding: ${protest.title}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Email Organizer
                        </a>
                      </Button>
                    )}
                    <Button 
                      className="w-full" 
                      onClick={() => setActiveTab('discussion')}
                    >
                      Post in Discussion
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-muted-foreground mb-4 text-sm">
                      Sign in to contact the organizer
                    </p>
                    <Button asChild size="sm">
                      <Link href="/signin">Sign In</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Safety Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Stay with the group and follow organizer instructions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Bring water and dress appropriately for weather</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Have emergency contacts saved on your phone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Be aware of your surroundings at all times</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
