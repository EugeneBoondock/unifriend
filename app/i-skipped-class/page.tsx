'use client';

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

export default function SkippedClassPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [noteRequests, setNoteRequests] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [mySharedNotes, setMySharedNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [courses, setCourses] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    fetchInitialData();
    if (user) {
      fetchUserProfile();
      fetchUserData();
    }
  }, [user]);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      // Fetch public note requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('note_requests')
        .select(`
          *,
          requester:requester_id(id, first_name, last_name, avatar_url, major, year_level),
          helper:helper_id(id, first_name, last_name, avatar_url)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;
      setNoteRequests(requestsData || []);

      // Fetch public recordings
      const { data: recordingsData, error: recordingsError } = await supabase
        .from('lecture_recordings')
        .select(`
          *,
          uploader:uploader_id(id, first_name, last_name, avatar_url)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (recordingsError) throw recordingsError;
      setRecordings(recordingsData || []);

      // Extract unique courses
      const allCourses = new Set();
      requestsData?.forEach(request => {
        if (request.course_code) allCourses.add(request.course_code);
      });
      recordingsData?.forEach(recording => {
        if (recording.course_code) allCourses.add(recording.course_code);
      });
      
      setCourses(Array.from(allCourses));
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast({
        title: "Error",
        description: "Failed to load catch-up data. Please try again.",
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

  const fetchUserData = async () => {
    try {
      // Fetch user's note requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('note_requests')
        .select(`
          *,
          helper:helper_id(id, first_name, last_name, avatar_url)
        `)
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;
      setMyRequests(requestsData || []);

      // Fetch user's shared notes
      const { data: sharedData, error: sharedError } = await supabase
        .from('note_requests')
        .select(`
          *,
          requester:requester_id(id, first_name, last_name, avatar_url)
        `)
        .eq('helper_id', user.id)
        .order('created_at', { ascending: false });

      if (sharedError) throw sharedError;
      setMySharedNotes(sharedData || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
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

  // Filter requests based on search and course
  const getFilteredRequests = () => {
    let filteredRequests = [...noteRequests];
    
    // Apply search filter
    if (searchQuery) {
      filteredRequests = filteredRequests.filter(request => 
        request.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.course_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.lecture_date?.includes(searchQuery)
      );
    }
    
    // Apply course filter
    if (selectedCourse !== 'all') {
      filteredRequests = filteredRequests.filter(request => request.course_code === selectedCourse);
    }
    
    return filteredRequests;
  };

  // Filter recordings based on search and course
  const getFilteredRecordings = () => {
    let filteredRecordings = [...recordings];
    
    // Apply search filter
    if (searchQuery) {
      filteredRecordings = filteredRecordings.filter(recording => 
        recording.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recording.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recording.course_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recording.lecture_date?.includes(searchQuery)
      );
    }
    
    // Apply course filter
    if (selectedCourse !== 'all') {
      filteredRecordings = filteredRecordings.filter(recording => recording.course_code === selectedCourse);
    }
    
    return filteredRecordings;
  };

  const handleShareNotes = async (requestId) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to share notes.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('note_requests')
        .update({ 
          helper_id: user.id,
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "You've offered to share notes! Connect with the student to coordinate.",
      });
      
      // Refresh requests
      fetchInitialData();
      fetchUserData();
    } catch (error) {
      console.error('Error offering to share notes:', error);
      toast({
        title: "Error",
        description: "Failed to offer help. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCompleteRequest = async (requestId) => {
    try {
      const { error } = await supabase
        .from('note_requests')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Note request marked as completed. Thank you for sharing!",
      });
      
      // Refresh requests
      fetchUserData();
    } catch (error) {
      console.error('Error completing note request:', error);
      toast({
        title: "Error",
        description: "Failed to complete request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      const { error } = await supabase
        .from('note_requests')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your note request has been cancelled.",
      });
      
      // Refresh requests
      fetchUserData();
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast({
        title: "Error",
        description: "Failed to cancel request. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container py-6 md:py-8 pattern-container">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">I Skipped Class</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Catch up on missed lectures with notes, recordings, and help from classmates
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full max-w-3xl mx-auto">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="note-requests">Note Requests</TabsTrigger>
            <TabsTrigger value="recordings">Recordings</TabsTrigger>
            <TabsTrigger value="my-requests">My Requests</TabsTrigger>
            <TabsTrigger value="shared-notes">Shared Notes</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6 mt-6">
            {!user ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">Sign in to access your dashboard</h3>
                  <p className="text-muted-foreground mb-6">
                    Track your note requests, shared notes, and more
                  </p>
                  <Button asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* User Profile Card */}
                  <Card className="glass-card">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <Avatar className="h-20 w-20 mb-4">
                          <AvatarImage src={userProfile?.avatar_url} alt={userProfile?.first_name} />
                          <AvatarFallback>{userProfile?.first_name?.[0]}{userProfile?.last_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-semibold">{userProfile?.first_name} {userProfile?.last_name}</h3>
                        <p className="text-muted-foreground">{userProfile?.major} • {userProfile?.year_level}</p>
                        
                        <div className="mt-6 w-full grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-2xl font-bold">{myRequests.length}</p>
                            <p className="text-xs text-muted-foreground">Note Requests</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{mySharedNotes.length}</p>
                            <p className="text-xs text-muted-foreground">Shared Notes</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">0</p>
                            <p className="text-xs text-muted-foreground">Recordings</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Quick Actions */}
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button className="w-full" onClick={() => setActiveTab('note-requests')}>
                        Request Class Notes
                      </Button>
                      <Button className="w-full" variant="outline" onClick={() => setActiveTab('recordings')}>
                        Find Lecture Recordings
                      </Button>
                      <Button className="w-full" variant="outline" asChild>
                        <Link href="/help-a-student">
                          Get Homework Help
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Middle Column */}
                <div className="space-y-6">
                  {/* Recent Note Requests */}
                  <Card className="glass-card">
                    <CardHeader className="pb-2">
                      <CardTitle>Recent Note Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {noteRequests.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          No recent note requests
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {noteRequests.slice(0, 3).map((request) => (
                            <div key={request.id} className="flex items-start gap-3 border rounded-lg p-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={request.requester?.avatar_url} alt={request.requester?.first_name} />
                                <AvatarFallback>{request.requester?.first_name?.[0]}{request.requester?.last_name?.[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h4 className="font-medium text-sm">{request.title}</h4>
                                  <Badge variant="outline">{request.course_code}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {request.lecture_date ? `Lecture date: ${formatDate(request.lecture_date)}` : 'Date not specified'}
                                </p>
                              </div>
                            </div>
                          ))}
                          <Button variant="link" size="sm" className="w-full" onClick={() => setActiveTab('note-requests')}>
                            View All Requests
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* My Recent Requests */}
                  <Card className="glass-card">
                    <CardHeader className="pb-2">
                      <CardTitle>My Recent Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {myRequests.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground mb-4">
                            You haven't made any note requests yet
                          </p>
                          <Button size="sm" onClick={() => setActiveTab('note-requests')}>
                            Request Notes
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {myRequests.slice(0, 3).map((request) => (
                            <div key={request.id} className="border rounded-lg p-3">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-sm">{request.title}</h4>
                                {getStatusBadge(request.status)}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {request.course_code} • {formatDate(request.created_at)}
                              </p>
                              {request.status === 'in_progress' && request.helper && (
                                <div className="mt-2 text-xs">
                                  <span className="text-muted-foreground">Helper: </span>
                                  <span className="font-medium">{request.helper.first_name} {request.helper.last_name}</span>
                                </div>
                              )}
                            </div>
                          ))}
                          <Button variant="link" size="sm" className="w-full" onClick={() => setActiveTab('my-requests')}>
                            View All My Requests
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                {/* Right Column */}
                <div className="space-y-6">
                  {/* Recent Recordings */}
                  <Card className="glass-card">
                    <CardHeader className="pb-2">
                      <CardTitle>Recent Recordings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {recordings.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          No recent recordings available
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {recordings.slice(0, 3).map((recording) => (
                            <div key={recording.id} className="flex items-start gap-3 border rounded-lg p-3">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h4 className="font-medium text-sm">{recording.title}</h4>
                                  <Badge variant="outline">{recording.course_code}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {recording.lecture_date ? `Lecture date: ${formatDate(recording.lecture_date)}` : 'Date not specified'}
                                </p>
                              </div>
                            </div>
                          ))}
                          <Button variant="link" size="sm" className="w-full" onClick={() => setActiveTab('recordings')}>
                            View All Recordings
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Tips for Catching Up */}
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Catch-Up Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Contact Your Professor</h3>
                          <p className="text-xs text-muted-foreground">Let them know you missed class and ask for guidance</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Review the Syllabus</h3>
                          <p className="text-xs text-muted-foreground">Check what topics were covered in the missed class</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Plan Extra Study Time</h3>
                          <p className="text-xs text-muted-foreground">Schedule additional time to catch up on the material</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <Card className="glass-card hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Request Notes</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ask classmates to share their notes from missed lectures
                  </p>
                  <Button size="sm" onClick={() => setActiveTab('note-requests')}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="glass-card hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Find Recordings</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Access lecture recordings shared by professors and students
                  </p>
                  <Button size="sm" onClick={() => setActiveTab('recordings')}>
                    Browse Recordings
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="glass-card hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Get Tutoring</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect with tutors who can help you understand missed material
                  </p>
                  <Button size="sm" asChild>
                    <Link href="/help-a-student">
                      Find Tutors
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="glass-card hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Study Resources</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Find textbooks, guides, and other materials to help you catch up
                  </p>
                  <Button size="sm" asChild>
                    <Link href="/exam-preparation/resources">
                      Browse Resources
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Note Requests Tab */}
          <TabsContent value="note-requests" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Note Requests</h2>
              {user && (
                <Button onClick={() => setActiveTab('create-request')}>
                  Request Notes
                </Button>
              )}
            </div>
            
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
                  value={selectedCourse} 
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="all">All Courses</option>
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Create Request Form */}
            {activeTab === 'create-request' ? (
              !user ? (
                <Card className="glass-card">
                  <CardContent className="text-center py-10">
                    <h3 className="text-lg font-semibold mb-2">Sign in to request notes</h3>
                    <p className="text-muted-foreground mb-6">
                      You need to sign in to create note requests
                    </p>
                    <Button asChild>
                      <Link href="/signin">Sign In</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <CreateNoteRequestForm 
                  onSuccess={() => {
                    fetchInitialData();
                    fetchUserData();
                    setActiveTab('my-requests');
                  }}
                  onCancel={() => setActiveTab('note-requests')}
                />
              )
            ) : (
              <>
                {/* Requests Grid */}
                {isLoading ? (
                  <div className="text-center py-10">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading requests...</p>
                  </div>
                ) : getFilteredRequests().length === 0 ? (
                  <Card className="glass-card">
                    <CardContent className="text-center py-10">
                      <h3 className="text-lg font-semibold mb-2">No note requests found</h3>
                      <p className="text-muted-foreground mb-6">Try adjusting your search or filters, or create a new request</p>
                      {user ? (
                        <Button onClick={() => setActiveTab('create-request')}>
                          Request Notes
                        </Button>
                      ) : (
                        <Button asChild>
                          <Link href="/signin">Sign In to Request Notes</Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getFilteredRequests().map((request) => (
                      <Card key={request.id} className="glass-card h-full flex flex-col">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <Badge>{request.course_code}</Badge>
                            {request.urgency === 'high' && (
                              <Badge variant="destructive">Urgent</Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg mt-2">{request.title}</CardTitle>
                          <CardDescription>
                            {request.lecture_date ? (
                              <span>Lecture date: {formatDate(request.lecture_date)}</span>
                            ) : (
                              <span>Posted {formatDate(request.created_at)}</span>
                            )}
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
                            onClick={() => handleShareNotes(request.id)}
                            disabled={!user || request.requester_id === user.id}
                          >
                            Share Notes
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Recordings Tab */}
          <TabsContent value="recordings" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Lecture Recordings</h2>
              {user && (
                <Button asChild>
                  <Link href="/i-skipped-class/upload-recording">
                    Upload Recording
                  </Link>
                </Button>
              )}
            </div>
            
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
                  value={selectedCourse} 
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="all">All Courses</option>
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Recordings Grid */}
            {isLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading recordings...</p>
              </div>
            ) : getFilteredRecordings().length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">No recordings found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your search or filters, or upload a new recording</p>
                  {user ? (
                    <Button asChild>
                      <Link href="/i-skipped-class/upload-recording">
                        Upload Recording
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild>
                      <Link href="/signin">Sign In to Upload</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredRecordings().map((recording) => (
                  <Card key={recording.id} className="glass-card h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge>{recording.course_code}</Badge>
                        <Badge variant="outline">{recording.duration || 'Unknown'} min</Badge>
                      </div>
                      <CardTitle className="text-lg mt-2">{recording.title}</CardTitle>
                      <CardDescription>
                        {recording.lecture_date ? (
                          <span>Lecture date: {formatDate(recording.lecture_date)}</span>
                        ) : (
                          <span>Uploaded on {formatDate(recording.created_at)}</span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm line-clamp-3 mb-4">{recording.description || 'No description provided.'}</p>
                      
                      <div className="flex items-center gap-3 mt-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={recording.uploader?.avatar_url} alt={recording.uploader?.first_name} />
                          <AvatarFallback>{recording.uploader?.first_name?.[0]}{recording.uploader?.last_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{recording.uploader?.first_name} {recording.uploader?.last_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {recording.uploader_type || 'Student'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button className="w-full" asChild>
                        <Link href={`/i-skipped-class/recordings/${recording.id}`}>
                          Watch Recording
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* My Requests Tab */}
          <TabsContent value="my-requests" className="space-y-6 mt-6">
            {!user ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">Sign in to view your requests</h3>
                  <p className="text-muted-foreground mb-6">
                    You need to sign in to view your note requests
                  </p>
                  <Button asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : myRequests.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">No note requests yet</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't created any note requests yet
                  </p>
                  <Button onClick={() => setActiveTab('create-request')}>
                    Request Notes
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">My Note Requests</h2>
                  <Button onClick={() => setActiveTab('create-request')}>
                    New Request
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myRequests.map((request) => (
                    <Card key={request.id} className="glass-card h-full flex flex-col">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <Badge>{request.course_code}</Badge>
                          {getStatusBadge(request.status)}
                        </div>
                        <CardTitle className="text-lg mt-2">{request.title}</CardTitle>
                        <CardDescription>
                          {request.lecture_date ? (
                            <span>Lecture date: {formatDate(request.lecture_date)}</span>
                          ) : (
                            <span>Posted {formatDate(request.created_at)}</span>
                          )}
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
                            onClick={() => setActiveTab('create-request')}
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

          {/* Shared Notes Tab */}
          <TabsContent value="shared-notes" className="space-y-6 mt-6">
            {!user ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">Sign in to view shared notes</h3>
                  <p className="text-muted-foreground mb-6">
                    You need to sign in to view notes you've shared
                  </p>
                  <Button asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : mySharedNotes.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">No shared notes yet</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't shared notes with anyone yet
                  </p>
                  <Button onClick={() => setActiveTab('note-requests')}>
                    Browse Note Requests
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Notes I've Shared</h2>
                  <Button onClick={() => setActiveTab('note-requests')}>
                    Help More Students
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mySharedNotes.map((request) => (
                    <Card key={request.id} className="glass-card h-full flex flex-col">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <Badge>{request.course_code}</Badge>
                          {getStatusBadge(request.status)}
                        </div>
                        <CardTitle className="text-lg mt-2">{request.title}</CardTitle>
                        <CardDescription>
                          {request.lecture_date ? (
                            <span>Lecture date: {formatDate(request.lecture_date)}</span>
                          ) : (
                            <span>Started helping {formatDate(request.updated_at)}</span>
                          )}
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
                              onClick={() => handleCompleteRequest(request.id)}
                            >
                              Mark Complete
                            </Button>
                          </div>
                        )}
                        
                        {request.status === 'completed' && (
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => setActiveTab('note-requests')}
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
        
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Why Request Notes?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Don't Fall Behind</h3>
                  <p className="text-sm text-muted-foreground">Missing one class can lead to confusion in future lectures</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Different Perspectives</h3>
                  <p className="text-sm text-muted-foreground">See how other students interpreted and organized the material</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Build Connections</h3>
                  <p className="text-sm text-muted-foreground">Connect with classmates who can help with future questions</p>
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
                  <p className="text-sm text-muted-foreground">Specify the course, lecture date, and what you need</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                  <span className="font-semibold text-primary">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Connect with Helpers</h3>
                  <p className="text-sm text-muted-foreground">Classmates who attended will offer to share their notes</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                  <span className="font-semibold text-primary">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Catch Up Quickly</h3>
                  <p className="text-sm text-muted-foreground">Review the shared notes and ask questions if needed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Tips for Sharing Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                When sharing your notes with others:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Make sure your handwriting is legible or type up your notes</li>
                <li>Include the date, course name, and topic at the top</li>
                <li>Highlight key concepts and important points</li>
                <li>Include any announcements or deadlines mentioned</li>
                <li>Add your own insights or questions in a different color</li>
                <li>Consider sharing photos of diagrams or board work</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Remember, helping others builds community and reinforces your own understanding!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CreateNoteRequestForm({ onSuccess, onCancel }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_code: '',
    lecture_date: '',
    urgency: 'normal',
    notes_format: 'any'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUrgencyChange = (value) => {
    setFormData(prev => ({
      ...prev,
      urgency: value
    }));
  };

  const handleFormatChange = (value) => {
    setFormData(prev => ({
      ...prev,
      notes_format: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a title for your note request",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.course_code.trim()) {
      toast({
        title: "Missing course code",
        description: "Please enter the course code for your note request",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('note_requests')
        .insert([
          {
            requester_id: user.id,
            title: formData.title,
            description: formData.description,
            course_code: formData.course_code,
            lecture_date: formData.lecture_date || null,
            urgency: formData.urgency,
            notes_format: formData.notes_format,
            status: 'open'
          }
        ]);
      
      if (error) throw error;
      
      toast({
        title: "Note request created",
        description: "Your request has been posted. You'll be notified when someone offers to share notes.",
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        course_code: '',
        lecture_date: '',
        urgency: 'normal',
        notes_format: 'any'
      });
      
      // Callback
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating note request:', error);
      toast({
        title: "Error",
        description: "Failed to create note request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Request Class Notes</CardTitle>
        <CardDescription>
          Ask classmates to share their notes from a lecture you missed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Request Title
            </label>
            <Input 
              id="title" 
              name="title" 
              placeholder="E.g., Need notes for Biology lecture on DNA Replication" 
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
              placeholder="Provide details about what you need, why you missed class, specific topics covered, etc." 
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="course_code" className="text-sm font-medium">
                Course Code
              </label>
              <Input 
                id="course_code" 
                name="course_code" 
                placeholder="E.g., BIO101" 
                value={formData.course_code}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="lecture_date" className="text-sm font-medium">
                Lecture Date
              </label>
              <Input 
                id="lecture_date" 
                name="lecture_date" 
                type="date" 
                value={formData.lecture_date}
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
                  <SelectItem value="high">High - Urgent (ASAP)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes_format" className="text-sm font-medium">
                Preferred Format
              </label>
              <Select 
                value={formData.notes_format} 
                onValueChange={handleFormatChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any format</SelectItem>
                  <SelectItem value="digital">Digital (typed)</SelectItem>
                  <SelectItem value="handwritten">Handwritten (scanned/photo)</SelectItem>
                  <SelectItem value="audio">Audio recording</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="pt-4 flex gap-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
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
