'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function UploadResourcePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    university: '',
    course: '',
    fileUrl: '',
  });

  // Redirect if not logged in
  if (!loading && !user) {
    router.push('/signin');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real implementation, you would upload the file to Supabase storage
      // and then save the resource metadata to the database
      
      // Mock implementation for now
      const { data, error } = await supabase
        .from('resources')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            university: formData.university || user?.university,
            course: formData.course,
            file_url: formData.fileUrl || 'https://example.com/placeholder.pdf',
            author_id: user?.id
          }
        ]);

      if (error) {
        console.error('Error uploading resource:', error);
        toast.error('Failed to upload resource. Please try again.');
      } else {
        toast.success('Resource uploaded successfully!');
        router.push('/resources');
      }
    } catch (error) {
      console.error('Error uploading resource:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Upload Resource</h1>
        <p className="text-muted-foreground">
          Share your study materials with the UniFriend community
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Resource Details</CardTitle>
            <CardDescription>
              Provide information about the study material you're sharing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Introduction to Computer Science Notes"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide a brief description of the resource"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Economics">Economics</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="Medicine">Medicine</SelectItem>
                    <SelectItem value="Law">Law</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Psychology">Psychology</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="university">University</Label>
                <Input
                  id="university"
                  name="university"
                  placeholder={user?.university || "e.g., University of Cape Town"}
                  value={formData.university}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Course/Module</Label>
              <Input
                id="course"
                name="course"
                placeholder="e.g., CS101 - Introduction to Programming"
                value={formData.course}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUpload">Upload File <span className="text-red-500">*</span></Label>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto h-12 w-12 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p className="mt-2 text-sm text-muted-foreground">
                  Drag and drop your file here, or click to browse
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Supported formats: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX (Max 10MB)
                </p>
                <Button type="button" variant="outline" className="mt-4">
                  Select File
                </Button>
                <input
                  id="fileUpload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Note: File upload functionality is simulated in this demo
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUrl">Or provide a file URL</Label>
              <Input
                id="fileUrl"
                name="fileUrl"
                placeholder="https://example.com/your-file.pdf"
                value={formData.fileUrl}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/resources')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Uploading...' : 'Upload Resource'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
