import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useAuth } from '@/components/auth/AuthContext';

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = React.useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<any[]>([]);
  const [newMessage, setNewMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [friends, setFriends] = React.useState<any[]>([]);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (user) {
      fetchConversations();
      fetchFriends();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      
      // Get conversations where user is sender
      const { data: sentMessages, error: sentError } = await supabase
        .from('social_messages')
        .select('recipient_id')
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false });
      
      if (sentError) throw sentError;
      
      // Get conversations where user is recipient
      const { data: receivedMessages, error: receivedError } = await supabase
        .from('social_messages')
        .select('sender_id')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });
      
      if (receivedError) throw receivedError;
      
      // Combine and get unique conversation partners
      const sentPartners = sentMessages.map(msg => msg.recipient_id);
      const receivedPartners = receivedMessages.map(msg => msg.sender_id);
      const allPartners = [...new Set([...sentPartners, ...receivedPartners])];
      
      if (allPartners.length > 0) {
        // Get profiles for conversation partners
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, image')
          .in('id', allPartners);
        
        if (profilesError) throw profilesError;
        
        // Get last message for each conversation
        const conversationsWithLastMessage = await Promise.all(
          profiles.map(async (profile) => {
            const { data: lastMessage, error: lastMessageError } = await supabase
              .from('social_messages')
              .select('*')
              .or(`and(sender_id.eq.${user.id},recipient_id.eq.${profile.id}),and(sender_id.eq.${profile.id},recipient_id.eq.${user.id})`)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
            
            if (lastMessageError) {
              console.error('Error fetching last message:', lastMessageError);
              return {
                ...profile,
                lastMessage: null,
                lastMessageTime: null
              };
            }
            
            return {
              ...profile,
              lastMessage: lastMessage.content,
              lastMessageTime: lastMessage.created_at,
              unread: lastMessage.sender_id === profile.id && !lastMessage.is_read
            };
          })
        );
        
        // Sort by last message time
        conversationsWithLastMessage.sort((a, b) => {
          if (!a.lastMessageTime) return 1;
          if (!b.lastMessageTime) return -1;
          return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
        });
        
        setConversations(conversationsWithLastMessage);
        
        // Select first conversation if none selected
        if (!selectedConversation && conversationsWithLastMessage.length > 0) {
          setSelectedConversation(conversationsWithLastMessage[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (partnerId: string) => {
    if (!user) return;
    
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      
      const { data, error } = await supabase
        .from('social_messages')
        .select(`
          *,
          sender:sender_id (name, image),
          recipient:recipient_id (name, image)
        `)
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setMessages(data || []);
      
      // Mark messages as read
      const { error: updateError } = await supabase
        .from('social_messages')
        .update({ is_read: true })
        .eq('sender_id', partnerId)
        .eq('recipient_id', user.id)
        .eq('is_read', false);
      
      if (updateError) {
        console.error('Error marking messages as read:', updateError);
      }
      
      // Update conversations list to reflect read status
      setConversations(conversations.map(conv => 
        conv.id === partnerId ? { ...conv, unread: false } : conv
      ));
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchFriends = async () => {
    if (!user) return;
    
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      
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
        .eq('status', 'accepted');
      
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

  const sendMessage = async () => {
    if (!user || !selectedConversation || !newMessage.trim()) return;
    
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      
      const { data, error } = await supabase
        .from('social_messages')
        .insert([
          {
            sender_id: user.id,
            recipient_id: selectedConversation,
            content: newMessage,
            is_read: false
          }
        ])
        .select(`
          *,
          sender:sender_id (name, image),
          recipient:recipient_id (name, image)
        `)
        .single();
      
      if (error) throw error;
      
      setMessages([...messages, data]);
      setNewMessage('');
      
      // Update conversations list
      const updatedConversations = [...conversations];
      const conversationIndex = updatedConversations.findIndex(c => c.id === selectedConversation);
      
      if (conversationIndex !== -1) {
        updatedConversations[conversationIndex] = {
          ...updatedConversations[conversationIndex],
          lastMessage: newMessage,
          lastMessageTime: new Date().toISOString()
        };
        
        // Move this conversation to the top
        const [conversation] = updatedConversations.splice(conversationIndex, 1);
        updatedConversations.unshift(conversation);
        
        setConversations(updatedConversations);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const startNewConversation = (friendId: string) => {
    setSelectedConversation(friendId);
    
    // Check if conversation already exists
    const existingConversation = conversations.find(c => c.id === friendId);
    
    if (!existingConversation) {
      // Add friend to conversations list
      const friend = friends.find(f => f.id === friendId);
      if (friend) {
        setConversations([
          {
            id: friend.id,
            name: friend.name,
            image: friend.image,
            lastMessage: null,
            lastMessageTime: null,
            unread: false
          },
          ...conversations
        ]);
      }
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <div className="container py-8 md:py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Sign in to view your messages</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-6">
            <p className="mb-4">You need to be signed in to access your messages.</p>
            <Button asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-8 pattern-container">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        <Tabs defaultValue="conversations" className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-2 mb-6">
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="new">New Message</TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TabsContent value="conversations" className="mt-0 lg:col-span-3">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                {/* Conversations List */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-3 border-b">
                    <Input placeholder="Search conversations..." />
                  </div>
                  
                  <div className="overflow-y-auto h-[calc(100%-56px)]">
                    {isLoading ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
                      </div>
                    ) : conversations.length === 0 ? (
                      <div className="text-center p-6 text-muted-foreground">
                        <p>No conversations yet</p>
                        <Button className="mt-2" size="sm" onClick={() => document.getElementById('new-tab')?.click()}>
                          Start a conversation
                        </Button>
                      </div>
                    ) : (
                      conversations.map((conversation) => (
                        <div 
                          key={conversation.id}
                          className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50 ${selectedConversation === conversation.id ? 'bg-accent' : ''}`}
                          onClick={() => setSelectedConversation(conversation.id)}
                        >
                          <Avatar>
                            <AvatarImage src={conversation.image || '/placeholder-user.png'} />
                            <AvatarFallback>{conversation.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <h3 className="font-semibold truncate">{conversation.name}</h3>
                              {conversation.lastMessageTime && (
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(conversation.lastMessageTime)}
                                </span>
                              )}
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-muted-foreground truncate">
                                {conversation.lastMessage || 'No messages yet'}
                              </p>
                              {conversation.unread && (
                                <Badge className="ml-2">New</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                {/* Messages */}
                <div className="lg:col-span-2 border rounded-lg overflow-hidden flex flex-col h-full">
                  {selectedConversation ? (
                    <>
                      {/* Conversation Header */}
                      <div className="p-3 border-b flex items-center gap-3">
                        <Avatar>
                          <AvatarImage 
                            src={conversations.find(c => c.id === selectedConversation)?.image || '/placeholder-user.png'} 
                          />
                          <AvatarFallback>
                            {conversations.find(c => c.id === selectedConversation)?.name?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">
                            {conversations.find(c => c.id === selectedConversation)?.name || 'User'}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {/* Online status would go here */}
                          </p>
                        </div>
                      </div>
                      
                      {/* Messages Container */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 ? (
                          <div className="text-center py-10 text-muted-foreground">
                            <p>No messages yet</p>
                            <p className="text-sm">Send a message to start the conversation</p>
                          </div>
                        ) : (
                          messages.map((message) => (
                            <div 
                              key={message.id}
                              className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-[70%] ${message.sender_id === user.id ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3`}>
                                <p>{message.content}</p>
                                <p className="text-xs opacity-70 text-right mt-1">
                                  {formatTime(message.created_at)}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                      
                      {/* Message Input */}
                      <div className="p-3 border-t">
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Type a message..." 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                              }
                            }}
                          />
                          <Button onClick={sendMessage} disabled={!newMessage.trim()}>Send</Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-center p-6">
                      <div>
                        <h3 className="font-semibold mb-2">Select a conversation</h3>
                        <p className="text-muted-foreground">Choose a conversation from the list or start a new one</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="new" className="mt-0 lg:col-span-3" id="new-tab">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>New Message</CardTitle>
                  <CardDescription>Start a conversation with a friend</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Input placeholder="Search for friends..." />
                  </div>
                  
                  <h3 className="font-semibold mb-3">Your Friends</h3>
                  {friends.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>You haven't connected with any friends yet.</p>
                      <Button className="mt-2" asChild>
                        <Link href="/unicircle?tab=discover">Find Friends</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {friends.map((friend) => (
                        <div key={friend.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Avatar>
                            <AvatarImage src={friend.image || '/placeholder-user.png'} />
                            <AvatarFallback>{friend.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold">{friend.name}</h3>
                          </div>
                          <Button size="sm" onClick={() => startNewConversation(friend.id)}>
                            Message
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
