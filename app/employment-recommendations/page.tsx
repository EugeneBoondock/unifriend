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
import { Slider } from "@/components/ui/slider";

export default function EmploymentRecommendationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [userResume, setUserResume] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [userPreferences, setUserPreferences] = useState({
    job_type: 'all',
    location_preference: 'all',
    remote_preference: 'all',
    min_salary: 0
  });

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
      // Fetch jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select(`
          *,
          employer:employer_id(id, name, logo_url, verified)
        `)
        .eq('is_active', true)
        .order('posted_at', { ascending: false });

      if (jobsError) throw jobsError;
      setJobs(jobsData || []);

      // Extract unique categories
      const allCategories = new Set();
      jobsData?.forEach(job => {
        if (job.category) allCategories.add(job.category);
      });
      
      setCategories(Array.from(allCategories));
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast({
        title: "Error",
        description: "Failed to load job data. Please try again.",
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
      // Fetch user's saved jobs
      const { data: savedJobsData, error: savedJobsError } = await supabase
        .from('saved_jobs')
        .select(`
          *,
          job:job_id(
            id,
            title,
            company,
            location,
            salary_range,
            job_type,
            description,
            requirements,
            posted_at,
            employer_id,
            employer:employer_id(id, name, logo_url, verified)
          )
        `)
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (savedJobsError) throw savedJobsError;
      
      // Transform the data to get just the jobs
      const savedJobsList = savedJobsData?.map(saved => saved.job) || [];
      setSavedJobs(savedJobsList);

      // Fetch user's job applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('job_applications')
        .select(`
          *,
          job:job_id(
            id,
            title,
            company,
            location,
            salary_range,
            job_type,
            description,
            requirements,
            posted_at,
            employer_id,
            employer:employer_id(id, name, logo_url, verified)
          )
        `)
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false });

      if (applicationsError) throw applicationsError;
      
      setApplications(applicationsData || []);

      // Fetch user's resume
      const { data: resumeData, error: resumeError } = await supabase
        .from('user_resumes')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (!resumeError) {
        setUserResume(resumeData);
      }

      // Fetch user's skills
      const { data: skillsData, error: skillsError } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', user.id);
      
      if (!skillsError) {
        setUserSkills(skillsData || []);
      }

      // Fetch user's job preferences
      const { data: preferencesData, error: preferencesError } = await supabase
        .from('job_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (!preferencesError && preferencesData) {
        setUserPreferences(preferencesData);
      }
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

  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 30) {
      const diffWeeks = Math.floor(diffDays / 7);
      return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 365) {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
    } else {
      const diffYears = Math.floor(diffDays / 365);
      return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
    }
  };

  const getApplicationStatusBadge = (status) => {
    switch (status) {
      case 'applied':
        return <Badge className="bg-blue-500">Applied</Badge>;
      case 'under_review':
        return <Badge className="bg-yellow-500">Under Review</Badge>;
      case 'interview':
        return <Badge className="bg-purple-500">Interview</Badge>;
      case 'offered':
        return <Badge className="bg-green-500">Offered</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'accepted':
        return <Badge className="bg-emerald-500">Accepted</Badge>;
      case 'declined':
        return <Badge className="bg-gray-500">Declined</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getJobTypeBadge = (jobType) => {
    switch (jobType) {
      case 'full_time':
        return <Badge variant="outline">Full-time</Badge>;
      case 'part_time':
        return <Badge variant="outline">Part-time</Badge>;
      case 'contract':
        return <Badge variant="outline">Contract</Badge>;
      case 'internship':
        return <Badge variant="outline">Internship</Badge>;
      case 'temporary':
        return <Badge variant="outline">Temporary</Badge>;
      default:
        return <Badge variant="outline">{jobType}</Badge>;
    }
  };

  // Filter jobs based on search, category, and user preferences
  const getFilteredJobs = () => {
    let filteredJobs = [...jobs];
    
    // Apply search filter
    if (searchQuery) {
      filteredJobs = filteredJobs.filter(job => 
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.category === selectedCategory);
    }
    
    // Apply user preferences if on recommended tab
    if (activeTab === 'recommended' && user) {
      // Filter by job type
      if (userPreferences.job_type !== 'all') {
        filteredJobs = filteredJobs.filter(job => job.job_type === userPreferences.job_type);
      }
      
      // Filter by location
      if (userPreferences.location_preference !== 'all' && userPreferences.location_preference) {
        filteredJobs = filteredJobs.filter(job => 
          job.location?.toLowerCase().includes(userPreferences.location_preference.toLowerCase())
        );
      }
      
      // Filter by remote preference
      if (userPreferences.remote_preference === 'remote_only') {
        filteredJobs = filteredJobs.filter(job => job.is_remote === true);
      } else if (userPreferences.remote_preference === 'onsite_only') {
        filteredJobs = filteredJobs.filter(job => job.is_remote === false);
      }
      
      // Filter by minimum salary
      if (userPreferences.min_salary > 0) {
        filteredJobs = filteredJobs.filter(job => {
          // Extract minimum salary from range
          const salaryRange = job.salary_range || '';
          const minSalary = parseInt(salaryRange.split('-')[0].replace(/\D/g, ''));
          return !minSalary || minSalary >= userPreferences.min_salary;
        });
      }
      
      // Sort by skill match if user has skills
      if (userSkills.length > 0) {
        filteredJobs = filteredJobs.map(job => {
          const jobSkills = job.skills || [];
          const matchingSkills = userSkills.filter(userSkill => 
            jobSkills.some(jobSkill => 
              jobSkill.toLowerCase() === userSkill.skill.toLowerCase()
            )
          );
          
          return {
            ...job,
            skillMatchScore: matchingSkills.length / Math.max(jobSkills.length, 1)
          };
        }).sort((a, b) => b.skillMatchScore - a.skillMatchScore);
      }
    }
    
    return filteredJobs;
  };

  const calculateProfileCompleteness = () => {
    if (!userProfile) return 0;
    
    let score = 0;
    const totalFields = 7; // Adjust based on important profile fields
    
    // Basic profile
    if (userProfile.first_name && userProfile.last_name) score += 1;
    if (userProfile.major) score += 1;
    if (userProfile.year_level) score += 1;
    if (userProfile.bio) score += 1;
    
    // Resume
    if (userResume) score += 1;
    
    // Skills
    if (userSkills.length > 0) score += 1;
    
    // Preferences
    if (userPreferences && userPreferences.job_type !== 'all') score += 1;
    
    return Math.round((score / totalFields) * 100);
  };

  const handleSaveJob = async (jobId) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save jobs.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if already saved
      const { data: existingSave, error: checkError } = await supabase
        .from('saved_jobs')
        .select('*')
        .eq('job_id', jobId)
        .eq('user_id', user.id)
        .single();
      
      if (!checkError && existingSave) {
        // Remove from saved jobs
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('id', existingSave.id);
        
        if (error) throw error;
        
        toast({
          title: "Job removed",
          description: "Job has been removed from your saved jobs.",
        });
        
        // Update local state
        setSavedJobs(savedJobs.filter(job => job.id !== jobId));
      } else {
        // Add to saved jobs
        const { error } = await supabase
          .from('saved_jobs')
          .insert([
            {
              user_id: user.id,
              job_id: jobId,
              saved_at: new Date().toISOString()
            }
          ]);
        
        if (error) throw error;
        
        toast({
          title: "Job saved",
          description: "Job has been added to your saved jobs.",
        });
        
        // Update local state
        const jobToSave = jobs.find(job => job.id === jobId);
        if (jobToSave) {
          setSavedJobs([jobToSave, ...savedJobs]);
        }
      }
    } catch (error) {
      console.error('Error saving/unsaving job:', error);
      toast({
        title: "Error",
        description: "Failed to save/unsave job. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleApplyToJob = async (jobId) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to apply for jobs.",
        variant: "destructive"
      });
      return;
    }

    if (!userResume) {
      toast({
        title: "Resume required",
        description: "Please create a resume before applying for jobs.",
        variant: "destructive"
      });
      setActiveTab('resume');
      return;
    }

    try {
      // Check if already applied
      const { data: existingApplication, error: checkError } = await supabase
        .from('job_applications')
        .select('*')
        .eq('job_id', jobId)
        .eq('user_id', user.id)
        .single();
      
      if (!checkError && existingApplication) {
        toast({
          title: "Already applied",
          description: "You have already applied for this job.",
        });
        return;
      }
      
      // Create application
      const { error } = await supabase
        .from('job_applications')
        .insert([
          {
            user_id: user.id,
            job_id: jobId,
            resume_id: userResume.id,
            status: 'applied',
            applied_at: new Date().toISOString()
          }
        ]);
      
      if (error) throw error;
      
      toast({
        title: "Application submitted",
        description: "Your job application has been submitted successfully.",
      });
      
      // Refresh applications
      fetchUserData();
    } catch (error) {
      console.error('Error applying for job:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    }
  };

  const isJobSaved = (jobId) => {
    return savedJobs.some(job => job.id === jobId);
  };

  const hasAppliedToJob = (jobId) => {
    return applications.some(app => app.job_id === jobId);
  };

  return (
    <div className="container py-6 md:py-8 pattern-container">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Employment Recommendations</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find your perfect job match, build your resume, and prepare for interviews
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 w-full max-w-4xl mx-auto">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="jobs">Browse Jobs</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="resume">Resume</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6 mt-6">
            {!user ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">Sign in to access your dashboard</h3>
                  <p className="text-muted-foreground mb-6">
                    Track your job applications, saved jobs, and get personalized recommendations
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
                            <p className="text-2xl font-bold">{applications.length}</p>
                            <p className="text-xs text-muted-foreground">Applications</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{savedJobs.length}</p>
                            <p className="text-xs text-muted-foreground">Saved Jobs</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{applications.filter(a => a.status === 'interview').length}</p>
                            <p className="text-xs text-muted-foreground">Interviews</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Profile Completeness */}
                  <Card className="glass-card">
                    <CardHeader className="pb-2">
                      <CardTitle>Profile Completeness</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Overall Completeness</span>
                            <span>{calculateProfileCompleteness()}%</span>
                          </div>
                          <Progress value={calculateProfileCompleteness()} className="h-2" />
                        </div>
                        
                        <div className="space-y-2">
                          {!userResume && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-red-500">Resume missing</span>
                              <Button size="sm" variant="outline" onClick={() => setActiveTab('resume')}>
                                Create Resume
                              </Button>
                            </div>
                          )}
                          
                          {userSkills.length === 0 && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-red-500">Skills not added</span>
                              <Button size="sm" variant="outline" onClick={() => setActiveTab('resume')}>
                                Add Skills
                              </Button>
                            </div>
                          )}
                          
                          {(!userPreferences || userPreferences.job_type === 'all') && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-yellow-500">Job preferences not set</span>
                              <Button size="sm" variant="outline" onClick={() => setActiveTab('preferences')}>
                                Set Preferences
                              </Button>
                            </div>
                          )}
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
                      <Button className="w-full" onClick={() => setActiveTab('recommended')}>
                        View Recommended Jobs
                      </Button>
                      <Button className="w-full" variant="outline" onClick={() => setActiveTab('resume')}>
                        Update Resume
                      </Button>
                      <Button className="w-full" variant="outline" asChild>
                        <Link href="/employment-recommendations/interview-prep">
                          Interview Preparation
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Middle Column */}
                <div className="space-y-6">
                  {/* Recent Applications */}
                  <Card className="glass-card">
                    <CardHeader className="pb-2">
                      <CardTitle>Recent Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {applications.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          No job applications yet
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {applications.slice(0, 3).map((application) => (
                            <div key={application.id} className="flex items-start gap-3 border rounded-lg p-3">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h4 className="font-medium text-sm">{application.job?.title}</h4>
                                  {getApplicationStatusBadge(application.status)}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {application.job?.company} • Applied {getTimeAgo(application.applied_at)}
                                </p>
                              </div>
                            </div>
                          ))}
                          <Button variant="link" size="sm" className="w-full" onClick={() => setActiveTab('applications')}>
                            View All Applications
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Recommended Jobs */}
                  <Card className="glass-card">
                    <CardHeader className="pb-2">
                      <CardTitle>Recommended For You</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="text-center py-4">
                          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                          <p className="text-sm text-muted-foreground mt-2">Loading recommendations...</p>
                        </div>
                      ) : getFilteredJobs().length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          No job recommendations available
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {getFilteredJobs().slice(0, 3).map((job) => (
                            <div key={job.id} className="border rounded-lg p-3">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-sm">{job.title}</h4>
                                {getJobTypeBadge(job.job_type)}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {job.company} • {job.location}
                              </p>
                              {job.salary_range && (
                                <p className="text-xs mt-1">
                                  {job.salary_range}
                                </p>
                              )}
                              <div className="mt-2 flex justify-end">
                                <Button size="sm" variant="outline" asChild>
                                  <Link href={`/employment-recommendations/jobs/${job.id}`}>
                                    View Details
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Button variant="link" size="sm" className="w-full" onClick={() => setActiveTab('recommended')}>
                            View All Recommendations
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                {/* Right Column */}
                <div className="space-y-6">
                  {/* Interview Preparation */}
                  <Card className="glass-card">
                    <CardHeader className="pb-2">
                      <CardTitle>Interview Preparation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 border rounded-lg p-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">Common Questions</h4>
                            <p className="text-xs text-muted-foreground">
                              Practice answering frequently asked interview questions
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 border rounded-lg p-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">Mock Interviews</h4>
                            <p className="text-xs text-muted-foreground">
                              Practice with AI-powered mock interviews
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 border rounded-lg p-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">Interview Tips</h4>
                            <p className="text-xs text-muted-foreground">
                              Expert advice for acing your interviews
                            </p>
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link href="/employment-recommendations/interview-prep">
                            Start Preparing
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Career Resources */}
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Career Resources</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">Resume Templates</h3>
                          <p className="text-sm text-muted-foreground">Professional templates for different industries</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">Cover Letter Guide</h3>
                          <p className="text-sm text-muted-foreground">Learn how to write compelling cover letters</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">Networking Tips</h3>
                          <p className="text-sm text-muted-foreground">Strategies for building professional connections</p>
                        </div>
                      </div>
                      
                      <Button size="sm" className="w-full" asChild>
                        <Link href="/employment-recommendations/resources">
                          View All Resources
                        </Link>
                      </Button>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Find Jobs</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Browse and apply to jobs that match your skills and interests
                  </p>
                  <Button size="sm" onClick={() => setActiveTab('jobs')}>
                    Browse Jobs
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
                  <h3 className="font-semibold mb-2">Build Resume</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create a professional resume that stands out to employers
                  </p>
                  <Button size="sm" onClick={() => setActiveTab('resume')}>
                    Create Resume
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="glass-card hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Interview Prep</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Practice with mock interviews and expert tips
                  </p>
                  <Button size="sm" asChild>
                    <Link href="/employment-recommendations/interview-prep">
                      Start Practicing
                    </Link>
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
                  <h3 className="font-semibold mb-2">Career Advice</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get expert guidance on career development and growth
                  </p>
                  <Button size="sm" asChild>
                    <Link href="/employment-recommendations/career-advice">
                      Get Advice
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Browse Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Browse Jobs</h2>
              <Button asChild>
                <Link href="/employment-recommendations/job-alerts">
                  Set Job Alerts
                </Link>
              </Button>
            </div>
            
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input 
                  placeholder="Search by title, company, or location..." 
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
            
            {/* Jobs Grid */}
            {isLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading jobs...</p>
              </div>
            ) : getFilteredJobs().length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
                  <Button onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredJobs().map((job) => (
                  <Card key={job.id} className="glass-card h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge>{job.category}</Badge>
                        {getJobTypeBadge(job.job_type)}
                      </div>
                      <CardTitle className="text-lg mt-2">{job.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-2">
                          {job.employer?.logo_url ? (
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={job.employer.logo_url} alt={job.employer.name} />
                              <AvatarFallback>{job.employer.name[0]}</AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="h-5 w-5 bg-primary/10 rounded-full flex items-center justify-center text-xs">
                              {job.company?.[0]}
                            </div>
                          )}
                          <span>{job.company}</span>
                          {job.employer?.verified && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          )}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex items-center gap-2 text-sm mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-muted-foreground">{job.location}</span>
                        {job.is_remote && (
                          <Badge variant="outline" className="ml-auto">Remote</Badge>
                        )}
                      </div>
                      
                      {job.salary_range && (
                        <div className="flex items-center gap-2 text-sm mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-muted-foreground">{job.salary_range}</span>
                        </div>
                      )}
                      
                      <p className="text-sm line-clamp-3 mb-4">{job.description}</p>
                      
                      {job.skills && job.skills.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1">
                          {job.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {job.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{job.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="mt-4 text-xs text-muted-foreground">
                        Posted {getTimeAgo(job.posted_at)}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="grid grid-cols-2 gap-2 w-full">
                        <Button 
                          variant={isJobSaved(job.id) ? "default" : "outline"} 
                          onClick={() => handleSaveJob(job.id)}
                          disabled={!user}
                        >
                          {isJobSaved(job.id) ? 'Saved' : 'Save'}
                        </Button>
                        <Button 
                          variant={hasAppliedToJob(job.id) ? "secondary" : "default"}
                          onClick={() => hasAppliedToJob(job.id) ? null : handleApplyToJob(job.id)}
                          disabled={!user || hasAppliedToJob(job.id)}
                          asChild={hasAppliedToJob(job.id)}
                        >
                          {hasAppliedToJob(job.id) ? (
                            <Link href="/employment-recommendations/applications">
                              Applied
                            </Link>
                          ) : 'Apply'}
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Recommended Jobs Tab */}
          <TabsContent value="recommended" className="space-y-6 mt-6">
            {!user ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">Sign in to view recommendations</h3>
                  <p className="text-muted-foreground mb-6">
                    Get personalized job recommendations based on your profile and preferences
                  </p>
                  <Button asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Recommended Jobs</h2>
                  <Button variant="outline" asChild>
                    <Link href="/employment-recommendations/preferences">
                      Update Preferences
                    </Link>
                  </Button>
                </div>
                
                {/* Job Preferences Summary */}
                <Card className="glass-card">
                  <CardContent className="py-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium">Job Type</p>
                        <p className="text-sm text-muted-foreground">
                          {userPreferences.job_type === 'all' ? 'Any' : 
                            userPreferences.job_type === 'full_time' ? 'Full-time' :
                            userPreferences.job_type === 'part_time' ? 'Part-time' :
                            userPreferences.job_type === 'internship' ? 'Internship' :
                            userPreferences.job_type === 'contract' ? 'Contract' : 
                            'Any'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">
                          {userPreferences.location_preference === 'all' ? 'Any location' : userPreferences.location_preference}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Remote Preference</p>
                        <p className="text-sm text-muted-foreground">
                          {userPreferences.remote_preference === 'all' ? 'No preference' : 
                            userPreferences.remote_preference === 'remote_only' ? 'Remote only' :
                            userPreferences.remote_preference === 'onsite_only' ? 'On-site only' : 
                            'No preference'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Minimum Salary</p>
                        <p className="text-sm text-muted-foreground">
                          {userPreferences.min_salary > 0 ? `$${userPreferences.min_salary.toLocaleString()}/year` : 'No minimum'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Input 
                      placeholder="Search by title, company, or location..." 
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
                
                {/* Recommended Jobs Grid */}
                {isLoading ? (
                  <div className="text-center py-10">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading recommendations...</p>
                  </div>
                ) : getFilteredJobs().length === 0 ? (
                  <Card className="glass-card">
                    <CardContent className="text-center py-10">
                      <h3 className="text-lg font-semibold mb-2">No recommendations found</h3>
                      <p className="text-muted-foreground mb-6">Try updating your preferences or profile information</p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild>
                          <Link href="/employment-recommendations/preferences">
                            Update Preferences
                          </Link>
                        </Button>
                        <Button variant="outline" onClick={() => setActiveTab('resume')}>
                          Update Resume
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getFilteredJobs().map((job) => (
                      <Card key={job.id} className="glass-card h-full flex flex-col">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <Badge>{job.category}</Badge>
                            {getJobTypeBadge(job.job_type)}
                          </div>
                          <CardTitle className="text-lg mt-2">{job.title}</CardTitle>
                          <CardDescription>
                            <div className="flex items-center gap-2">
                              {job.employer?.logo_url ? (
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={job.employer.logo_url} alt={job.employer.name} />
                                  <AvatarFallback>{job.employer.name[0]}</AvatarFallback>
                                </Avatar>
                              ) : (
                                <div className="h-5 w-5 bg-primary/10 rounded-full flex items-center justify-center text-xs">
                                  {job.company?.[0]}
                                </div>
                              )}
                              <span>{job.company}</span>
                              {job.employer?.verified && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                              )}
                            </div>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <div className="flex items-center gap-2 text-sm mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-muted-foreground">{job.location}</span>
                            {job.is_remote && (
                              <Badge variant="outline" className="ml-auto">Remote</Badge>
                            )}
                          </div>
                          
                          {job.salary_range && (
                            <div className="flex items-center gap-2 text-sm mb-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-muted-foreground">{job.salary_range}</span>
                            </div>
                          )}
                          
                          <p className="text-sm line-clamp-3 mb-4">{job.description}</p>
                          
                          {job.skills && job.skills.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-1">
                              {job.skills.slice(0, 3).map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {job.skills.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{job.skills.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          {job.skillMatchScore !== undefined && (
                            <div className="mt-4">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Skill Match</span>
                                <span>{Math.round(job.skillMatchScore * 100)}%</span>
                              </div>
                              <Progress value={job.skillMatchScore * 100} className="h-2" />
                            </div>
                          )}
                          
                          <div className="mt-4 text-xs text-muted-foreground">
                            Posted {getTimeAgo(job.posted_at)}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <div className="grid grid-cols-2 gap-2 w-full">
                            <Button 
                              variant={isJobSaved(job.id) ? "default" : "outline"} 
                              onClick={() => handleSaveJob(job.id)}
                            >
                              {isJobSaved(job.id) ? 'Saved' : 'Save'}
                            </Button>
                            <Button 
                              variant={hasAppliedToJob(job.id) ? "secondary" : "default"}
                              onClick={() => hasAppliedToJob(job.id) ? null : handleApplyToJob(job.id)}
                              disabled={hasAppliedToJob(job.id)}
                              asChild={hasAppliedToJob(job.id)}
                            >
                              {hasAppliedToJob(job.id) ? (
                                <Link href="/employment-recommendations/applications">
                                  Applied
                                </Link>
                              ) : 'Apply'}
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Saved Jobs Tab */}
          <TabsContent value="saved" className="space-y-6 mt-6">
            {!user ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">Sign in to view saved jobs</h3>
                  <p className="text-muted-foreground mb-6">
                    Save jobs you're interested in to review later
                  </p>
                  <Button asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : savedJobs.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">No saved jobs yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Save jobs you're interested in to review later
                  </p>
                  <Button onClick={() => setActiveTab('jobs')}>
                    Browse Jobs
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Saved Jobs</h2>
                  <Button onClick={() => setActiveTab('jobs')}>
                    Browse More Jobs
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedJobs.map((job) => (
                    <Card key={job.id} className="glass-card h-full flex flex-col">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <Badge>{job.category}</Badge>
                          {getJobTypeBadge(job.job_type)}
                        </div>
                        <CardTitle className="text-lg mt-2">{job.title}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center gap-2">
                            {job.employer?.logo_url ? (
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={job.employer.logo_url} alt={job.employer.name} />
                                <AvatarFallback>{job.employer.name[0]}</AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="h-5 w-5 bg-primary/10 rounded-full flex items-center justify-center text-xs">
                                {job.company?.[0]}
                              </div>
                            )}
                            <span>{job.company}</span>
                            {job.employer?.verified && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            )}
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="flex items-center gap-2 text-sm mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-muted-foreground">{job.location}</span>
                          {job.is_remote && (
                            <Badge variant="outline" className="ml-auto">Remote</Badge>
                          )}
                        </div>
                        
                        {job.salary_range && (
                          <div className="flex items-center gap-2 text-sm mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-muted-foreground">{job.salary_range}</span>
                          </div>
                        )}
                        
                        <p className="text-sm line-clamp-3 mb-4">{job.description}</p>
                        
                        {job.skills && job.skills.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1">
                            {job.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {job.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{job.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        <div className="mt-4 text-xs text-muted-foreground">
                          Posted {getTimeAgo(job.posted_at)}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <div className="grid grid-cols-2 gap-2 w-full">
                          <Button 
                            variant="outline" 
                            onClick={() => handleSaveJob(job.id)}
                          >
                            Remove
                          </Button>
                          <Button 
                            variant={hasAppliedToJob(job.id) ? "secondary" : "default"}
                            onClick={() => hasAppliedToJob(job.id) ? null : handleApplyToJob(job.id)}
                            disabled={hasAppliedToJob(job.id)}
                            asChild={hasAppliedToJob(job.id)}
                          >
                            {hasAppliedToJob(job.id) ? (
                              <Link href="/employment-recommendations/applications">
                                Applied
                              </Link>
                            ) : 'Apply'}
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6 mt-6">
            {!user ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">Sign in to view applications</h3>
                  <p className="text-muted-foreground mb-6">
                    Track your job applications and their status
                  </p>
                  <Button asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : applications.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Apply to jobs to track your applications here
                  </p>
                  <Button onClick={() => setActiveTab('jobs')}>
                    Browse Jobs
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">My Applications</h2>
                  <Button onClick={() => setActiveTab('jobs')}>
                    Browse More Jobs
                  </Button>
                </div>
                
                {/* Application Status Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="glass-card">
                    <CardContent className="p-4 text-center">
                      <p className="text-4xl font-bold">{applications.length}</p>
                      <p className="text-sm text-muted-foreground">Total Applications</p>
                    </CardContent>
                  </Card>
                  <Card className="glass-card">
                    <CardContent className="p-4 text-center">
                      <p className="text-4xl font-bold">{applications.filter(a => a.status === 'under_review').length}</p>
                      <p className="text-sm text-muted-foreground">Under Review</p>
                    </CardContent>
                  </Card>
                  <Card className="glass-card">
                    <CardContent className="p-4 text-center">
                      <p className="text-4xl font-bold">{applications.filter(a => a.status === 'interview').length}</p>
                      <p className="text-sm text-muted-foreground">Interviews</p>
                    </CardContent>
                  </Card>
                  <Card className="glass-card">
                    <CardContent className="p-4 text-center">
                      <p className="text-4xl font-bold">{applications.filter(a => a.status === 'offered').length}</p>
                      <p className="text-sm text-muted-foreground">Offers</p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Applications List */}
                <div className="space-y-4">
                  {applications.map((application) => (
                    <Card key={application.id} className="glass-card">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              {application.job?.employer?.logo_url ? (
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={application.job.employer.logo_url} alt={application.job.employer.name} />
                                  <AvatarFallback>{application.job.company?.[0]}</AvatarFallback>
                                </Avatar>
                              ) : (
                                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                  {application.job?.company?.[0]}
                                </div>
                              )}
                              <div>
                                <h3 className="font-semibold">{application.job?.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {application.job?.company} • {application.job?.location}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  {getJobTypeBadge(application.job?.job_type)}
                                  {application.job?.is_remote && (
                                    <Badge variant="outline">Remote</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                              {getApplicationStatusBadge(application.status)}
                              <span className="text-sm text-muted-foreground">
                                Applied {formatDate(application.applied_at)}
                              </span>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/employment-recommendations/jobs/${application.job_id}`}>
                                  View Job
                                </Link>
                              </Button>
                              <Button size="sm" asChild>
                                <Link href={`/employment-recommendations/applications/${application.id}`}>
                                  View Details
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {application.status === 'interview' && application.interview_date && (
                          <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                            <div className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="text-sm font-medium text-yellow-800">
                                Interview scheduled for {formatDate(application.interview_date)}
                                {application.interview_time && ` at ${application.interview_time}`}
                              </p>
                            </div>
                            <Button size="sm" variant="outline" className="mt-2" asChild>
                              <Link href="/employment-recommendations/interview-prep">
                                Prepare for Interview
                              </Link>
                            </Button>
                          </div>
                        )}
                        
                        {application.status === 'offered' && (
                          <div className="mt-4 p-3 bg-green-50 rounded-md">
                            <div className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="text-sm font-medium text-green-800">
                                Congratulations! You've received a job offer.
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <Button size="sm" variant="outline">
                                Decline Offer
                              </Button>
                              <Button size="sm">
                                Accept Offer
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Resume Tab */}
          <TabsContent value="resume" className="space-y-6 mt-6">
            {!user ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">Sign in to create your resume</h3>
                  <p className="text-muted-foreground mb-6">
                    Build a professional resume to apply for jobs
                  </p>
                  <Button asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">My Resume</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" asChild>
                      <Link href="/employment-recommendations/resume/templates">
                        Browse Templates
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href="/employment-recommendations/resume/edit">
                        {userResume ? 'Edit Resume' : 'Create Resume'}
                      </Link>
                    </Button>
                  </div>
                </div>
                
                {!userResume ? (
                  <Card className="glass-card">
                    <CardContent className="text-center py-10">
                      <h3 className="text-lg font-semibold mb-2">No resume yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Create a professional resume to apply for jobs
                      </p>
                      <Button asChild>
                        <Link href="/employment-recommendations/resume/create">
                          Create Resume
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Resume Preview */}
                    <div className="md:col-span-2">
                      <Card className="glass-card">
                        <CardHeader>
                          <CardTitle>Resume Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="border rounded-md p-6 bg-white">
                            <div className="text-center mb-6">
                              <h2 className="text-2xl font-bold">{userProfile?.first_name} {userProfile?.last_name}</h2>
                              <p className="text-muted-foreground">
                                {userResume.headline || `${userProfile?.major} Student`}
                              </p>
                              <div className="flex justify-center gap-4 mt-2 text-sm">
                                <span>{userProfile?.email}</span>
                                <span>{userProfile?.phone}</span>
                                <span>{userProfile?.location}</span>
                              </div>
                            </div>
                            
                            {userResume.summary && (
                              <div className="mb-6">
                                <h3 className="text-lg font-semibold border-b pb-1 mb-2">Summary</h3>
                                <p className="text-sm">{userResume.summary}</p>
                              </div>
                            )}
                            
                            {userResume.education && userResume.education.length > 0 && (
                              <div className="mb-6">
                                <h3 className="text-lg font-semibold border-b pb-1 mb-2">Education</h3>
                                <div className="space-y-4">
                                  {userResume.education.map((edu, index) => (
                                    <div key={index}>
                                      <div className="flex justify-between">
                                        <h4 className="font-medium">{edu.institution}</h4>
                                        <span className="text-sm">{edu.start_date} - {edu.end_date || 'Present'}</span>
                                      </div>
                                      <p className="text-sm">{edu.degree} in {edu.field_of_study}</p>
                                      {edu.description && (
                                        <p className="text-sm text-muted-foreground mt-1">{edu.description}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {userResume.experience && userResume.experience.length > 0 && (
                              <div className="mb-6">
                                <h3 className="text-lg font-semibold border-b pb-1 mb-2">Experience</h3>
                                <div className="space-y-4">
                                  {userResume.experience.map((exp, index) => (
                                    <div key={index}>
                                      <div className="flex justify-between">
                                        <h4 className="font-medium">{exp.title}</h4>
                                        <span className="text-sm">{exp.start_date} - {exp.end_date || 'Present'}</span>
                                      </div>
                                      <p className="text-sm">{exp.company}, {exp.location}</p>
                                      {exp.description && (
                                        <p className="text-sm text-muted-foreground mt-1">{exp.description}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {userSkills.length > 0 && (
                              <div className="mb-6">
                                <h3 className="text-lg font-semibold border-b pb-1 mb-2">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                  {userSkills.map((skill, index) => (
                                    <Badge key={index} variant="secondary">
                                      {skill.skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {userResume.projects && userResume.projects.length > 0 && (
                              <div className="mb-6">
                                <h3 className="text-lg font-semibold border-b pb-1 mb-2">Projects</h3>
                                <div className="space-y-4">
                                  {userResume.projects.map((project, index) => (
                                    <div key={index}>
                                      <div className="flex justify-between">
                                        <h4 className="font-medium">{project.title}</h4>
                                        <span className="text-sm">{project.date}</span>
                                      </div>
                                      {project.description && (
                                        <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <div className="flex gap-2 w-full">
                            <Button variant="outline" className="flex-1" asChild>
                              <Link href="/employment-recommendations/resume/download">
                                Download PDF
                              </Link>
                            </Button>
                            <Button className="flex-1" asChild>
                              <Link href="/employment-recommendations/resume/edit">
                                Edit Resume
                              </Link>
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </div>
                    
                    {/* Resume Sidebar */}
                    <div className="space-y-6">
                      {/* Resume Strength */}
                      <Card className="glass-card">
                        <CardHeader>
                          <CardTitle>Resume Strength</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Overall Strength</span>
                              <span>{userResume.strength || 75}%</span>
                            </div>
                            <Progress value={userResume.strength || 75} className="h-2" />
                          </div>
                          
                          <div className="space-y-2">
                            {(!userResume.summary || userResume.summary.length < 50) && (
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-yellow-500">Improve your summary</span>
                                <Button size="sm" variant="outline" asChild>
                                  <Link href="/employment-recommendations/resume/edit#summary">
                                    Edit
                                  </Link>
                                </Button>
                              </div>
                            )}
                            
                            {(!userResume.experience || userResume.experience.length === 0) && (
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-red-500">Add work experience</span>
                                <Button size="sm" variant="outline" asChild>
                                  <Link href="/employment-recommendations/resume/edit#experience">
                                    Add
                                  </Link>
                                </Button>
                              </div>
                            )}
                            
                            {userSkills.length < 3 && (
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-yellow-500">Add more skills</span>
                                <Button size="sm" variant="outline" asChild>
                                  <Link href="/employment-recommendations/resume/edit#skills">
                                    Add
                                  </Link>
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Resume Tips */}
                      <Card className="glass-card">
                        <CardHeader>
                          <CardTitle>Resume Tips</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium">Use Action Verbs</h3>
                              <p className="text-xs text-muted-foreground">Start bullet points with strong action verbs</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium">Quantify Achievements</h3>
                              <p className="text-xs text-muted-foreground">Include numbers and metrics when possible</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium">Tailor to Job Descriptions</h3>
                              <p className="text-xs text-muted-foreground">Customize your resume for each application</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* ATS Optimization */}
                      <Card className="glass-card">
                        <CardHeader>
                          <CardTitle>ATS Optimization</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm mb-4">
                            Ensure your resume passes Applicant Tracking Systems (ATS) with these tips:
                          </p>
                          <ul className="list-disc pl-5 space-y-2 text-sm">
                            <li>Use standard section headings</li>
                            <li>Include keywords from job descriptions</li>
                            <li>Avoid tables, headers, and footers</li>
                            <li>Use a clean, simple format</li>
                            <li>Save as PDF unless specified otherwise</li>
                          </ul>
                          <Button size="sm" className="w-full mt-4" asChild>
                            <Link href="/employment-recommendations/resume/ats-check">
                              Check ATS Compatibility
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Job Matching Algorithm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Our intelligent job matching algorithm helps you find the perfect opportunities:
              </p>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Skill-Based Matching</h3>
                  <p className="text-sm text-muted-foreground">Analyzes your skills and matches them to job requirements</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Preference Learning</h3>
                  <p className="text-sm text-muted-foreground">Learns from your applications and saved jobs</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Career Path Analysis</h3>
                  <p className="text-sm text-muted-foreground">Suggests jobs that align with your career goals</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Resume Builder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Create a professional resume that stands out to employers:
              </p>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                  <span className="font-semibold text-primary">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Choose a Template</h3>
                  <p className="text-sm text-muted-foreground">Select from professionally designed templates</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                  <span className="font-semibold text-primary">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Add Your Information</h3>
                  <p className="text-sm text-muted-foreground">Fill in your education, experience, and skills</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                  <span className="font-semibold text-primary">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Download and Share</h3>
                  <p className="text-sm text-muted-foreground">Get your resume in PDF format ready for applications</p>
                </div>
              </div>
              <Button size="sm" className="w-full mt-2" onClick={() => setActiveTab('resume')}>
                Build Your Resume
              </Button>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Interview Preparation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Ace your interviews with our comprehensive preparation tools:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Practice with common interview questions</li>
                <li>Get feedback on your answers with AI analysis</li>
                <li>Learn industry-specific interview techniques</li>
                <li>Prepare for behavioral and technical questions</li>
                <li>Participate in mock interviews with virtual interviewers</li>
              </ul>
              <Button size="sm" className="w-full mt-2" asChild>
                <Link href="/employment-recommendations/interview-prep">
                  Start Practicing
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
