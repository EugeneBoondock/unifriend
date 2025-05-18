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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export default function AssignmentPlaygroundPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [assignments, setAssignments] = useState([]);
  const [myAssignments, setMyAssignments] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [subjects, setSubjects] = useState([]);
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
      // Fetch public assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select(`
          *,
          creator:creator_id(id, first_name, last_name, avatar_url, major, year_level),
          collaborators:assignment_collaborators(
            user_id,
            user:user_id(id, first_name, last_name, avatar_url)
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (assignmentsError) throw assignmentsError;
      setAssignments(assignmentsData || []);

      // Fetch assignment templates
      const { data: templatesData, error: templatesError } = await supabase
        .from('assignment_templates')
        .select(`
          *,
          creator:creator_id(id, first_name, last_name, avatar_url)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (templatesError) throw templatesError;
      setTemplates(templatesData || []);

      // Extract unique subjects
      const allSubjects = new Set();
      assignmentsData?.forEach(assignment => {
        if (assignment.subject) allSubjects.add(assignment.subject);
      });
      templatesData?.forEach(template => {
        if (template.subject) allSubjects.add(template.subject);
      });
      
      setSubjects(Array.from(allSubjects));
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast({
        title: "Error",
        description: "Failed to load assignment data. Please try again.",
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
      // Fetch user's assignments
      const { data: myAssignmentsData, error: myAssignmentsError } = await supabase
        .from('assignments')
        .select(`
          *,
          collaborators:assignment_collaborators(
            user_id,
            user:user_id(id, first_name, last_name, avatar_url)
          )
        `)
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (myAssignmentsError) throw myAssignmentsError;
      setMyAssignments(myAssignmentsData || []);

      // Fetch user's collaborations
      const { data: collaborationsData, error: collaborationsError } = await supabase
        .from('assignment_collaborators')
        .select(`
          *,
          assignment:assignment_id(
            id,
            title,
            description,
            subject,
            due_date,
            status,
            created_at,
            creator_id,
            creator:creator_id(id, first_name, last_name, avatar_url)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (collaborationsError) throw collaborationsError;
      
      // Transform the data to get just the assignments
      const collaborationAssignments = collaborationsData?.map(collab => collab.assignment) || [];
      setCollaborations(collaborationAssignments);
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
      case 'not_started':
        return <Badge className="bg-gray-500">Not Started</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'review':
        return <Badge className="bg-yellow-500">Under Review</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getDaysRemaining = (dueDateString) => {
    if (!dueDateString) return null;
    
    const dueDate = new Date(dueDateString);
    const today = new Date();
    
    // Set time to midnight for accurate day calculation
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const getDueDateDisplay = (dueDateString) => {
    const daysRemaining = getDaysRemaining(dueDateString);
    
    if (daysRemaining === null) return 'No due date';
    
    if (daysRemaining < 0) {
      return <span className="text-red-500">Overdue by {Math.abs(daysRemaining)} days</span>;
    } else if (daysRemaining === 0) {
      return <span className="text-red-500">Due today</span>;
    } else if (daysRemaining === 1) {
      return <span className="text-yellow-500">Due tomorrow</span>;
    } else if (daysRemaining <= 3) {
      return <span className="text-yellow-500">Due in {daysRemaining} days</span>;
    } else {
      return <span>Due in {daysRemaining} days</span>;
    }
  };

  // Filter assignments based on search and subject
  const getFilteredAssignments = () => {
    let filteredAssignments = [...assignments];
    
    // Apply search filter
    if (searchQuery) {
      filteredAssignments = filteredAssignments.filter(assignment => 
        assignment.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.subject?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply subject filter
    if (selectedSubject !== 'all') {
      filteredAssignments = filteredAssignments.filter(assignment => assignment.subject === selectedSubject);
    }
    
    return filteredAssignments;
  };

  // Filter templates based on search and subject
  const getFilteredTemplates = () => {
    let filteredTemplates = [...templates];
    
    // Apply search filter
    if (searchQuery) {
      filteredTemplates = filteredTemplates.filter(template => 
        template.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.subject?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply subject filter
    if (selectedSubject !== 'all') {
      filteredTemplates = filteredTemplates.filter(template => template.subject === selectedSubject);
    }
    
    return filteredTemplates;
  };

  const calculateProgress = (assignment) => {
    if (!assignment.tasks || assignment.tasks.length === 0) return 0;
    
    const completedTasks = assignment.tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / assignment.tasks.length) * 100);
  };

  const handleJoinAssignment = async (assignmentId) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to join assignments.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if already a collaborator
      const { data: existingCollab, error: checkError } = await supabase
        .from('assignment_collaborators')
        .select('*')
        .eq('assignment_id', assignmentId)
        .eq('user_id', user.id)
        .single();
      
      if (!checkError && existingCollab) {
        toast({
          title: "Already joined",
          description: "You are already a collaborator on this assignment.",
        });
        return;
      }
      
      // Add as collaborator
      const { error } = await supabase
        .from('assignment_collaborators')
        .insert([
          {
            assignment_id: assignmentId,
            user_id: user.id,
            role: 'collaborator',
            joined_at: new Date().toISOString()
          }
        ]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "You've joined the assignment as a collaborator.",
      });
      
      // Refresh data
      fetchInitialData();
      fetchUserData();
    } catch (error) {
      console.error('Error joining assignment:', error);
      toast({
        title: "Error",
        description: "Failed to join assignment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUseTemplate = async (templateId) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to use templates.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get template details
      const { data: template, error: templateError } = await supabase
        .from('assignment_templates')
        .select('*')
        .eq('id', templateId)
        .single();
      
      if (templateError) throw templateError;
      
      // Create new assignment from template
      const { data: newAssignment, error } = await supabase
        .from('assignments')
        .insert([
          {
            creator_id: user.id,
            title: `${template.title} (from template)`,
            description: template.description,
            subject: template.subject,
            is_public: false,
            status: 'not_started',
            tasks: template.tasks || [],
            template_id: templateId
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Template applied",
        description: "A new assignment has been created from the template.",
      });
      
      // Refresh user data
      fetchUserData();
      
      // Navigate to the new assignment
      setActiveTab('my-assignments');
    } catch (error) {
      console.error('Error using template:', error);
      toast({
        title: "Error",
        description: "Failed to create assignment from template. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container py-6 md:py-8 pattern-container">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Assignment Playground</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Collaborate on assignments, use templates, and get feedback from peers
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full max-w-3xl mx-auto">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="assignments">Public Assignments</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="my-assignments">My Assignments</TabsTrigger>
            <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6 mt-6">
            {!user ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">Sign in to access your dashboard</h3>
                  <p className="text-muted-foreground mb-6">
                    Track your assignments, collaborations, and more
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
                            <p className="text-2xl font-bold">{myAssignments.length}</p>
                            <p className="text-xs text-muted-foreground">My Assignments</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{collaborations.length}</p>
                            <p className="text-xs text-muted-foreground">Collaborations</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{myAssignments.filter(a => a.status === 'completed').length}</p>
                            <p className="text-xs text-muted-foreground">Completed</p>
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
                      <Button className="w-full" onClick={() => setActiveTab('create-assignment')}>
                        Create New Assignment
                      </Button>
                      <Button className="w-full" variant="outline" onClick={() => setActiveTab('templates')}>
                        Browse Templates
                      </Button>
                      <Button className="w-full" variant="outline" asChild>
                        <Link href="/help-a-student">
                          Get Assignment Help
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Middle Column */}
                <div className="space-y-6">
                  {/* Upcoming Deadlines */}
                  <Card className="glass-card">
                    <CardHeader className="pb-2">
                      <CardTitle>Upcoming Deadlines</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {myAssignments.length === 0 && collaborations.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          No upcoming deadlines
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {[...myAssignments, ...collaborations]
                            .filter(a => a.due_date && new Date(a.due_date) >= new Date())
                            .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
                            .slice(0, 3)
                            .map((assignment) => (
                              <div key={assignment.id} className="flex items-start gap-3 border rounded-lg p-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between">
                                    <h4 className="font-medium text-sm">{assignment.title}</h4>
                                    <Badge variant="outline">{assignment.subject}</Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {getDueDateDisplay(assignment.due_date)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          {[...myAssignments, ...collaborations].filter(a => a.due_date && new Date(a.due_date) >= new Date()).length > 3 && (
                            <Button variant="link" size="sm" className="w-full" onClick={() => setActiveTab('my-assignments')}>
                              View All Deadlines
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Recent Activity */}
                  <Card className="glass-card">
                    <CardHeader className="pb-2">
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[...myAssignments, ...collaborations]
                          .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
                          .slice(0, 3)
                          .map((assignment) => (
                            <div key={assignment.id} className="border rounded-lg p-3">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-sm">{assignment.title}</h4>
                                {getStatusBadge(assignment.status)}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {assignment.subject} • Last updated: {formatDate(assignment.updated_at || assignment.created_at)}
                              </p>
                              <div className="mt-2">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Progress</span>
                                  <span>{calculateProgress(assignment)}%</span>
                                </div>
                                <Progress value={calculateProgress(assignment)} className="h-2" />
                              </div>
                            </div>
                          ))}
                        <Button variant="link" size="sm" className="w-full" onClick={() => setActiveTab('my-assignments')}>
                          View All Assignments
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Right Column */}
                <div className="space-y-6">
                  {/* Collaborations */}
                  <Card className="glass-card">
                    <CardHeader className="pb-2">
                      <CardTitle>Recent Collaborations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {collaborations.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          No collaborations yet
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {collaborations.slice(0, 3).map((assignment) => (
                            <div key={assignment.id} className="flex items-start gap-3 border rounded-lg p-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={assignment.creator?.avatar_url} alt={assignment.creator?.first_name} />
                                <AvatarFallback>{assignment.creator?.first_name?.[0]}{assignment.creator?.last_name?.[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h4 className="font-medium text-sm">{assignment.title}</h4>
                                  <Badge variant="outline">{assignment.subject}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Created by {assignment.creator?.first_name} {assignment.creator?.last_name}
                                </p>
                              </div>
                            </div>
                          ))}
                          <Button variant="link" size="sm" className="w-full" onClick={() => setActiveTab('collaborations')}>
                            View All Collaborations
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Assignment Tips */}
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Assignment Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Break It Down</h3>
                          <p className="text-xs text-muted-foreground">Divide assignments into smaller, manageable tasks</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Start Early</h3>
                          <p className="text-xs text-muted-foreground">Begin working on assignments as soon as they're assigned</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Collaborate</h3>
                          <p className="text-xs text-muted-foreground">Work with peers to share ideas and get feedback</p>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Create Assignment</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start a new assignment and invite collaborators
                  </p>
                  <Button size="sm" onClick={() => setActiveTab('create-assignment')}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="glass-card hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Use Templates</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start with pre-made templates for common assignments
                  </p>
                  <Button size="sm" onClick={() => setActiveTab('templates')}>
                    Browse Templates
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
                  <h3 className="font-semibold mb-2">Collaborate</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Join public assignments and work with other students
                  </p>
                  <Button size="sm" onClick={() => setActiveTab('assignments')}>
                    Find Assignments
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="glass-card hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Plagiarism Check</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Verify your work is original before submission
                  </p>
                  <Button size="sm" asChild>
                    <Link href="/assignment-playground/plagiarism-check">
                      Check Now
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Public Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Public Assignments</h2>
              {user && (
                <Button onClick={() => setActiveTab('create-assignment')}>
                  Create Assignment
                </Button>
              )}
            </div>
            
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input 
                  placeholder="Search by title, description, or subject..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full md:w-48">
                <select 
                  value={selectedSubject} 
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Create Assignment Form */}
            {activeTab === 'create-assignment' ? (
              !user ? (
                <Card className="glass-card">
                  <CardContent className="text-center py-10">
                    <h3 className="text-lg font-semibold mb-2">Sign in to create assignments</h3>
                    <p className="text-muted-foreground mb-6">
                      You need to sign in to create and manage assignments
                    </p>
                    <Button asChild>
                      <Link href="/signin">Sign In</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <CreateAssignmentForm 
                  onSuccess={() => {
                    fetchInitialData();
                    fetchUserData();
                    setActiveTab('my-assignments');
                  }}
                  onCancel={() => setActiveTab('assignments')}
                />
              )
            ) : (
              <>
                {/* Assignments Grid */}
                {isLoading ? (
                  <div className="text-center py-10">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading assignments...</p>
                  </div>
                ) : getFilteredAssignments().length === 0 ? (
                  <Card className="glass-card">
                    <CardContent className="text-center py-10">
                      <h3 className="text-lg font-semibold mb-2">No assignments found</h3>
                      <p className="text-muted-foreground mb-6">Try adjusting your search or filters, or create a new assignment</p>
                      {user ? (
                        <Button onClick={() => setActiveTab('create-assignment')}>
                          Create Assignment
                        </Button>
                      ) : (
                        <Button asChild>
                          <Link href="/signin">Sign In to Create</Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getFilteredAssignments().map((assignment) => (
                      <Card key={assignment.id} className="glass-card h-full flex flex-col">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <Badge>{assignment.subject}</Badge>
                            {getStatusBadge(assignment.status)}
                          </div>
                          <CardTitle className="text-lg mt-2">{assignment.title}</CardTitle>
                          <CardDescription>
                            {assignment.due_date ? (
                              <span>{getDueDateDisplay(assignment.due_date)}</span>
                            ) : (
                              <span>Created {formatDate(assignment.created_at)}</span>
                            )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <p className="text-sm line-clamp-3 mb-4">{assignment.description}</p>
                          
                          <div className="mt-4">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>{calculateProgress(assignment)}%</span>
                            </div>
                            <Progress value={calculateProgress(assignment)} className="h-2" />
                          </div>
                          
                          <div className="flex items-center gap-3 mt-4">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={assignment.creator?.avatar_url} alt={assignment.creator?.first_name} />
                              <AvatarFallback>{assignment.creator?.first_name?.[0]}{assignment.creator?.last_name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{assignment.creator?.first_name} {assignment.creator?.last_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {assignment.creator?.year_level} • {assignment.creator?.major}
                              </p>
                            </div>
                          </div>
                          
                          {assignment.collaborators && assignment.collaborators.length > 0 && (
                            <div className="mt-4">
                              <p className="text-xs text-muted-foreground mb-2">Collaborators:</p>
                              <div className="flex -space-x-2">
                                {assignment.collaborators.slice(0, 3).map((collab) => (
                                  <Avatar key={collab.user_id} className="h-6 w-6 border-2 border-background">
                                    <AvatarImage src={collab.user?.avatar_url} alt={collab.user?.first_name} />
                                    <AvatarFallback>{collab.user?.first_name?.[0]}</AvatarFallback>
                                  </Avatar>
                                ))}
                                {assignment.collaborators.length > 3 && (
                                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                                    +{assignment.collaborators.length - 3}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button 
                            className="w-full" 
                            onClick={() => handleJoinAssignment(assignment.id)}
                            disabled={!user || assignment.creator_id === user.id || assignment.collaborators?.some(c => c.user_id === user.id)}
                          >
                            {!user ? 'Sign in to Join' : 
                              assignment.creator_id === user.id ? 'Your Assignment' : 
                              assignment.collaborators?.some(c => c.user_id === user.id) ? 'Already Joined' : 
                              'Join Assignment'}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Assignment Templates</h2>
              {user && (
                <Button asChild>
                  <Link href="/assignment-playground/create-template">
                    Create Template
                  </Link>
                </Button>
              )}
            </div>
            
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input 
                  placeholder="Search by title, description, or subject..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full md:w-48">
                <select 
                  value={selectedSubject} 
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Templates Grid */}
            {isLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading templates...</p>
              </div>
            ) : getFilteredTemplates().length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">No templates found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your search or filters, or create a new template</p>
                  {user ? (
                    <Button asChild>
                      <Link href="/assignment-playground/create-template">
                        Create Template
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild>
                      <Link href="/signin">Sign In to Create</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredTemplates().map((template) => (
                  <Card key={template.id} className="glass-card h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge>{template.subject}</Badge>
                        <Badge variant="outline">{template.template_type || 'General'}</Badge>
                      </div>
                      <CardTitle className="text-lg mt-2">{template.title}</CardTitle>
                      <CardDescription>
                        <span>Created {formatDate(template.created_at)}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm line-clamp-3 mb-4">{template.description}</p>
                      
                      {template.tasks && template.tasks.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-medium mb-2">Included Tasks:</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {template.tasks.slice(0, 3).map((task, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{task.title}</span>
                              </li>
                            ))}
                            {template.tasks.length > 3 && (
                              <li className="text-xs text-muted-foreground">
                                +{template.tasks.length - 3} more tasks
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3 mt-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={template.creator?.avatar_url} alt={template.creator?.first_name} />
                          <AvatarFallback>{template.creator?.first_name?.[0]}{template.creator?.last_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{template.creator?.first_name} {template.creator?.last_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {template.creator_type || 'Student'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        className="w-full" 
                        onClick={() => handleUseTemplate(template.id)}
                        disabled={!user}
                      >
                        {!user ? 'Sign in to Use' : 'Use Template'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* My Assignments Tab */}
          <TabsContent value="my-assignments" className="space-y-6 mt-6">
            {!user ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">Sign in to view your assignments</h3>
                  <p className="text-muted-foreground mb-6">
                    You need to sign in to view and manage your assignments
                  </p>
                  <Button asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : myAssignments.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">No assignments yet</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't created any assignments yet
                  </p>
                  <Button onClick={() => setActiveTab('create-assignment')}>
                    Create Assignment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">My Assignments</h2>
                  <Button onClick={() => setActiveTab('create-assignment')}>
                    New Assignment
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myAssignments.map((assignment) => (
                    <Card key={assignment.id} className="glass-card h-full flex flex-col">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <Badge>{assignment.subject}</Badge>
                          {getStatusBadge(assignment.status)}
                        </div>
                        <CardTitle className="text-lg mt-2">{assignment.title}</CardTitle>
                        <CardDescription>
                          {assignment.due_date ? (
                            <span>{getDueDateDisplay(assignment.due_date)}</span>
                          ) : (
                            <span>Created {formatDate(assignment.created_at)}</span>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm line-clamp-3 mb-4">{assignment.description}</p>
                        
                        <div className="mt-4">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{calculateProgress(assignment)}%</span>
                          </div>
                          <Progress value={calculateProgress(assignment)} className="h-2" />
                        </div>
                        
                        {assignment.collaborators && assignment.collaborators.length > 0 && (
                          <div className="mt-4">
                            <p className="text-xs text-muted-foreground mb-2">Collaborators:</p>
                            <div className="flex -space-x-2">
                              {assignment.collaborators.slice(0, 3).map((collab) => (
                                <Avatar key={collab.user_id} className="h-6 w-6 border-2 border-background">
                                  <AvatarImage src={collab.user?.avatar_url} alt={collab.user?.first_name} />
                                  <AvatarFallback>{collab.user?.first_name?.[0]}</AvatarFallback>
                                </Avatar>
                              ))}
                              {assignment.collaborators.length > 3 && (
                                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                                  +{assignment.collaborators.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button 
                          className="w-full" 
                          asChild
                        >
                          <Link href={`/assignment-playground/assignments/${assignment.id}`}>
                            Manage Assignment
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Collaborations Tab */}
          <TabsContent value="collaborations" className="space-y-6 mt-6">
            {!user ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">Sign in to view collaborations</h3>
                  <p className="text-muted-foreground mb-6">
                    You need to sign in to view assignments you're collaborating on
                  </p>
                  <Button asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : collaborations.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">No collaborations yet</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't joined any assignments as a collaborator yet
                  </p>
                  <Button onClick={() => setActiveTab('assignments')}>
                    Browse Assignments
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">My Collaborations</h2>
                  <Button onClick={() => setActiveTab('assignments')}>
                    Find More Assignments
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {collaborations.map((assignment) => (
                    <Card key={assignment.id} className="glass-card h-full flex flex-col">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <Badge>{assignment.subject}</Badge>
                          {getStatusBadge(assignment.status)}
                        </div>
                        <CardTitle className="text-lg mt-2">{assignment.title}</CardTitle>
                        <CardDescription>
                          {assignment.due_date ? (
                            <span>{getDueDateDisplay(assignment.due_date)}</span>
                          ) : (
                            <span>Joined {formatDate(assignment.created_at)}</span>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm line-clamp-3 mb-4">{assignment.description}</p>
                        
                        <div className="mt-4">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{calculateProgress(assignment)}%</span>
                          </div>
                          <Progress value={calculateProgress(assignment)} className="h-2" />
                        </div>
                        
                        <div className="flex items-center gap-3 mt-4">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={assignment.creator?.avatar_url} alt={assignment.creator?.first_name} />
                            <AvatarFallback>{assignment.creator?.first_name?.[0]}{assignment.creator?.last_name?.[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{assignment.creator?.first_name} {assignment.creator?.last_name}</p>
                            <p className="text-xs text-muted-foreground">Assignment Creator</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button 
                          className="w-full" 
                          asChild
                        >
                          <Link href={`/assignment-playground/assignments/${assignment.id}`}>
                            View Assignment
                          </Link>
                        </Button>
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
              <CardTitle>Why Collaborate?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Increased Productivity</h3>
                  <p className="text-sm text-muted-foreground">Divide work among team members to complete assignments faster</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Better Ideas</h3>
                  <p className="text-sm text-muted-foreground">Combine different perspectives for more creative solutions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Peer Review</h3>
                  <p className="text-sm text-muted-foreground">Get feedback before submission to improve quality</p>
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
                  <h3 className="font-medium">Create or Join</h3>
                  <p className="text-sm text-muted-foreground">Start a new assignment or join an existing one</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                  <span className="font-semibold text-primary">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Break Down Tasks</h3>
                  <p className="text-sm text-muted-foreground">Divide the assignment into manageable tasks</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                  <span className="font-semibold text-primary">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Collaborate & Review</h3>
                  <p className="text-sm text-muted-foreground">Work together, provide feedback, and improve</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                  <span className="font-semibold text-primary">4</span>
                </div>
                <div>
                  <h3 className="font-medium">Submit & Share</h3>
                  <p className="text-sm text-muted-foreground">Finalize your work and submit with confidence</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Plagiarism Prevention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Our built-in plagiarism checker helps you:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Identify unintentional plagiarism before submission</li>
                <li>Check for proper citation and referencing</li>
                <li>Compare your work against academic databases</li>
                <li>Generate originality reports for your records</li>
                <li>Ensure academic integrity in all your work</li>
              </ul>
              <div className="mt-4">
                <Button size="sm" asChild className="w-full">
                  <Link href="/assignment-playground/plagiarism-check">
                    Check Your Work
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CreateAssignmentForm({ onSuccess, onCancel }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    due_date: '',
    is_public: false,
    allow_collaborators: true,
    tasks: []
  });
  const [newTask, setNewTask] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, { title: newTask, description: '', completed: false }]
    }));
    
    setNewTask('');
  };

  const handleRemoveTask = (index) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a title for your assignment",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.subject.trim()) {
      toast({
        title: "Missing subject",
        description: "Please enter the subject for your assignment",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('assignments')
        .insert([
          {
            creator_id: user.id,
            title: formData.title,
            description: formData.description,
            subject: formData.subject,
            due_date: formData.due_date || null,
            is_public: formData.is_public,
            allow_collaborators: formData.allow_collaborators,
            tasks: formData.tasks,
            status: 'not_started'
          }
        ]);
      
      if (error) throw error;
      
      toast({
        title: "Assignment created",
        description: "Your assignment has been created successfully.",
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        subject: '',
        due_date: '',
        is_public: false,
        allow_collaborators: true,
        tasks: []
      });
      
      // Callback
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast({
        title: "Error",
        description: "Failed to create assignment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Create New Assignment</CardTitle>
        <CardDescription>
          Set up your assignment details and invite collaborators
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Assignment Title
            </label>
            <Input 
              id="title" 
              name="title" 
              placeholder="E.g., Research Paper on Climate Change" 
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
              placeholder="Provide details about the assignment, requirements, etc." 
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input 
                id="subject" 
                name="subject" 
                placeholder="E.g., Biology, Computer Science" 
                value={formData.subject}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="due_date" className="text-sm font-medium">
                Due Date (Optional)
              </label>
              <Input 
                id="due_date" 
                name="due_date" 
                type="date" 
                value={formData.due_date}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="text-sm font-medium">
              Tasks
            </label>
            <div className="flex gap-2">
              <Input 
                placeholder="Add a task..." 
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTask();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTask}>
                Add
              </Button>
            </div>
            
            {formData.tasks.length > 0 ? (
              <div className="space-y-2 border rounded-md p-3">
                {formData.tasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between gap-2 p-2 bg-background/50 rounded-md">
                    <div className="flex items-center gap-2">
                      <Checkbox id={`task-${index}`} />
                      <label htmlFor={`task-${index}`} className="text-sm">{task.title}</label>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveTask(index)}
                      className="h-8 w-8 p-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4 border rounded-md">
                No tasks added yet
              </p>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="is_public" 
                name="is_public"
                checked={formData.is_public}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, is_public: checked }))
                }
              />
              <label
                htmlFor="is_public"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Make this assignment public
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="allow_collaborators" 
                name="allow_collaborators"
                checked={formData.allow_collaborators}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, allow_collaborators: checked }))
                }
              />
              <label
                htmlFor="allow_collaborators"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Allow others to collaborate
              </label>
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
                  Creating...
                </>
              ) : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
