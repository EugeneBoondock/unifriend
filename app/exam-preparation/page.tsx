import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useAuth } from '@/components/auth/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ExamPreparationPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studyPlans, setStudyPlans] = useState([]);
  const [practiceTests, setPracticeTests] = useState([]);
  const [studySessions, setStudySessions] = useState([]);
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

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
      // Fetch public practice tests
      const { data: testsData, error: testsError } = await supabase
        .from('practice_tests')
        .select(`
          *,
          creator:creator_id(id, first_name, last_name, avatar_url)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (testsError) throw testsError;
      setPracticeTests(testsData || []);

      // Fetch public study sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('study_sessions')
        .select(`
          *,
          host:host_id(id, first_name, last_name, avatar_url)
        `)
        .eq('is_public', true)
        .gte('scheduled_date', new Date().toISOString())
        .order('scheduled_date', { ascending: true })
        .limit(6);

      if (sessionsError) throw sessionsError;
      setStudySessions(sessionsData || []);

      // Fetch study resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('study_resources')
        .select(`
          *,
          uploader:uploader_id(id, first_name, last_name)
        `)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (resourcesError) throw resourcesError;
      setResources(resourcesData || []);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast({
        title: "Error",
        description: "Failed to load exam preparation data. Please try again.",
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
      // Fetch user's study plans
      const { data: plansData, error: plansError } = await supabase
        .from('study_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (plansError) throw plansError;
      setStudyPlans(plansData || []);

      // Fetch user's upcoming exams
      const { data: examsData, error: examsError } = await supabase
        .from('exams')
        .select('*')
        .eq('user_id', user.id)
        .gte('exam_date', new Date().toISOString())
        .order('exam_date', { ascending: true })
        .limit(5);

      if (examsError) throw examsError;
      setUpcomingExams(examsData || []);

      // Fetch user's recent activity
      const { data: activityData, error: activityError } = await supabase
        .from('exam_prep_activity')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (activityError) throw activityError;
      setRecentActivity(activityData || []);
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

  const formatTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDaysRemaining = (dateString) => {
    if (!dateString) return 0;
    
    const examDate = new Date(dateString);
    const today = new Date();
    
    // Set hours to 0 to compare just the dates
    examDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = examDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const calculateProgress = (plan) => {
    if (!plan.tasks || plan.tasks.length === 0) return 0;
    
    const completedTasks = plan.tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / plan.tasks.length) * 100);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'study_plan_created':
        return (
          <div className="bg-blue-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        );
      case 'practice_test_completed':
        return (
          <div className="bg-green-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'study_session_joined':
        return (
          <div className="bg-purple-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        );
      case 'resource_saved':
        return (
          <div className="bg-amber-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="container py-6 md:py-8 pattern-container">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Exam Preparation</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Create study plans, take practice tests, and join study sessions to ace your exams
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full max-w-3xl mx-auto">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="study-plans">Study Plans</TabsTrigger>
            <TabsTrigger value="practice-tests">Practice Tests</TabsTrigger>
            <TabsTrigger value="study-sessions">Study Sessions</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6 mt-6">
            {!user ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">Sign in to access your dashboard</h3>
                  <p className="text-muted-foreground mb-6">
                    Track your study progress, upcoming exams, and more
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
                            <p className="text-2xl font-bold">{studyPlans.length}</p>
                            <p className="text-xs text-muted-foreground">Study Plans</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{upcomingExams.length}</p>
                            <p className="text-xs text-muted-foreground">Upcoming Exams</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">0</p>
                            <p className="text-xs text-muted-foreground">Tests Taken</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Recent Activity */}
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {recentActivity.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          No recent activity to display
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3">
                              {getActivityIcon(activity.activity_type)}
                              <div>
                                <p className="text-sm">{activity.description}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(activity.created_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                {/* Middle Column */}
                <div className="space-y-6">
                  {/* Upcoming Exams */}
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Upcoming Exams</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {upcomingExams.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground mb-4">
                            No upcoming exams added
                          </p>
                          <Button size="sm" onClick={() => setActiveTab('study-plans')}>
                            Add Exam
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {upcomingExams.map((exam) => {
                            const daysRemaining = calculateDaysRemaining(exam.exam_date);
                            return (
                              <div key={exam.id} className="border rounded-lg p-3">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="font-semibold">{exam.course_name}</h4>
                                    <p className="text-xs text-muted-foreground">{exam.course_code}</p>
                                  </div>
                                  <Badge className={
                                    daysRemaining <= 3 ? "bg-red-500" : 
                                    daysRemaining <= 7 ? "bg-yellow-500" : 
                                    "bg-green-500"
                                  }>
                                    {daysRemaining} days left
                                  </Badge>
                                </div>
                                <div className="text-sm">
                                  <p>Date: {formatDate(exam.exam_date)}</p>
                                  <p>Time: {formatTime(exam.exam_date)}</p>
                                  <p>Location: {exam.location || 'Not specified'}</p>
                                </div>
                                <div className="mt-2">
                                  <Button variant="outline" size="sm" className="w-full" asChild>
                                    <Link href={`/exam-preparation/study-plans?examId=${exam.id}`}>
                                      View Study Plan
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Study Progress */}
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Study Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {studyPlans.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground mb-4">
                            No study plans created yet
                          </p>
                          <Button size="sm" onClick={() => setActiveTab('study-plans')}>
                            Create Study Plan
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {studyPlans.slice(0, 3).map((plan) => {
                            const progress = calculateProgress(plan);
                            return (
                              <div key={plan.id} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium text-sm">{plan.title}</h4>
                                  <span className="text-xs font-medium">{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                              </div>
                            );
                          })}
                          {studyPlans.length > 3 && (
                            <Button variant="link" size="sm" className="w-full" onClick={() => setActiveTab('study-plans')}>
                              View All Study Plans
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                {/* Right Column */}
                <div className="space-y-6">
                  {/* Recommended Practice Tests */}
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Recommended Tests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {practiceTests.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          No practice tests available
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {practiceTests.slice(0, 3).map((test) => (
                            <div key={test.id} className="flex items-center gap-3 border rounded-lg p-3">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{test.title}</h4>
                                <p className="text-xs text-muted-foreground">{test.subject} • {test.questions?.length || 0} questions</p>
                              </div>
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/exam-preparation/practice-tests/${test.id}`}>
                                  Take
                                </Link>
                              </Button>
                            </div>
                          ))}
                          <Button variant="link" size="sm" className="w-full" onClick={() => setActiveTab('practice-tests')}>
                            View All Practice Tests
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Upcoming Study Sessions */}
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Upcoming Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {studySessions.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          No upcoming study sessions
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {studySessions.slice(0, 3).map((session) => (
                            <div key={session.id} className="border rounded-lg p-3">
                              <h4 className="font-medium text-sm">{session.title}</h4>
                              <p className="text-xs text-muted-foreground mb-2">
                                {formatDate(session.scheduled_date)} • {formatTime(session.scheduled_date)}
                              </p>
                              <div className="flex items-center gap-2 text-xs">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={session.host?.avatar_url} alt={session.host?.first_name} />
                                  <AvatarFallback>{session.host?.first_name?.[0]}</AvatarFallback>
                                </Avatar>
                                <span>Hosted by {session.host?.first_name}</span>
                              </div>
                            </div>
                          ))}
                          <Button variant="link" size="sm" className="w-full" onClick={() => setActiveTab('study-sessions')}>
                            View All Study Sessions
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <Card className="glass-card hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Create Study Plan</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Organize your study schedule and track progress
                  </p>
                  <Button size="sm" onClick={() => setActiveTab('study-plans')}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="glass-card hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Take Practice Test</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Test your knowledge with practice exams
                  </p>
                  <Button size="sm" onClick={() => setActiveTab('practice-tests')}>
                    Browse Tests
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
                  <h3 className="font-semibold mb-2">Join Study Session</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Study with peers in collaborative sessions
                  </p>
                  <Button size="sm" onClick={() => setActiveTab('study-sessions')}>
                    Find Sessions
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
                  <h3 className="font-semibold mb-2">Find Study Resources</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Access study guides, flashcards, and more
                  </p>
                  <Button size="sm" onClick={() => setActiveTab('resources')}>
                    Browse Resources
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Study Plans Tab */}
          <TabsContent value="study-plans" className="space-y-6 mt-6">
            {!user ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">Sign in to create study plans</h3>
                  <p className="text-muted-foreground mb-6">
                    Organize your exam preparation with personalized study plans
                  </p>
                  <Button asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <StudyPlansTab 
                studyPlans={studyPlans} 
                upcomingExams={upcomingExams}
                onCreatePlan={() => fetchUserData()}
              />
            )}
          </TabsContent>

          {/* Practice Tests Tab */}
          <TabsContent value="practice-tests" className="space-y-6 mt-6">
            <PracticeTestsTab 
              practiceTests={practiceTests}
              isLoggedIn={!!user}
            />
          </TabsContent>

          {/* Study Sessions Tab */}
          <TabsContent value="study-sessions" className="space-y-6 mt-6">
            <StudySessionsTab 
              studySessions={studySessions}
              isLoggedIn={!!user}
            />
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6 mt-6">
            <ResourcesTab 
              resources={resources}
              isLoggedIn={!!user}
            />
          </TabsContent>
        </Tabs>
        
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Personalized Study Plans</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Create customized study plans tailored to your exams and learning style:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Set specific goals and deadlines</li>
                <li>Break down complex subjects into manageable tasks</li>
                <li>Track your progress with visual indicators</li>
                <li>Receive reminders for upcoming study sessions</li>
                <li>Adjust your plan as needed based on progress</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Comprehensive Practice Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Test your knowledge with a variety of practice exams:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Access tests created by professors and top students</li>
                <li>Practice with different question formats</li>
                <li>Receive detailed performance analytics</li>
                <li>Review explanations for correct answers</li>
                <li>Create your own practice tests to share with peers</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Collaborative Study Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Study more effectively with peers:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Join virtual study groups for specific courses</li>
                <li>Schedule or join upcoming study sessions</li>
                <li>Share notes and resources in real-time</li>
                <li>Use collaborative tools for better understanding</li>
                <li>Connect with students who excel in challenging subjects</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StudyPlansTab({ studyPlans, upcomingExams, onCreatePlan }) {
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    exam_id: '',
    start_date: '',
    end_date: '',
    description: '',
    tasks: []
  });
  const [newTask, setNewTask] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        {
          id: Date.now().toString(),
          description: newTask,
          completed: false
        }
      ]
    }));
    
    setNewTask('');
  };

  const handleRemoveTask = (taskId) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a title for your study plan",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.start_date) {
      toast({
        title: "Missing start date",
        description: "Please select a start date for your study plan",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.end_date) {
      toast({
        title: "Missing end date",
        description: "Please select an end date for your study plan",
        variant: "destructive"
      });
      return;
    }
    
    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      toast({
        title: "Invalid date range",
        description: "End date must be after start date",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.tasks.length === 0) {
      toast({
        title: "No tasks added",
        description: "Please add at least one task to your study plan",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('study_plans')
        .insert([
          {
            user_id: userData.user.id,
            title: formData.title,
            exam_id: formData.exam_id || null,
            start_date: formData.start_date,
            end_date: formData.end_date,
            description: formData.description,
            tasks: formData.tasks
          }
        ]);
      
      if (error) throw error;
      
      // Record activity
      await supabase
        .from('exam_prep_activity')
        .insert([
          {
            user_id: userData.user.id,
            activity_type: 'study_plan_created',
            description: `Created study plan: ${formData.title}`
          }
        ]);
      
      toast({
        title: "Study plan created",
        description: "Your study plan has been created successfully.",
      });
      
      // Reset form
      setFormData({
        title: '',
        exam_id: '',
        start_date: '',
        end_date: '',
        description: '',
        tasks: []
      });
      
      setShowCreateForm(false);
      
      // Refresh study plans
      if (onCreatePlan) onCreatePlan();
    } catch (error) {
      console.error('Error creating study plan:', error);
      toast({
        title: "Error",
        description: "Failed to create study plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProgress = (plan) => {
    if (!plan.tasks || plan.tasks.length === 0) return 0;
    
    const completedTasks = plan.tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / plan.tasks.length) * 100);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Study Plans</h2>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Cancel' : 'Create New Plan'}
        </Button>
      </div>
      
      {showCreateForm && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Create New Study Plan</CardTitle>
            <CardDescription>
              Organize your study schedule and track your progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Plan Title
                </label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="E.g., Midterm Exam Preparation" 
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="exam_id" className="text-sm font-medium">
                  Related Exam (Optional)
                </label>
                <Select 
                  value={formData.exam_id} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, exam_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an exam" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {upcomingExams.map(exam => (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.course_code}: {exam.course_name} ({formatDate(exam.exam_date)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="start_date" className="text-sm font-medium">
                    Start Date
                  </label>
                  <Input 
                    id="start_date" 
                    name="start_date" 
                    type="date" 
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="end_date" className="text-sm font-medium">
                    End Date
                  </label>
                  <Input 
                    id="end_date" 
                    name="end_date" 
                    type="date" 
                    value={formData.end_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description (Optional)
                </label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Add notes or details about your study plan..." 
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Study Tasks
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
                
                <div className="mt-4 space-y-2">
                  {formData.tasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No tasks added yet. Add tasks to create your study plan.
                    </p>
                  ) : (
                    <div className="border rounded-md divide-y">
                      {formData.tasks.map((task, index) => (
                        <div key={task.id} className="flex items-center justify-between p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{index + 1}.</span>
                            <span className="text-sm">{task.description}</span>
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveTask(task.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                      Creating...
                    </>
                  ) : 'Create Study Plan'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      {studyPlans.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="text-center py-10">
            <h3 className="text-lg font-semibold mb-2">No study plans yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first study plan to organize your exam preparation
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              Create Study Plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studyPlans.map((plan) => {
            const progress = calculateProgress(plan);
            const daysLeft = Math.ceil((new Date(plan.end_date) - new Date()) / (1000 * 60 * 60 * 24));
            
            return (
              <Card key={plan.id} className="glass-card h-full flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{plan.title}</CardTitle>
                    <Badge className={
                      daysLeft <= 3 ? "bg-red-500" : 
                      daysLeft <= 7 ? "bg-yellow-500" : 
                      "bg-green-500"
                    }>
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}
                    </Badge>
                  </div>
                  <CardDescription>
                    {formatDate(plan.start_date)} - {formatDate(plan.end_date)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {plan.description && (
                    <p className="text-sm mb-4">{plan.description}</p>
                  )}
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Tasks ({plan.tasks.filter(t => t.completed).length}/{plan.tasks.length})</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {plan.tasks.slice(0, 5).map((task) => (
                          <div key={task.id} className="flex items-start gap-2">
                            <Checkbox 
                              id={`task-${task.id}`} 
                              checked={task.completed}
                              disabled
                            />
                            <label 
                              htmlFor={`task-${task.id}`}
                              className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                            >
                              {task.description}
                            </label>
                          </div>
                        ))}
                        {plan.tasks.length > 5 && (
                          <p className="text-xs text-muted-foreground text-center">
                            +{plan.tasks.length - 5} more tasks
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full" asChild>
                    <Link href={`/exam-preparation/study-plans/${plan.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PracticeTestsTab({ practiceTests, isLoggedIn }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  
  // Extract unique subjects from practice tests
  const subjects = [...new Set(practiceTests.map(test => test.subject))];
  
  // Filter tests based on search and subject
  const getFilteredTests = () => {
    let filteredTests = [...practiceTests];
    
    // Apply search filter
    if (searchQuery) {
      filteredTests = filteredTests.filter(test => 
        test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply subject filter
    if (selectedSubject !== 'all') {
      filteredTests = filteredTests.filter(test => test.subject === selectedSubject);
    }
    
    return filteredTests;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Practice Tests</h2>
        {isLoggedIn && (
          <Button asChild>
            <Link href="/exam-preparation/practice-tests/create">
              Create Test
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
      
      {/* Tests Grid */}
      {getFilteredTests().length === 0 ? (
        <Card className="glass-card">
          <CardContent className="text-center py-10">
            <h3 className="text-lg font-semibold mb-2">No practice tests found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters, or create your own practice test
            </p>
            {isLoggedIn && (
              <Button asChild>
                <Link href="/exam-preparation/practice-tests/create">
                  Create Practice Test
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredTests().map((test) => (
            <Card key={test.id} className="glass-card h-full flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge>{test.subject}</Badge>
                  <Badge variant="outline">{test.questions?.length || 0} Questions</Badge>
                </div>
                <CardTitle className="text-lg mt-2">{test.title}</CardTitle>
                <CardDescription>
                  Created by {test.creator?.first_name} {test.creator?.last_name}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm line-clamp-3 mb-4">{test.description || 'No description provided.'}</p>
                
                <div className="flex items-center gap-2 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-muted-foreground">
                    {test.time_limit ? `${test.time_limit} minutes` : 'No time limit'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-muted-foreground">
                    {test.attempts || 0} students completed
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="text-muted-foreground">
                    {test.difficulty || 'Medium'} difficulty
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full" asChild>
                  <Link href={`/exam-preparation/practice-tests/${test.id}`}>
                    Take Test
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Features Section */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-6">Why Practice Tests Matter</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-6 border rounded-lg">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold mb-2">Identify Knowledge Gaps</h4>
            <p className="text-sm text-muted-foreground">
              Discover which topics need more attention before your actual exam
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 border rounded-lg">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold mb-2">Improve Time Management</h4>
            <p className="text-sm text-muted-foreground">
              Practice working under time constraints to build exam confidence
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 border rounded-lg">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="font-semibold mb-2">Reduce Test Anxiety</h4>
            <p className="text-sm text-muted-foreground">
              Familiarize yourself with exam formats to feel more prepared
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudySessionsTab({ studySessions, isLoggedIn }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  
  // Extract unique subjects from study sessions
  const subjects = [...new Set(studySessions.map(session => session.subject))];
  
  // Filter sessions based on search and subject
  const getFilteredSessions = () => {
    let filteredSessions = [...studySessions];
    
    // Apply search filter
    if (searchQuery) {
      filteredSessions = filteredSessions.filter(session => 
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply subject filter
    if (selectedSubject !== 'all') {
      filteredSessions = filteredSessions.filter(session => session.subject === selectedSubject);
    }
    
    return filteredSessions;
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

  const formatTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Study Sessions</h2>
        {isLoggedIn && (
          <Button asChild>
            <Link href="/exam-preparation/study-sessions/create">
              Host Session
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
      
      {/* Sessions Grid */}
      {getFilteredSessions().length === 0 ? (
        <Card className="glass-card">
          <CardContent className="text-center py-10">
            <h3 className="text-lg font-semibold mb-2">No study sessions found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters, or host your own study session
            </p>
            {isLoggedIn && (
              <Button asChild>
                <Link href="/exam-preparation/study-sessions/create">
                  Host Study Session
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredSessions().map((session) => (
            <Card key={session.id} className="glass-card h-full flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge>{session.subject}</Badge>
                  <Badge variant="outline">{session.participants?.length || 0}/{session.max_participants || '∞'}</Badge>
                </div>
                <CardTitle className="text-lg mt-2">{session.title}</CardTitle>
                <CardDescription>
                  {formatDate(session.scheduled_date)} at {formatTime(session.scheduled_date)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm line-clamp-3 mb-4">{session.description || 'No description provided.'}</p>
                
                <div className="flex items-center gap-3 mt-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.host?.avatar_url} alt={session.host?.first_name} />
                    <AvatarFallback>{session.host?.first_name?.[0]}{session.host?.last_name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Hosted by {session.host?.first_name} {session.host?.last_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.host_rating ? `${session.host_rating}★ rating` : 'New host'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm mt-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-muted-foreground">
                    {session.session_type || 'Virtual'} session
                  </span>
                </div>
                
                {session.location && (
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-muted-foreground">
                      {session.location}
                    </span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full" asChild>
                  <Link href={`/exam-preparation/study-sessions/${session.id}`}>
                    Join Session
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Features Section */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-6">Benefits of Collaborative Study</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-6 border rounded-lg">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 className="font-semibold mb-2">Diverse Perspectives</h4>
            <p className="text-sm text-muted-foreground">
              Learn from different viewpoints and approaches to problem-solving
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 border rounded-lg">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h4 className="font-semibold mb-2">Enhanced Understanding</h4>
            <p className="text-sm text-muted-foreground">
              Teaching concepts to others reinforces your own understanding
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 border rounded-lg">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="font-semibold mb-2">Increased Motivation</h4>
            <p className="text-sm text-muted-foreground">
              Stay accountable and motivated with peer support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourcesTab({ resources, isLoggedIn }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  
  // Resource types
  const resourceTypes = [
    'Study Guide',
    'Flashcards',
    'Notes',
    'Summary',
    'Cheat Sheet',
    'Practice Problems',
    'Diagram',
    'Other'
  ];
  
  // Filter resources based on search and type
  const getFilteredResources = () => {
    let filteredResources = [...resources];
    
    // Apply search filter
    if (searchQuery) {
      filteredResources = filteredResources.filter(resource => 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.course_code?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply type filter
    if (selectedType !== 'all') {
      filteredResources = filteredResources.filter(resource => resource.resource_type === selectedType);
    }
    
    return filteredResources;
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

  const getResourceIcon = (type) => {
    switch (type) {
      case 'Study Guide':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'Flashcards':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        );
      case 'Notes':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'Summary':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'Cheat Sheet':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'Practice Problems':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Diagram':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Study Resources</h2>
        {isLoggedIn && (
          <Button asChild>
            <Link href="/exam-preparation/resources/upload">
              Upload Resource
            </Link>
          </Button>
        )}
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input 
            placeholder="Search by title, description, subject, or course code..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-48">
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="all">All Types</option>
            {resourceTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Resources Grid */}
      {getFilteredResources().length === 0 ? (
        <Card className="glass-card">
          <CardContent className="text-center py-10">
            <h3 className="text-lg font-semibold mb-2">No resources found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters, or upload your own study resources
            </p>
            {isLoggedIn && (
              <Button asChild>
                <Link href="/exam-preparation/resources/upload">
                  Upload Resource
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredResources().map((resource) => (
            <Card key={resource.id} className="glass-card h-full flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      {getResourceIcon(resource.resource_type)}
                    </div>
                    <Badge>{resource.resource_type}</Badge>
                  </div>
                  {resource.file_size && (
                    <Badge variant="outline">{(resource.file_size / 1024 / 1024).toFixed(1)} MB</Badge>
                  )}
                </div>
                <CardTitle className="text-lg mt-2">{resource.title}</CardTitle>
                <CardDescription>
                  {resource.course_code && (
                    <span className="font-medium">{resource.course_code} • </span>
                  )}
                  {resource.subject}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm line-clamp-3 mb-4">{resource.description || 'No description provided.'}</p>
                
                <div className="flex items-center gap-2 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-muted-foreground">
                    Uploaded on {formatDate(resource.created_at)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-muted-foreground">
                    By {resource.uploader?.first_name} {resource.uploader?.last_name}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="text-muted-foreground">
                    {resource.downloads || 0} downloads
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full" asChild>
                  <Link href={`/exam-preparation/resources/${resource.id}`}>
                    View Resource
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Features Section */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-6">Resource Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {resourceTypes.map((type) => (
            <div key={type} className="flex items-center gap-3 p-4 border rounded-lg">
              <div className="bg-primary/10 p-2 rounded-full">
                {getResourceIcon(type)}
              </div>
              <span className="font-medium">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
