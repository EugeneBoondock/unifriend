'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ResourcesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Mock resources data - in a real implementation, this would come from Supabase
  const resources = [
    {
      id: '1',
      title: 'Introduction to Computer Science Notes',
      description: 'Comprehensive notes covering the basics of computer science, algorithms, and data structures.',
      category: 'Computer Science',
      university: 'University of Cape Town',
      author: 'John Doe',
      downloads: 245,
      createdAt: '2025-03-15T10:30:00Z',
      fileUrl: '#'
    },
    {
      id: '2',
      title: 'Economics 101 Study Guide',
      description: 'A complete study guide for first-year economics students covering micro and macroeconomics.',
      category: 'Economics',
      university: 'University of Johannesburg',
      author: 'Jane Smith',
      downloads: 189,
      createdAt: '2025-03-10T14:20:00Z',
      fileUrl: '#'
    },
    {
      id: '3',
      title: 'Organic Chemistry Lab Manual',
      description: 'Detailed lab manual for organic chemistry experiments with safety guidelines and procedures.',
      category: 'Chemistry',
      university: 'Stellenbosch University',
      author: 'David Johnson',
      downloads: 156,
      createdAt: '2025-03-05T09:15:00Z',
      fileUrl: '#'
    },
    {
      id: '4',
      title: 'Engineering Mathematics Formulas',
      description: 'Comprehensive collection of formulas and equations for engineering mathematics courses.',
      category: 'Engineering',
      university: 'University of Pretoria',
      author: 'Michael Brown',
      downloads: 312,
      createdAt: '2025-02-28T16:45:00Z',
      fileUrl: '#'
    },
    {
      id: '5',
      title: 'Psychology Research Methods',
      description: 'Guide to research methods in psychology including experimental design and statistical analysis.',
      category: 'Psychology',
      university: 'University of the Witwatersrand',
      author: 'Sarah Wilson',
      downloads: 178,
      createdAt: '2025-02-20T11:30:00Z',
      fileUrl: '#'
    },
    {
      id: '6',
      title: 'Law of Contract Summary',
      description: 'Comprehensive summary of contract law principles, cases, and applications.',
      category: 'Law',
      university: 'University of the Western Cape',
      author: 'Robert Taylor',
      downloads: 203,
      createdAt: '2025-02-15T13:20:00Z',
      fileUrl: '#'
    }
  ];

  const categories = [
    'All',
    'Computer Science',
    'Economics',
    'Chemistry',
    'Engineering',
    'Psychology',
    'Law',
    'Mathematics',
    'Biology',
    'Physics',
    'Business',
    'Medicine'
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory.toLowerCase() === 'all' || 
                           resource.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleUpload = () => {
    if (!user) {
      toast.error('Please sign in to upload resources');
      router.push('/signin');
      return;
    }
    router.push('/resources/upload');
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Study Resources</h1>
          <p className="text-muted-foreground">
            Access and share study materials with the UniFriend community
          </p>
        </div>
        <Button onClick={handleUpload}>Upload Resource</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-3">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <Input
              type="search"
              placeholder="Search resources..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div>
          <select
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          {user && <TabsTrigger value="my">My Uploads</TabsTrigger>}
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No resources found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters, or upload a new resource.
              </p>
              <Button onClick={handleUpload}>Upload Resource</Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="popular">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources
              .sort((a, b) => b.downloads - a.downloads)
              .slice(0, 6)
              .map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="recent">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 6)
              .map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
          </div>
        </TabsContent>
        {user && (
          <TabsContent value="my">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">You haven't uploaded any resources yet</h3>
              <p className="text-muted-foreground mb-4">
                Share your study materials with the community to help other students.
              </p>
              <Button onClick={handleUpload}>Upload Your First Resource</Button>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

function ResourceCard({ resource }: { resource: any }) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{resource.title}</CardTitle>
        <CardDescription className="text-xs">
          {resource.university} • {resource.category}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {resource.description}
        </p>
        <div className="flex items-center text-xs text-muted-foreground">
          <span>Uploaded by {resource.author}</span>
          <span className="mx-2">•</span>
          <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-3 flex justify-between items-center border-t">
        <div className="text-xs text-muted-foreground">
          {resource.downloads} downloads
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={resource.fileUrl}>Download</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
