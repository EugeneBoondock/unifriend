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

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [book, setBook] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReserved, setIsReserved] = useState(false);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [relatedBooks, setRelatedBooks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (params.id) {
      fetchBookDetails();
    }
  }, [params.id, user]);

  const fetchBookDetails = async () => {
    try {
      // Fetch book details
      const { data, error } = await supabase
        .from('library_books')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (error) throw error;
      
      setBook(data);
      
      // Check if book is reserved by current user
      if (user) {
        const { data: reservationData, error: reservationError } = await supabase
          .from('library_reservations')
          .select('id')
          .eq('book_id', params.id)
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (reservationError) throw reservationError;
        
        setIsReserved(!!reservationData);
      }
      
      // Fetch book reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('library_reviews')
        .select(`
          *,
          profiles:user_id (id, name, image)
        `)
        .eq('book_id', params.id)
        .order('created_at', { ascending: false });
      
      if (reviewsError) throw reviewsError;
      
      setReviews(reviewsData || []);
      
      // Fetch related books (same category)
      if (data) {
        const { data: relatedData, error: relatedError } = await supabase
          .from('library_books')
          .select('*')
          .eq('category', data.category)
          .neq('id', params.id)
          .limit(3);
        
        if (relatedError) throw relatedError;
        
        setRelatedBooks(relatedData || []);
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReserveBook = async () => {
    if (!user || !book) return;
    
    setReservationLoading(true);
    
    try {
      if (isReserved) {
        // Cancel reservation
        const { data: reservationData, error: findError } = await supabase
          .from('library_reservations')
          .select('id')
          .eq('book_id', params.id)
          .eq('user_id', user.id)
          .single();
        
        if (findError) throw findError;
        
        const { error: deleteError } = await supabase
          .from('library_reservations')
          .delete()
          .eq('id', reservationData.id);
        
        if (deleteError) throw deleteError;
        
        // Update book available copies
        const { error: updateError } = await supabase
          .from('library_books')
          .update({ available_copies: supabase.rpc('increment', { x: 1 }) })
          .eq('id', params.id);
        
        if (updateError) throw updateError;
        
        setIsReserved(false);
        setBook({ ...book, available_copies: book.available_copies + 1 });
      } else {
        // Check if book is available
        if (book.available_copies <= 0) {
          throw new Error('This book is currently unavailable for reservation');
        }
        
        // Create reservation
        const { error: insertError } = await supabase
          .from('library_reservations')
          .insert([
            { 
              book_id: params.id, 
              user_id: user.id,
              reservation_date: new Date().toISOString(),
              due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
            }
          ]);
        
        if (insertError) throw insertError;
        
        // Update book available copies
        const { error: updateError } = await supabase
          .from('library_books')
          .update({ available_copies: supabase.rpc('decrement', { x: 1 }) })
          .eq('id', params.id);
        
        if (updateError) throw updateError;
        
        setIsReserved(true);
        setBook({ ...book, available_copies: book.available_copies - 1 });
      }
    } catch (error) {
      console.error('Error reserving book:', error);
      alert(error.message);
    } finally {
      setReservationLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user || !book || !newReview.trim()) return;
    
    setReviewLoading(true);
    
    try {
      // Check if user already reviewed this book
      const { data: existingReview, error: checkError } = await supabase
        .from('library_reviews')
        .select('id')
        .eq('book_id', params.id)
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
              book_id: params.id,
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

  if (isLoading) {
    return (
      <div className="container py-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading book details...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Book Not Found</h1>
        <p className="text-muted-foreground mb-6">The book you're looking for doesn't exist or has been removed.</p>
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
                      src={book.cover_image || '/placeholder-book.png'} 
                      alt={book.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-2/3 p-6">
                  <h1 className="text-2xl font-bold mb-1">{book.title}</h1>
                  <p className="text-lg text-muted-foreground mb-4">by {book.author}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    {renderStars(calculateAverageRating())}
                    <span className="text-sm text-muted-foreground">
                      ({calculateAverageRating()}/5 from {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div>
                      <p className="text-muted-foreground">Category</p>
                      <p className="font-medium">{book.category}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Publication Year</p>
                      <p className="font-medium">{book.publication_year}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">ISBN</p>
                      <p className="font-medium">{book.isbn}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Publisher</p>
                      <p className="font-medium">{book.publisher}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <Badge className={book.available_copies > 0 ? 'bg-green-500' : 'bg-red-500'}>
                      {book.available_copies > 0 ? 'Available' : 'Unavailable'}
                    </Badge>
                    {book.available_copies > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {book.available_copies} {book.available_copies === 1 ? 'copy' : 'copies'} available
                      </span>
                    )}
                  </div>
                  
                  {user ? (
                    <Button 
                      className="w-full md:w-auto" 
                      variant={isReserved ? "secondary" : "default"}
                      disabled={!user || (book.available_copies <= 0 && !isReserved) || reservationLoading}
                      onClick={handleReserveBook}
                    >
                      {reservationLoading ? (
                        <>
                          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                          {isReserved ? 'Returning...' : 'Reserving...'}
                        </>
                      ) : (
                        isReserved ? 'Return Book' : 'Reserve Book'
                      )}
                    </Button>
                  ) : (
                    <Button asChild>
                      <Link href="/signin">Sign In to Reserve</Link>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
            
            <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full max-w-md">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6 mt-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line">{book.description}</p>
                  </CardContent>
                </Card>
                
                {book.table_of_contents && (
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Table of Contents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line">{book.table_of_contents}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-6 mt-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Reviews</CardTitle>
                    <CardDescription>
                      Share your thoughts about this book
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
                            No reviews yet. Be the first to review this book!
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
                <CardTitle>Book Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Format:</span>
                  <span>{book.format || 'Paperback'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pages:</span>
                  <span>{book.pages}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Language:</span>
                  <span>{book.language || 'English'}</span>
                </div>
                {book.edition && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Edition:</span>
                    <span>{book.edition}</span>
                  </div>
                )}
                {book.dimensions && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Dimensions:</span>
                    <span>{book.dimensions}</span>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {relatedBooks.length > 0 && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Related Books</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedBooks.map((relatedBook) => (
                    <div key={relatedBook.id} className="flex gap-3">
                      <div className="w-16 h-24 flex-shrink-0 overflow-hidden rounded">
                        <img 
                          src={relatedBook.cover_image || '/placeholder-book.png'} 
                          alt={relatedBook.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium line-clamp-2">{relatedBook.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{relatedBook.author}</p>
                        <Button variant="link" className="p-0 h-auto text-sm" asChild>
                          <Link href={`/library/books/${relatedBook.id}`}>
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
                <CardTitle>Library Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="space-y-1">
                  <p className="font-medium">Reservation Policy</p>
                  <p className="text-muted-foreground">Books can be reserved for up to 14 days. Late returns may incur fees.</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Need Help?</p>
                  <p className="text-muted-foreground">Contact the library staff at library@university.edu or visit the help desk during opening hours.</p>
                </div>
                <Button variant="outline" className="w-full mt-2" asChild>
                  <Link href="/library">
                    Browse More Books
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
