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

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [service, setService] = useState<any>(null);
  const [relatedServices, setRelatedServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchServiceDetails();
      fetchReviews();
      if (user) {
        checkUserReview();
      }
    }
  }, [params.id, user]);

  const fetchServiceDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_services')
        .select(`
          *,
          profiles:user_id (id, name, image, email, phone)
        `)
        .eq('id', params.id)
        .single();
      
      if (error) throw error;
      
      setService(data);
      
      // Fetch related services
      if (data) {
        const { data: relatedData, error: relatedError } = await supabase
          .from('vendor_services')
          .select(`
            *,
            profiles:user_id (id, name, image)
          `)
          .eq('category', data.category)
          .neq('id', params.id)
          .limit(3);
        
        if (relatedError) throw relatedError;
        
        setRelatedServices(relatedData || []);
      }
    } catch (error) {
      console.error('Error fetching service details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('service_reviews')
        .select(`
          *,
          profiles:user_id (id, name, image)
        `)
        .eq('service_id', params.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const checkUserReview = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('service_reviews')
        .select('id')
        .eq('service_id', params.id)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      setUserHasReviewed(!!data);
    } catch (error) {
      console.error('Error checking user review:', error);
    }
  };

  const sendMessage = async () => {
    if (!user || !service || !newMessage.trim()) return;
    
    setMessageLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('service_messages')
        .insert([
          {
            service_id: params.id,
            sender_id: user.id,
            receiver_id: service.user_id,
            content: newMessage
          }
        ]);
      
      if (error) throw error;
      
      setNewMessage('');
      
      // Send notification to the service provider
      await supabase
        .from('notifications')
        .insert([
          {
            user_id: service.user_id,
            type: 'service_message',
            content: `New message about your service "${service.title}"`,
            link: `/uni-vendors/services/${params.id}`,
            is_read: false
          }
        ]);
        
      // Show success message
      alert('Message sent successfully! The service provider will contact you soon.');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setMessageLoading(false);
    }
  };

  const submitReview = async () => {
    if (!user || !reviewContent.trim() || reviewRating < 1) return;
    
    setReviewLoading(true);
    
    try {
      // Add the review
      const { data, error } = await supabase
        .from('service_reviews')
        .insert([
          {
            service_id: params.id,
            user_id: user.id,
            content: reviewContent,
            rating: reviewRating
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
      
      // Update service rating
      const newAvgRating = ((service.rating || 0) * (service.reviews_count || 0) + reviewRating) / 
                          ((service.reviews_count || 0) + 1);
      
      const { error: updateError } = await supabase
        .from('vendor_services')
        .update({ 
          rating: newAvgRating,
          reviews_count: (service.reviews_count || 0) + 1
        })
        .eq('id', params.id);
      
      if (updateError) throw updateError;
      
      // Update local state
      setService({
        ...service,
        rating: newAvgRating,
        reviews_count: (service.reviews_count || 0) + 1
      });
      
      setReviewContent('');
      setReviewRating(5);
      setUserHasReviewed(true);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setReviewLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return `R${price}`;
  };

  if (isLoading) {
    return (
      <div className="container py-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
        <p className="text-muted-foreground mb-6">The service you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/uni-vendors">Back to UniVendor</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-8 pattern-container">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild className="mb-4">
            <Link href="/uni-vendors" legacyBehavior>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to UniVendor
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold">{service.title}</h1>
            <Badge className="bg-primary/80 hover:bg-primary self-start md:self-auto">
              {formatPrice(service.price)}
            </Badge>
          </div>
          <p className="text-muted-foreground">{service.category} • {service.location}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Service Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {service.image_url && (
                  <div className="mb-4">
                    <img 
                      src={service.image_url} 
                      alt={service.title} 
                      className="w-full h-auto rounded-md"
                    />
                  </div>
                )}
                
                {service.description && (
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Description</h3>
                    <p className="text-sm whitespace-pre-line">{service.description}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-semibold mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {service.tags && service.tags.map((tag: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h3 className="font-semibold mb-1">Price</h3>
                    <p>{formatPrice(service.price)}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p>{service.location}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Listed</h3>
                    <p>{formatDate(service.created_at)}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Rating</h3>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg 
                            key={star}
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-4 w-4 ${star <= Math.round(service.rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm">
                        {service.rating ? service.rating.toFixed(1) : '0.0'} ({service.reviews_count || 0})
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pt-2 border-t">
                  <Avatar>
                    <AvatarImage src={service.profiles?.image || '/placeholder-user.png'} />
                    <AvatarFallback>{service.profiles?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{service.profiles?.name}</p>
                    <p className="text-xs text-muted-foreground">Service Provider</p>
                  </div>
                </div>
                
                {showContactInfo && (
                  <div className="mt-4 p-4 bg-muted rounded-md">
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      {service.profiles?.email && (
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <a href={`mailto:${service.profiles.email}`} className="hover:underline">
                            {service.profiles.email}
                          </a>
                        </div>
                      )}
                      {service.profiles?.phone && (
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <a href={`tel:${service.profiles.phone}`} className="hover:underline">
                            {service.profiles.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3">
                {!showContactInfo && (
                  <Button 
                    className="w-full sm:w-auto" 
                    onClick={() => setShowContactInfo(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    View Contact Info
                  </Button>
                )}
                <Button 
                  className="w-full sm:w-auto" 
                  variant={showContactInfo ? "default" : "outline"}
                  onClick={() => document.getElementById('message-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Message Provider
                </Button>
              </CardFooter>
            </Card>
            
            {/* Reviews Section */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Reviews ({reviews.length})</CardTitle>
                <CardDescription>
                  See what others are saying about this service
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {user && !userHasReviewed && (
                  <div className="border-b pb-6">
                    <h3 className="font-semibold mb-3">Write a Review</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm mb-2">Rating</p>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className={`h-8 w-8 flex items-center justify-center rounded-md ${
                                star <= reviewRating ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'text-muted-foreground bg-muted/50'
                              }`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Textarea
                          placeholder="Share your experience with this service..."
                          value={reviewContent}
                          onChange={(e) => setReviewContent(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          onClick={submitReview} 
                          disabled={!reviewContent.trim() || reviewLoading}
                        >
                          {reviewLoading ? (
                            <>
                              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                              Submitting...
                            </>
                          ) : 'Submit Review'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {reviews.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">
                      No reviews yet. Be the first to review this service!
                    </p>
                    {!user && (
                      <Button asChild>
                        <Link href="/signin">Sign In to Review</Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src={review.profiles?.image || '/placeholder-user.png'} />
                            <AvatarFallback>{review.profiles?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <p className="font-semibold">{review.profiles?.name}</p>
                              <p className="text-xs text-muted-foreground">{formatDate(review.created_at)}</p>
                            </div>
                            <div className="flex mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg 
                                  key={star}
                                  xmlns="http://www.w3.org/2000/svg" 
                                  className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                  viewBox="0 0 20 20" 
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <p className="text-sm">{review.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Message Section */}
            <Card className="glass-card" id="message-section">
              <CardHeader>
                <CardTitle className="text-lg">Contact Service Provider</CardTitle>
                <CardDescription>
                  Ask questions or request more information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user ? (
                  <div>
                    <Textarea
                      placeholder="Type your message here..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="mb-4"
                      rows={4}
                    />
                    <div className="flex justify-end">
                      <Button 
                        onClick={sendMessage} 
                        disabled={!newMessage.trim() || messageLoading}
                      >
                        {messageLoading ? (
                          <>
                            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                            Sending...
                          </>
                        ) : 'Send Message'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">
                      You need to sign in to message the service provider
                    </p>
                    <Button asChild>
                      <Link href="/signin">Sign In</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Services */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Similar Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedServices.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No similar services found
                  </p>
                ) : (
                  relatedServices.map((related) => (
                    <div key={related.id} className="border-b pb-3 last:border-0 last:pb-0">
                      <Link
                        href={`/uni-vendors/services/${related.id}`}
                        className="hover:underline"
                        legacyBehavior>
                        <h3 className="font-semibold text-sm">{related.title}</h3>
                      </Link>
                      <p className="text-xs text-muted-foreground">{related.category}</p>
                      <div className="flex items-center justify-between mt-1">
                        <Badge className="text-xs">{formatPrice(related.price)}</Badge>
                        <div className="flex items-center gap-1">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-3 w-3 text-yellow-500"
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-xs">{related.rating ? related.rating.toFixed(1) : '0.0'}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link href={`/uni-vendors?category=${service.category}`} legacyBehavior>
                    More {service.category} Services
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Offer Your Service */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Offer Your Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Have skills to share? Offer your services to the university community.
                </p>
                <Button className="w-full" asChild>
                  <Link href="/uni-vendors/services/create">Create Service Listing</Link>
                </Button>
              </CardContent>
            </Card>
            
            {/* Safety Tips */}
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
                    <span>Verify service provider credentials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Read reviews before hiring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Agree on terms and payment before starting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Report any suspicious activity</span>
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
