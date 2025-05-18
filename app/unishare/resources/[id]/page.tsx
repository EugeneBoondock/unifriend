import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useAuth } from '@/components/auth/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function ResourceDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [resource, setResource] = useState<any>(null);
  const [relatedResources, setRelatedResources] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchResourceDetails();
      fetchComments();
      if (user) {
        checkUserRating();
      }
    }
  }, [params.id, user]);

  const fetchResourceDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('shared_resources')
        .select(`
          *,
          profiles:user_id (id, name, image)
        `)
        .eq('id', params.id)
        .single();
      
      if (error) throw error;
      
      setResource(data);
      
      // Fetch related resources
      if (data) {
        const { data: relatedData, error: relatedError } = await supabase
          .from('shared_resources')
          .select(`
            *,
            profiles:user_id (id, name, image)
          `)
          .eq('subject', data.subject)
          .neq('id', params.id)
          .limit(3);
        
        if (relatedError) throw relatedError;
        
        setRelatedResources(relatedData || []);
      }
    } catch (error) {
      console.error('Error fetching resource details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('resource_comments')
        .select(`
          *,
          profiles:user_id (id, name, image)
        `)
        .eq('resource_id', params.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const checkUserRating = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('resource_ratings')
        .select('rating')
        .eq('resource_id', params.id)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setUserRating(data.rating);
      }
    } catch (error) {
      console.error('Error checking user rating:', error);
    }
  };

  const incrementDownloads = async () => {
    try {
      await supabase
        .from('shared_resources')
        .update({ downloads: supabase.rpc('increment', { x: 1 }) })
        .eq('id', params.id);
      
      // Update local state
      setResource({
        ...resource,
        downloads: (resource.downloads || 0) + 1
      });
    } catch (error) {
      console.error('Error incrementing downloads:', error);
    }
  };

  const addComment = async () => {
    if (!user || !newComment.trim()) return;
    
    setCommentLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('resource_comments')
        .insert([
          {
            resource_id: params.id,
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
      
      setComments([data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const rateResource = async (rating: number) => {
    if (!user) return;
    
    try {
      // Check if user already rated
      const { data: existingRating, error: checkError } = await supabase
        .from('resource_ratings')
        .select('*')
        .eq('resource_id', params.id)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingRating) {
        // Update existing rating
        const { error: updateError } = await supabase
          .from('resource_ratings')
          .update({ rating })
          .eq('id', existingRating.id);
        
        if (updateError) throw updateError;
      } else {
        // Create new rating
        const { error: insertError } = await supabase
          .from('resource_ratings')
          .insert([
            {
              resource_id: params.id,
              user_id: user.id,
              rating
            }
          ]);
        
        if (insertError) throw insertError;
      }
      
      // Update resource average rating
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('resource_ratings')
        .select('rating')
        .eq('resource_id', params.id);
      
      if (ratingsError) throw ratingsError;
      
      if (ratingsData && ratingsData.length > 0) {
        const avgRating = ratingsData.reduce((sum, item) => sum + item.rating, 0) / ratingsData.length;
        
        const { error: updateResourceError } = await supabase
          .from('shared_resources')
          .update({ 
            rating: avgRating,
            ratings_count: ratingsData.length
          })
          .eq('id', params.id);
        
        if (updateResourceError) throw updateResourceError;
        
        // Update local state
        setResource({
          ...resource,
          rating: avgRating,
          ratings_count: ratingsData.length
        });
      }
      
      setUserRating(rating);
    } catch (error) {
      console.error('Error rating resource:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="container py-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading resource details...</p>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Resource Not Found</h1>
        <p className="text-muted-foreground mb-6">The resource you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/unishare">Back to UniShare</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-8 pattern-container">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild className="mb-4">
            <Link href="/unishare" legacyBehavior>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Resources
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold">{resource.title}</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">{resource.format}</Badge>
              <Badge variant="secondary" className="text-sm">{resource.subject}</Badge>
            </div>
          </div>
          <p className="text-muted-foreground">{resource.university}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Resource Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resource.description && (
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Description</h3>
                    <p className="text-sm">{resource.description}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-semibold mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags && resource.tags.map((tag: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h3 className="font-semibold mb-1">Format</h3>
                    <p>{resource.format}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">File Size</h3>
                    <p>{formatFileSize(resource.file_size)}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Downloads</h3>
                    <p>{resource.downloads || 0}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Uploaded</h3>
                    <p>{formatDate(resource.created_at)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pt-2">
                  <Avatar>
                    <AvatarImage src={resource.profiles?.image || '/placeholder-user.png'} />
                    <AvatarFallback>{resource.profiles?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{resource.profiles?.name}</p>
                    <p className="text-xs text-muted-foreground">Uploader</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    incrementDownloads();
                    window.open(resource.file_url, '_blank');
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Resource
                </Button>
              </CardFooter>
            </Card>
            
            {/* Rating and Comments */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Ratings & Comments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Rating Section */}
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{resource.rating ? resource.rating.toFixed(1) : '0.0'}</div>
                      <div className="text-xs text-muted-foreground">{resource.ratings_count || 0} ratings</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        {user ? (
                          <div className="space-y-2 w-full">
                            <p className="text-sm font-medium">Your Rating</p>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => rateResource(star)}
                                  className={`h-8 w-8 flex items-center justify-center rounded-md ${
                                    star <= userRating ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'text-muted-foreground bg-muted/50'
                                  }`}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="w-full text-center py-2">
                            <p className="text-sm text-muted-foreground mb-2">Sign in to rate this resource</p>
                            <Button size="sm" asChild>
                              <Link href="/signin">Sign In</Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Comments Section */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Comments ({comments.length})</h3>
                  
                  {user ? (
                    <div className="mb-6">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="mb-2"
                      />
                      <div className="flex justify-end">
                        <Button 
                          onClick={addComment} 
                          disabled={!newComment.trim() || commentLoading}
                          size="sm"
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
                    <div className="text-center py-2 mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Sign in to comment on this resource</p>
                      <Button size="sm" asChild>
                        <Link href="/signin">Sign In</Link>
                      </Button>
                    </div>
                  )}
                  
                  {comments.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>No comments yet. Be the first to comment!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="border-b pb-4 last:border-0">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src={comment.profiles?.image || '/placeholder-user.png'} />
                              <AvatarFallback>{comment.profiles?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <p className="font-semibold">{comment.profiles?.name}</p>
                                <p className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</p>
                              </div>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Resources */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Related Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedResources.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No related resources found
                  </p>
                ) : (
                  relatedResources.map((related) => (
                    <div key={related.id} className="border-b pb-3 last:border-0 last:pb-0">
                      <Link
                        href={`/unishare/resources/${related.id}`}
                        className="block hover:underline"
                        legacyBehavior>
                        <h3 className="font-semibold text-sm">{related.title}</h3>
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{related.format}</Badge>
                        <span className="text-xs text-muted-foreground">{related.downloads || 0} downloads</span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link href={`/unishare?subject=${resource.subject}`} legacyBehavior>
                    More {resource.subject} Resources
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Share Card */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Share This Resource</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                  </Button>
                </div>
                <div className="mt-4">
                  <Input 
                    value={typeof window !== 'undefined' ? window.location.href : ''}
                    readOnly
                    onClick={(e) => e.currentTarget.select()}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Upload Your Own */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Have Study Materials?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Help other students by sharing your notes, summaries, or study guides.
                </p>
                <Button className="w-full" asChild>
                  <Link href="/unishare?upload=true">Upload Resource</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
