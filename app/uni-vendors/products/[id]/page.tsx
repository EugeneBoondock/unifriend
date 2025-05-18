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

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchProductDetails();
    }
  }, [params.id]);

  const fetchProductDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_products')
        .select(`
          *,
          profiles:user_id (id, name, image, email, phone)
        `)
        .eq('id', params.id)
        .single();
      
      if (error) throw error;
      
      setProduct(data);
      
      // Set product images
      const images = [];
      if (data.image_url) images.push(data.image_url);
      if (data.additional_images && Array.isArray(data.additional_images)) {
        images.push(...data.additional_images);
      }
      setProductImages(images);
      
      // Fetch related products
      if (data) {
        const { data: relatedData, error: relatedError } = await supabase
          .from('vendor_products')
          .select(`
            *,
            profiles:user_id (id, name, image)
          `)
          .eq('category', data.category)
          .neq('id', params.id)
          .limit(3);
        
        if (relatedError) throw relatedError;
        
        setRelatedProducts(relatedData || []);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!user || !product || !newMessage.trim()) return;
    
    setMessageLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('product_messages')
        .insert([
          {
            product_id: params.id,
            sender_id: user.id,
            receiver_id: product.user_id,
            content: newMessage
          }
        ]);
      
      if (error) throw error;
      
      setNewMessage('');
      
      // Send notification to the product seller
      await supabase
        .from('notifications')
        .insert([
          {
            user_id: product.user_id,
            type: 'product_message',
            content: `New message about your product "${product.title}"`,
            link: `/uni-vendors/products/${params.id}`,
            is_read: false
          }
        ]);
        
      // Show success message
      alert('Message sent successfully! The seller will contact you soon.');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setMessageLoading(false);
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
        <p className="mt-2 text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
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
            <Link href="/uni-vendors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to UniVendor
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold">{product.title}</h1>
            <Badge className="bg-primary/80 hover:bg-primary self-start md:self-auto">
              {formatPrice(product.price)}
            </Badge>
          </div>
          <p className="text-muted-foreground">{product.category} • {product.location}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card">
              <CardContent className="p-0">
                {productImages.length > 0 ? (
                  <div>
                    <div className="relative pt-[75%] overflow-hidden rounded-t-lg">
                      <img 
                        src={productImages[activeImage]} 
                        alt={product.title} 
                        className="absolute top-0 left-0 w-full h-full object-contain bg-muted/50"
                      />
                    </div>
                    {productImages.length > 1 && (
                      <div className="flex gap-2 p-4 overflow-x-auto">
                        {productImages.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveImage(index)}
                            className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                              index === activeImage ? 'border-primary' : 'border-transparent'
                            }`}
                          >
                            <img 
                              src={image} 
                              alt={`${product.title} - Image ${index + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="pt-[60%] bg-muted rounded-t-lg relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.description && (
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Description</h3>
                    <p className="text-sm whitespace-pre-line">{product.description}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-semibold mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags && product.tags.map((tag: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h3 className="font-semibold mb-1">Price</h3>
                    <p>{formatPrice(product.price)}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Condition</h3>
                    <p>{product.condition || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p>{product.location}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Listed</h3>
                    <p>{formatDate(product.created_at)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pt-2 border-t">
                  <Avatar>
                    <AvatarImage src={product.profiles?.image || '/placeholder-user.png'} />
                    <AvatarFallback>{product.profiles?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{product.profiles?.name}</p>
                    <p className="text-xs text-muted-foreground">Seller</p>
                  </div>
                </div>
                
                {showContactInfo && (
                  <div className="mt-4 p-4 bg-muted rounded-md">
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      {product.profiles?.email && (
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <a href={`mailto:${product.profiles.email}`} className="hover:underline">
                            {product.profiles.email}
                          </a>
                        </div>
                      )}
                      {product.profiles?.phone && (
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <a href={`tel:${product.profiles.phone}`} className="hover:underline">
                            {product.profiles.phone}
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
                  Message Seller
                </Button>
              </CardFooter>
            </Card>
            
            {/* Message Section */}
            <Card className="glass-card" id="message-section">
              <CardHeader>
                <CardTitle className="text-lg">Contact Seller</CardTitle>
                <CardDescription>
                  Ask questions or arrange a meetup
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
                        disabled={!newMessage.trim() || messageLoading || !product.is_available}
                      >
                        {messageLoading ? (
                          <>
                            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                            Sending...
                          </>
                        ) : 'Send Message'}
                      </Button>
                    </div>
                    
                    {!product.is_available && (
                      <p className="text-sm text-red-500 mt-2 text-center">
                        This product is no longer available for purchase.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">
                      You need to sign in to message the seller
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
            {/* Related Products */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Similar Products</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No similar products found
                  </p>
                ) : (
                  relatedProducts.map((related) => (
                    <div key={related.id} className="border-b pb-3 last:border-0 last:pb-0">
                      <div className="flex gap-3">
                        {related.image_url && (
                          <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={related.image_url} 
                              alt={related.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <Link href={`/uni-vendors/products/${related.id}`} className="hover:underline">
                            <h3 className="font-semibold text-sm">{related.title}</h3>
                          </Link>
                          <p className="text-xs text-muted-foreground">{related.category}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="text-xs">{formatPrice(related.price)}</Badge>
                            {related.condition && (
                              <Badge variant="outline" className="text-xs">{related.condition}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link href={`/uni-vendors?category=${product.category}`}>
                    More {product.category} Products
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Sell Your Product */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Sell Your Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Have items you no longer need? List them for sale and help other students save money.
                </p>
                <Button className="w-full" asChild>
                  <Link href="/uni-vendors/products/create">List Your Product</Link>
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
                    <span>Meet in public places like your campus library or cafeteria</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Inspect the product before purchasing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Use secure payment methods</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Let a friend know when and where you're meeting</span>
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
