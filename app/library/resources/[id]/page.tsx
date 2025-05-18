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

export default function ResourceDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [resource, setResource] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [relatedResources, setRelatedResources] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('details');
  const [citations, setCitations] = useState<any[]>([]);

  useEffect(() => {
    if (params.id) {
      fetchResourceDetails();
    }
  }, [params.id, user]);

  const fetchResourceDetails = async () => {
    try {
      // Fetch resource details
      const { data, error } = await supabase
        .from('library_resources')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (error) throw error;
      
      setResource(data);
      
      // Fetch resource reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('library_reviews')
        .select(`
          *,
          profiles:user_id (id, name, image)
        `)
        .eq('resource_id', params.id)
        .order('created_at', { ascending: false });
      
      if (reviewsError) throw reviewsError;
      
      setReviews(reviewsData || []);
      
      // Fetch citations
      const { data: citationsData, error: citationsError } = await supabase
        .from('resource_citations')
        .select('*')
        .eq('resource_id', params.id);
      
      if (citationsError) throw citationsError;
      
      setCitations(citationsData || []);
      
      // Fetch related resources (same category)
      if (data) {
        const { data: relatedData, error: relatedError } = await supabase
          .from('library_resources')
          .select('*')
          .eq('category', data.category)
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

  const handleSubmitReview = async () => {
    if (!user || !resource || !newReview.trim()) return;
    
    setReviewLoading(true);
    
    try {
      // Check if user already reviewed this resource
      const { data: existingReview, error: checkError } = await supabase
        .from('library_reviews')
        .select('id')
        .eq('resource_id', params.id)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingReview) {
        // Update existing review
        const { data, error } = await supabase
          .from('library_reviews')
          .update({
            content: newReview,
            rating: newRating,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingReview.id)
          .select(`
            *,
            profiles:user_id (id, name, image)
          `)
          .single();
        
        if (error) throw error;
        
        // Update reviews list
        setReviews(reviews.map(review => 
          review.id === existingReview.id ? data : review
        ));
      } else {
        // Create new review
        const { data, error } = await supabase
          .from('library_reviews')
          .insert([
            {
              resource_id: params.id,
              user_id: user.id,
              content: newReview,
              rating: newRating
            }
          ])
          .select(`
            *,
            profiles:user_id (id, name, image)
          `)
          .single();
        
        if (error) throw error;
        
        // Update reviews list
        setReviews([data, ...reviews]);
      }
      
      // Reset form
      setNewReview('');
      setNewRating(5);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setReviewLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAverageRating = () => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-lg ${i <= rating ? 'text-yellow-500' : 'text-gray-300'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const getCitationFormat = (format, citation) => {
    switch (format) {
      case 'apa':
        return `${citation.authors} (${citation.year}). ${citation.title}. ${citation.source}, ${citation.volume}(${citation.issue}), ${citation.pages}.`;
      case 'mla':
        return `${citation.authors}. "${citation.title}." ${citation.source}, vol. ${citation.volume}, no. ${citation.issue}, ${citation.year}, pp. ${citation.pages}.`;
      case 'chicago':
        return `${citation.authors}. "${citation.title}." ${citation.source} ${citation.volume}, no. ${citation.issue} (${citation.year}): ${citation.pages}.`;
      default:
        return `${citation.authors} (${citation.year}). ${citation.title}. ${citation.source}, ${citation.volume}(${citation.issue}), ${citation.pages}.`;
    }
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
          <Link href="/library">Back to Library</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-8 pattern-container">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild className="mb-4">
            <Link href="/library" legacyBehavior>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Library
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card">
              <div className="md:flex">
                <div className="md:w-1/3 p-6">
                  <div className="aspect-[2/3] overflow-hidden rounded-md">
                    <img 
                      src={resource.cover_image || '/placeholder-resource.png'} 
                      alt={resource.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-2/3 p-6">
                  <h1 className="text-2xl font-bold mb-1">{resource.title}</h1>
                  <p className="text-lg text-muted-foreground mb-4">by {resource.authors}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    {renderStars(calculateAverageRating())}
                    <span className="text-sm text-muted-foreground">
                      ({calculateAverageRating()}/5 from {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div>
                      <p className="text-muted-foreground">Category</p>
                      <p className="font-medium">{resource.category}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Publication Year</p>
                      <p className="font-medium">{resource.publication_year}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Resource Type</p>
                      <p className="font-medium">{resource.resource_type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Language</p>
                      <p className="font-medium">{resource.language || 'English'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <Badge variant="outline">
                      {resource.access_type || 'Open Access'}
                    </Badge>
                    {resource.doi && (
                      <Badge variant="outline">
                        DOI: {resource.doi}
                      </Badge>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full md:w-auto" 
                    variant="default"
                    asChild
                  >
                    <a href={resource.download_url || '#'} target="_blank" rel="noopener noreferrer">
                      Download Resource
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
            
            <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="citations">Citations</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6 mt-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Abstract</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line">{resource.abstract}</p>
                    
                    {resource.keywords && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-2">Keywords</h3>
                        <div className="flex flex-wrap gap-2">
                          {resource.keywords.split(',').map((keyword, index) => (
                            <Badge key={index} variant="outline">{keyword.trim()}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {resource.methodology && (
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Methodology</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line">{resource.methodology}</p>
                    </CardContent>
                  </Card>
                )}
                
                {resource.findings && (
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Findings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line">{resource.findings}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="citations" className="space-y-6 mt-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Citation Formats</CardTitle>
                    <CardDescription>
                      Use these citations in your academic work
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">APA Format</h3>
                        <div className="bg-muted p-3 rounded-md text-sm">
                          <p>{getCitationFormat('apa', resource)}</p>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => {
                          navigator.clipboard.writeText(getCitationFormat('apa', resource));
                        }}>
                          Copy to Clipboard
                        </Button>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2">MLA Format</h3>
                        <div className="bg-muted p-3 rounded-md text-sm">
                          <p>{getCitationFormat('mla', resource)}</p>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => {
                          navigator.clipboard.writeText(getCitationFormat('mla', resource));
                        }}>
                          Copy to Clipboard
                        </Button>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2">Chicago Format</h3>
                        <div className="bg-muted p-3 rounded-md text-sm">
                          <p>{getCitationFormat('chicago', resource)}</p>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => {
                          navigator.clipboard.writeText(getCitationFormat('chicago', resource));
                        }}>
                          Copy to Clipboard
                        </Button>
                      </div>
                    </div>
                    
                    {citations.length > 0 && (
                      <div className="border-t pt-6 mt-6">
                        <h3 className="font-semibold mb-4">References Cited in This Resource</h3>
                        <ul className="space-y-3 text-sm">
                          {citations.map((citation, index) => (
                            <li key={index} className="pl-4 border-l-2 border-muted-foreground">
                              {citation.citation_text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-6 mt-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Reviews</CardTitle>
                    <CardDescription>
                      Share your thoughts about this resource
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {user ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Your Rating</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setNewRating(star)}
                                className="text-2xl focus:outline-none"
                              >
                                <span className={star <= newRating ? 'text-yellow-500' : 'text-gray-300'}>
                                  ★
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <Textarea
                          placeholder="Write your review..."
                          value={newReview}
                          onChange={(e) => setNewReview(e.target.value)}
                          rows={4}
                        />
                        <div className="flex justify-end">
                          <Button 
                            onClick={handleSubmitReview} 
                            disabled={!newReview.trim() || reviewLoading}
                          >
                            {reviewLoading ? (
                              <>
                                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                                Posting...
                              </>
                            ) : 'Post Review'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground mb-4">
                          You need to sign in to leave a review
                        </p>
                        <Button asChild>
                          <Link href="/signin">Sign In</Link>
                        </Button>
                      </div>
                    )}
                    
                    <div className="border-t pt-4">
                      {reviews.length === 0 ? (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">
                            No reviews yet. Be the first to review this resource!
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {reviews.map((review) => (
                            <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={review.profiles?.image || '/placeholder-user.png'} />
                                    <AvatarFallback>{review.profiles?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{review.profiles?.name}</p>
                                    <p className="text-xs text-muted-foreground">{formatDate(review.created_at)}</p>
                                  </div>
                                </div>
                                <div className="flex">
                                  {renderStars(review.rating)}
                                </div>
                              </div>
                              <p className="text-sm mt-2">{review.content}</p>
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
                <CardTitle>Resource Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Format:</span>
                  <span>{resource.file_format || 'PDF'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pages:</span>
                  <span>{resource.pages}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">File Size:</span>
                  <span>{resource.file_size || 'Unknown'}</span>
                </div>
                {resource.institution && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Institution:</span>
                    <span>{resource.institution}</span>
                  </div>
                )}
                {resource.license && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">License:</span>
                    <span>{resource.license}</span>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {relatedResources.length > 0 && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Related Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedResources.map((relatedResource) => (
                    <div key={relatedResource.id} className="flex gap-3">
                      <div className="w-16 h-24 flex-shrink-0 overflow-hidden rounded">
                        <img 
                          src={relatedResource.cover_image || '/placeholder-resource.png'} 
                          alt={relatedResource.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium line-clamp-2">{relatedResource.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{relatedResource.authors}</p>
                        <Button variant="link" className="p-0 h-auto text-sm" asChild>
                          <Link href={`/library/resources/${relatedResource.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Access Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="space-y-1">
                  <p className="font-medium">Access Type</p>
                  <p className="text-muted-foreground">{resource.access_type || 'Open Access'}</p>
                </div>
                {resource.access_instructions && (
                  <div className="space-y-1">
                    <p className="font-medium">Access Instructions</p>
                    <p className="text-muted-foreground">{resource.access_instructions}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="font-medium">Need Help?</p>
                  <p className="text-muted-foreground">Contact the library staff at library@university.edu for assistance with resource access.</p>
                </div>
                <Button variant="outline" className="w-full mt-2" asChild>
                  <Link href="/library">
                    Browse More Resources
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
