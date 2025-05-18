import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useAuth } from '@/components/auth/AuthContext';

export default function CreateGroupPage() {
  const { user } = useAuth();
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    course: '',
    university: '',
    isPublic: true
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      
      // Create the study group
      const { data, error: createError } = await supabase
        .from('study_groups')
        .insert([
          {
            name: formData.name,
            description: formData.description,
            course: formData.course,
            university: formData.university,
            is_public: formData.isPublic,
            created_by: user.id,
            member_count: 1
          }
        ])
        .select()
        .single();
      
      if (createError) throw createError;
      
      // Add creator as admin member
      const { error: memberError } = await supabase
        .from('study_group_members')
        .insert([
          {
            group_id: data.id,
            user_id: user.id,
            is_admin: true
          }
        ]);
      
      if (memberError) throw memberError;
      
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        course: '',
        university: '',
        isPublic: true
      });
      
      // Redirect to the new group page after a short delay
      setTimeout(() => {
        window.location.href = `/unicircle/groups/${data.id}`;
      }, 2000);
    } catch (error: any) {
      console.error('Error creating group:', error);
      setError(error.message || 'Failed to create group. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <div className="container py-8 md:py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Create Study Group</CardTitle>
            <CardDescription>Sign in to create a study group</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-6">
            <p className="mb-4">You need to be signed in to create a study group.</p>
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
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create a Study Group</h1>
          <p className="text-muted-foreground">Connect with students who share your academic interests</p>
        </div>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Group Details</CardTitle>
            <CardDescription>Fill in the information about your study group</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center py-6">
                <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Group Created Successfully!</h3>
                <p className="text-muted-foreground mb-4">Redirecting you to your new group page...</p>
                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Group Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Calculus Study Group"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what your group is about and what members can expect..."
                    rows={4}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="course" className="text-sm font-medium">
                      Course <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="course"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      placeholder="e.g., MATH 101"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="university" className="text-sm font-medium">
                      University <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="university"
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                      placeholder="e.g., State University"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="isPublic" className="text-sm font-medium">
                    Make this group public (visible to all students)
                  </label>
                </div>
                
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" type="button" asChild>
                    <Link href="/unicircle/groups">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                        Creating...
                      </>
                    ) : 'Create Group'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
