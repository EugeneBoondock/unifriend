import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useAuth } from '@/components/auth/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function HelpAStudentPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('browse');
  const [requests, setRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [myHelping, setMyHelping] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userProfile, setUserProfile] = useState(null);
  const [isVolunteer, setIsVolunteer] = useState(false);

  // Categories for help requests
  const categories = [
    'Homework Help',
    'Exam Preparation',
    'Research Assistance',
    'Lab Work',
    'Project Collaboration',
    'Technical Support',
    'Study Group',
    'Note Sharing',
    'Tutoring',
    'Academic Advice',
    'Course Selection',
    'Other'
  ];

  useEffect(() => {
    fetchRequests();
    if (user) {
      fetchUserProfile();
      fetchMyRequests();
      fetchMyHelping();
      checkVolunteerStatus();
    }
  }, [user]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('help_requests')
        .select(`
          *,
          requester:requester_id(id, first_name, last_name, avatar_url, major, year_level),
          helper:helper_id(id, first_name, last_name, avatar_url)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching help requests:', error);
      toast({
        title: "Error",
        description: "Failed to load help requests. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('help_requests')
        .select(`
          *,
          helper:helper_id(id, first_name, last_name, avatar_url)
        `)
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setMyRequests(data || []);
    } catch (error) {
      console.error('Error fetching my requests:', error);
    }
  };

  const fetchMyHelping = async () => {
    try {
      const { data, error } = await supabase
        .from('help_requests')
        .select(`
          *,
          requester:requester_id(id, first_name, last_name, avatar_url, major, year_level)
        `)
        .eq('helper_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setMyHelping(data || []);
    } catch (error) {
      console.error('Error fetching helping requests:', error);
    }
  };

  const checkVolunteerStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      setIsVolunteer(!!data);
    } catch (error) {
      console.error('Error checking volunteer status:', error);
    }
  };

  const handleVolunteerRegistration = async () => {
    try {
      const { error } = await supabase
        .from('volunteers')
        .insert([
          {
            user_id: user.id,
            skills: [],
            availability: 'flexible',
            status: 'active'
          }
        ]);
      
      if (error) throw error;
      
      setIsVolunteer(true);
      toast({
        title: "Success",
        description: "You are now registered as a volunteer!",
      });
    } catch (error) {
      console.error('Error registering as volunteer:', error);
      toast({
        title: "Error",
        description: "Failed to register as volunteer. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleOfferHelp = async (requestId) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to offer help.",
        variant: "destructive"
      });
      return;
    }

    if (!isVolunteer) {
      toast({
        title: "Volunteer registration required",
        description: "Please register as a volunteer first.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('help_requests')
        .update({ 
          helper_id: user.id,
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "You've offered to help! Connect with the student to get started.",
      });
      
      // Refresh requests
      fetchRequests();
      fetchMyHelping();
    } catch (error) {
      console.error('Error offering help:', error);
      toast({
        title: "Error",
        description: "Failed to offer help. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCompleteHelp = async (requestId) => {
    try {
      const { error } = await supabase
        .from('help_requests')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Help request marked as completed. Thank you for helping!",
      });
      
      // Refresh requests
      fetchMyHelping();
    } catch (error) {
      console.error('Error completing help request:', error);
      toast({
        title: "Error",
        description: "Failed to complete help request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      const { error } = await supabase
        .from('help_requests')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your help request has been cancelled.",
      });
      
      // Refresh requests
      fetchMyRequests();
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast({
        title: "Error",
        description: "Failed to cancel request. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Filter requests based on search and category
  const getFilteredRequests = () => {
    let filteredRequests = [...requests];
    
    // Apply search filter
    if (searchQuery) {
      filteredRequests = filteredRequests.filter(request => 
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.course_code?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filteredRequests = filteredRequests.filter(request => request.category === selectedCategory);
    }
    
    return filteredRequests;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-blue-500">Open</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-500">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container py-6 md:py-8 pattern-container">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Help A Student</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with fellow students for academic assistance and collaboration
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="browse" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
            <TabsTrigger value="browse">Browse Requests</TabsTrigger>
            <TabsTrigger value="create">Request Help</TabsTrigger>
            <TabsTrigger value="my-requests">My Requests</TabsTrigger>
            <TabsTrigger value="helping">I'm Helping</TabsTrigger>
          </TabsList>

          {/* Browse Requests Tab */}
          <TabsContent value="browse" className="space-y-6 mt-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input 
                  placeholder="Search by title, description, or course code..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full md:w-48">
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Volunteer Registration Banner */}
            {user && !isVolunteer && (
              <Card className="glass-card bg-primary/10 mb-6">
                <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Become a Volunteer</h3>
                    <p className="text-muted-foreground">
                      Help fellow students, earn recognition, and build your academic reputation
                    </p>
                  </div>
                  <Button onClick={handleVolunteerRegistration}>
                    Register as Volunteer
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Requests Grid */}
            {isLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading requests...</p>
              </div>
            ) : getFilteredRequests().length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">No help requests found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your search or filters, or create a new request</p>
                  <Button onClick={() => setActiveTab('create')}>
                    Request Help
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredRequests().map((request) => (
                  <Card key={request.id} className="glass-card h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge>{request.category}</Badge>
                        {request.urgency === 'high' && (
                          <Badge variant="destructive">Urgent</Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg mt-2">{request.title}</CardTitle>
                      <CardDescription>
                        {request.course_code && (
                          <span className="font-medium">{request.course_code} • </span>
                        )}
                        Posted {formatDate(request.created_at)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm line-clamp-3 mb-4">{request.description}</p>
                      
                      <div className="flex items-center gap-3 mt-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={request.requester?.avatar_url} alt={request.requester?.first_name} />
                          <AvatarFallback>{request.requester?.first_name?.[0]}{request.requester?.last_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{request.requester?.first_name} {request.requester?.last_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {request.requester?.year_level} • {request.requester?.major}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        className="w-full" 
                        onClick={() => handleOfferHelp(request.id)}
                        disabled={!user || request.requester_id === user.id}
                      >
                        Offer Help
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Create Request Tab */}
          <TabsContent value="create" className="space-y-6 mt-6">
            {!user ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">Sign in to request help</h3>
                  <p className="text-muted-foreground mb-6">
                    You need to sign in to create help requests
                  </p>
                  <Button asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <CreateHelpRequestForm 
                categories={categories} 
                onSuccess={() => {
                  fetchRequests();
                  fetchMyRequests();
                  setActiveTab('my-requests');
                }}
              />
            )}
          </TabsContent>

          {/* My Requests Tab */}
          <TabsContent value="my-requests" className="space-y-6 mt-6">
            {!user ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">Sign in to view your requests</h3>
                  <p className="text-muted-foreground mb-6">
                    You need to sign in to view your help requests
                  </p>
                  <Button asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : myRequests.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">No help requests yet</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't created any help requests yet
                  </p>
                  <Button onClick={() => setActiveTab('create')}>
                    Request Help
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myRequests.map((request) => (
                    <Card key={request.id} className="glass-card h-full flex flex-col">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <Badge>{request.category}</Badge>
                          {getStatusBadge(request.status)}
                        </div>
                        <CardTitle className="text-lg mt-2">{request.title}</CardTitle>
                        <CardDescription>
                          {request.course_code && (
                            <span className="font-medium">{request.course_code} • </span>
                          )}
                          Posted {formatDate(request.created_at)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm line-clamp-3 mb-4">{request.description}</p>
                        
                        {request.status === 'in_progress' && request.helper && (
                          <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                            <p className="text-sm font-medium mb-2">Your helper:</p>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={request.helper?.avatar_url} alt={request.helper?.first_name} />
                                <AvatarFallback>{request.helper?.first_name?.[0]}{request.helper?.last_name?.[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{request.helper?.first_name} {request.helper?.last_name}</p>
                                <Button variant="link" className="h-auto p-0 text-xs" asChild>
                                  <Link href={`/messages?user=${request.helper?.id}`}>
                                    Send Message
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {request.status === 'completed' && (
                          <div className="mt-4 p-3 bg-green-50 rounded-md">
                            <p className="text-sm font-medium text-green-800">
                              Completed on {formatDate(request.completed_at)}
                            </p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-0">
                        {request.status === 'open' && (
                          <Button 
                            variant="destructive" 
                            className="w-full" 
                            onClick={() => handleCancelRequest(request.id)}
                          >
                            Cancel Request
                          </Button>
                        )}
                        
                        {request.status === 'in_progress' && (
                          <div className="grid grid-cols-2 gap-2 w-full">
                            <Button 
                              variant="outline" 
                              asChild
                            >
                              <Link href={`/messages?user=${request.helper?.id}`}>
                                Message Helper
                              </Link>
                            </Button>
                            <Button 
                              variant="default"
                              onClick={() => {
                                // Open rating dialog
                                toast({
                                  title: "Rate your helper",
                                  description: "Feature coming soon!",
                                });
                              }}
                            >
                              Mark Complete
                            </Button>
                          </div>
                        )}
                        
                        {(request.status === 'completed' || request.status === 'cancelled') && (
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => setActiveTab('create')}
                          >
                            Create New Request
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Helping Tab */}
          <TabsContent value="helping" className="space-y-6 mt-6">
            {!user ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">Sign in to view helping activity</h3>
                  <p className="text-muted-foreground mb-6">
                    You need to sign in to view requests you're helping with
                  </p>
                  <Button asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : !isVolunteer ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">Become a volunteer</h3>
                  <p className="text-muted-foreground mb-6">
                    Register as a volunteer to help other students
                  </p>
                  <Button onClick={handleVolunteerRegistration}>
                    Register as Volunteer
                  </Button>
                </CardContent>
              </Card>
            ) : myHelping.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">Not helping anyone yet</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't offered help on any requests yet
                  </p>
                  <Button onClick={() => setActiveTab('browse')}>
                    Browse Help Requests
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myHelping.map((request) => (
                    <Card key={request.id} className="glass-card h-full flex flex-col">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <Badge>{request.category}</Badge>
                          {getStatusBadge(request.status)}
                        </div>
                        <CardTitle className="text-lg mt-2">{request.title}</CardTitle>
                        <CardDescription>
                          {request.course_code && (
                            <span className="font-medium">{request.course_code} • </span>
                          )}
                          Started helping {formatDate(request.updated_at)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm line-clamp-3 mb-4">{request.description}</p>
                        
                        <div className="mt-4 p-3 bg-blue-50 rounded-md">
                          <p className="text-sm font-medium mb-2">You're helping:</p>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={request.requester?.avatar_url} alt={request.requester?.first_name} />
                              <AvatarFallback>{request.requester?.first_name?.[0]}{request.requester?.last_name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{request.requester?.first_name} {request.requester?.last_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {request.requester?.year_level} • {request.requester?.major}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {request.status === 'completed' && (
                          <div className="mt-4 p-3 bg-green-50 rounded-md">
                            <p className="text-sm font-medium text-green-800">
                              Completed on {formatDate(request.completed_at)}
                            </p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-0">
                        {request.status === 'in_progress' && (
                          <div className="grid grid-cols-2 gap-2 w-full">
                            <Button 
                              variant="outline" 
                              asChild
                            >
                              <Link href={`/messages?user=${request.requester?.id}`}>
                                Message Student
                              </Link>
                            </Button>
                            <Button 
                              variant="default"
                              onClick={() => handleCompleteHelp(request.id)}
                            >
                              Mark Complete
                            </Button>
                          </div>
                        )}
                        
                        {request.status === 'completed' && (
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => setActiveTab('browse')}
                          >
                            Help Another Student
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Stats and Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Why Help Others?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Build Your Reputation</h3>
                  <p className="text-sm text-muted-foreground">Earn badges and recognition for your academic contributions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Reinforce Your Knowledge</h3>
                  <p className="text-sm text-muted-foreground">Teaching others is one of the best ways to master a subject</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Expand Your Network</h3>
                  <p className="text-sm text-muted-foreground">Connect with students across different majors and years</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                  <span className="font-semibold text-primary">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Create a Request</h3>
                  <p className="text-sm text-muted-foreground">Describe what you need help with, including course details and deadlines</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                  <span className="font-semibold text-primary">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Connect with Helpers</h3>
                  <p className="text-sm text-muted-foreground">Volunteers will offer to help, and you can communicate directly</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                  <span className="font-semibold text-primary">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Complete and Rate</h3>
                  <p className="text-sm text-muted-foreground">Mark requests as complete and rate your helper to build community trust</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                To maintain a helpful and respectful community, please follow these guidelines:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Be specific about what help you need</li>
                <li>Respect others' time and expertise</li>
                <li>Give credit for the help you receive</li>
                <li>Don't request help for graded assignments that should be done individually</li>
                <li>Provide honest feedback after receiving help</li>
                <li>Report any inappropriate behavior</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Remember, this platform is for collaborative learning, not for cheating or plagiarism.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CreateHelpRequestForm({ categories, onSuccess }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    course_code: '',
    urgency: 'normal',
    deadline: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleUrgencyChange = (value) => {
    setFormData(prev => ({
      ...prev,
      urgency: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a title for your help request",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.description.trim()) {
      toast({
        title: "Missing description",
        description: "Please describe what you need help with",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.category) {
      toast({
        title: "Missing category",
        description: "Please select a category for your help request",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('help_requests')
        .insert([
          {
            requester_id: user.id,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            course_code: formData.course_code || null,
            urgency: formData.urgency,
            deadline: formData.deadline || null,
            status: 'open'
          }
        ]);
      
      if (error) throw error;
      
      toast({
        title: "Help request created",
        description: "Your request has been posted. You'll be notified when someone offers to help.",
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        course_code: '',
        urgency: 'normal',
        deadline: ''
      });
      
      // Callback
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating help request:', error);
      toast({
        title: "Error",
        description: "Failed to create help request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Request Help</CardTitle>
        <CardDescription>
          Describe what you need help with and connect with fellow students
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input 
              id="title" 
              name="title" 
              placeholder="E.g., Help with Calculus Problem Set 3" 
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="Describe what you need help with in detail..." 
              rows={5}
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select 
                value={formData.category} 
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="course_code" className="text-sm font-medium">
                Course Code (Optional)
              </label>
              <Input 
                id="course_code" 
                name="course_code" 
                placeholder="E.g., MATH101" 
                value={formData.course_code}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="urgency" className="text-sm font-medium">
                Urgency
              </label>
              <Select 
                value={formData.urgency} 
                onValueChange={handleUrgencyChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - No rush</SelectItem>
                  <SelectItem value="normal">Normal - Within a few days</SelectItem>
                  <SelectItem value="high">High - Urgent (24-48 hours)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="deadline" className="text-sm font-medium">
                Deadline (Optional)
              </label>
              <Input 
                id="deadline" 
                name="deadline" 
                type="date" 
                value={formData.deadline}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                  Submitting...
                </>
              ) : 'Submit Request'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
