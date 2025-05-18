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

export default function TextbookDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [textbook, setTextbook] = useState<any>(null);
  const [relatedTextbooks, setRelatedTextbooks] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchTextbookDetails();
      if (user) {
        fetchMessages();
      }
    }
  }, [params.id, user]);

  const fetchTextbookDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('textbooks')
        .select(`
          *,
          profiles:user_id (id, name, image, email, phone)
        `)
        .eq('id', params.id)
        .single();
      
      if (error) throw error;
      
      setTextbook(data);
      
      // Fetch related textbooks
      if (data) {
        const { data: relatedData, error: relatedError } = await supabase
          .from('textbooks')
          .select(`
            *,
            profiles:user_id (id, name, image)
          `)
          .or(`title.ilike.%${data.title.split(' ')[0]}%,author.ilike.%${data.author.split(' ')[0]}%`)
          .neq('id', params.id)
          .limit(3);
        
        if (relatedError) throw relatedError;
        
        setRelatedTextbooks(relatedData || []);
      }
    } catch (error) {
      console.error('Error fetching textbook details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('textbook_messages')
        .select(`
          *,
          sender:sender_id (id, name, image),
          receiver:receiver_id (id, name, image)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .eq('textbook_id', params.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!user || !textbook || !newMessage.trim()) return;
    
    setMessageLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('textbook_messages')
        .insert([
          {
            textbook_id: params.id,
            sender_id: user.id,
            receiver_id: textbook.user_id,
            content: newMessage
          }
        ])
        .select(`
          *,
          sender:sender_id (id, name, image),
          receiver:receiver_id (id, name, image)
        `)
        .single();
      
      if (error) throw error;
      
      setMessages([...messages, data]);
      setNewMessage('');
      
      // Send notification to the seller
      await supabase
        .from('notifications')
        .insert([
          {
            user_id: textbook.user_id,
            type: 'textbook_message',
            content: `New message about "${textbook.title}"`,
            link: `/unishare/textbooks/${params.id}`,
            is_read: false
          }
        ]);
    } catch (error) {
      console.error('Error sending message:', error);
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
        <p className="mt-2 text-muted-foreground">Loading textbook details...</p>
      </div>
    );
  }

  if (!textbook) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Textbook Not Found</h1>
        <p className="text-muted-foreground mb-6">The textbook you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/unishare?tab=textbooks">Back to Textbooks</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-8 pattern-container">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild className="mb-4">
            <Link href="/unishare?tab=textbooks">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Textbooks
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold">{textbook.title}</h1>
            <Badge className="bg-primary/80 hover:bg-primary self-start md:self-auto">
              {formatPrice(textbook.price)}
            </Badge>
          </div>
          <p className="text-muted-foreground">By {textbook.author}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Textbook Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6">
                  {textbook.image_url && (
                    <div className="w-full md:w-1/3 flex-shrink-0">
                      <div className="bg-muted rounded-md overflow-hidden">
                        <img 
                          src={textbook.image_url} 
                          alt={textbook.title} 
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    {textbook.description && (
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold mb-1">Description</h3>
                        <p className="text-sm">{textbook.description}</p>
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold mb-1">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {textbook.tags && textbook.tags.map((tag: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h3 className="font-semibold mb-1">Condition</h3>
                        <p>{textbook.condition}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Location</h3>
                        <p>{textbook.location}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Listed</h3>
                        <p>{formatDate(textbook.created_at)}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Status</h3>
                        <Badge variant={textbook.is_available ? "success" : "destructive"} className="text-xs">
                          {textbook.is_available ? 'Available' : 'Sold'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pt-2 border-t">
                  <Avatar>
                    <AvatarImage src={textbook.profiles?.image || '/placeholder-user.png'} />
                    <AvatarFallback>{textbook.profiles?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{textbook.profiles?.name}</p>
                    <p className="text-xs text-muted-foreground">Seller</p>
                  </div>
                </div>
                
                {showContactInfo && (
                  <div className="mt-4 p-4 bg-muted rounded-md">
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      {textbook.profiles?.email && (
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <a href={`mailto:${textbook.profiles.email}`} className="hover:underline">
                            {textbook.profiles.email}
                          </a>
                        </div>
                      )}
                      {textbook.profiles?.phone && (
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <a href={`tel:${textbook.profiles.phone}`} className="hover:underline">
                            {textbook.profiles.phone}
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
            
            {/* Messages Section */}
            <Card className="glass-card" id="message-section">
              <CardHeader>
                <CardTitle className="text-lg">Message the Seller</CardTitle>
                <CardDescription>
                  Ask questions about the textbook or arrange a meetup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {user ? (
                  <>
                    {messages.length > 0 && (
                      <div className="border rounded-md p-4 max-h-96 overflow-y-auto">
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div 
                              key={message.id} 
                              className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                            >
                              <div 
                                className={`max-w-[80%] rounded-lg p-3 ${
                                  message.sender_id === user.id 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'bg-muted'
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p className="text-xs mt-1 opacity-70">
                                  {formatDate(message.created_at)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <Textarea
                        placeholder="Type your message here..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="mb-2"
                        rows={3}
                      />
                      <div className="flex justify-end">
                        <Button 
                          onClick={sendMessage} 
                          disabled={!newMessage.trim() || messageLoading || !textbook.is_available}
                        >
                          {messageLoading ? (
                            <>
                              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                              Sending...
                            </>
                          ) : 'Send Message'}
                        </Button>
                      </div>
                      
                      {!textbook.is_available && (
                        <p className="text-sm text-red-500 mt-2 text-center">
                          This textbook is no longer available for purchase.
                        </p>
                      )}
                    </div>
                  </>
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
            {/* Related Textbooks */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Similar Textbooks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedTextbooks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No similar textbooks found
                  </p>
                ) : (
                  relatedTextbooks.map((related) => (
                    <div key={related.id} className="border-b pb-3 last:border-0 last:pb-0">
                      <div className="flex gap-3">
                        {related.image_url && (
                          <div className="w-12 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={related.image_url} 
                              alt={related.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <Link href={`/unishare/textbooks/${related.id}`} className="hover:underline">
                            <h3 className="font-semibold text-sm">{related.title}</h3>
                          </Link>
                          <p className="text-xs text-muted-foreground">By {related.author}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="text-xs">{formatPrice(related.price)}</Badge>
                            <Badge variant="outline" className="text-xs">{related.condition}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link href="/unishare?tab=textbooks">
                    Browse All Textbooks
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Sell Your Textbook */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Sell Your Textbooks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Have textbooks you no longer need? List them for sale and help other students save money.
                </p>
                <Button className="w-full" asChild>
                  <Link href="/unishare?tab=textbooks&list=true">List Your Textbook</Link>
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
                    <span>Inspect the textbook before purchasing</span>
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
