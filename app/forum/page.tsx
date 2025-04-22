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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ForumPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Mock forum posts data - in a real implementation, this would come from Supabase
  const posts = [
    {
      id: '1',
      title: 'Tips for first-year Computer Science students?',
      content: 'I\'m starting my Computer Science degree next month and would love some advice from current students or graduates. What should I focus on? Any recommended resources?',
      category: 'Computer Science',
      author: 'NewStudent2025',
      authorId: '123',
      replies: 12,
      views: 245,
      createdAt: '2025-03-15T10:30:00Z',
      isResolved: false
    },
    {
      id: '2',
      title: 'NSFAS application status - still pending after 2 months',
      content: 'I applied for NSFAS funding two months ago and my status is still showing as "pending". Is anyone else experiencing this? What should I do?',
      category: 'Financial Aid',
      author: 'ConcernedStudent',
      authorId: '456',
      replies: 24,
      views: 389,
      createdAt: '2025-03-10T14:20:00Z',
      isResolved: true
    },
    {
      id: '3',
      title: 'Best accommodation options near UJ?',
      content: 'I\'ll be attending University of Johannesburg next semester and I\'m looking for affordable accommodation options near the campus. Any recommendations?',
      category: 'Accommodation',
      author: 'FutureUJStudent',
      authorId: '789',
      replies: 18,
      views: 276,
      createdAt: '2025-03-05T09:15:00Z',
      isResolved: false
    },
    {
      id: '4',
      title: 'Study group for Engineering Mathematics',
      content: 'Looking for students interested in forming a study group for Engineering Mathematics at UP. We can meet weekly to solve problems and prepare for exams.',
      category: 'Engineering',
      author: 'MathWhiz',
      authorId: '101',
      replies: 8,
      views: 132,
      createdAt: '2025-02-28T16:45:00Z',
      isResolved: false
    },
    {
      id: '5',
      title: 'Psychology research participants needed',
      content: 'I\'m conducting research on stress management techniques for my Psychology honors project. Looking for participants to complete a 15-minute survey.',
      category: 'Psychology',
      author: 'ResearcherPsych',
      authorId: '202',
      replies: 5,
      views: 98,
      createdAt: '2025-02-20T11:30:00Z',
      isResolved: false
    },
    {
      id: '6',
      title: 'Textbook recommendations for Law of Contract?',
      content: 'Starting my Law degree and need recommendations for good textbooks on Law of Contract. Preferably something that explains concepts clearly for beginners.',
      category: 'Law',
      author: 'FutureLawyer',
      authorId: '303',
      replies: 10,
      views: 145,
      createdAt: '2025-02-15T13:20:00Z',
      isResolved: true
    }
  ];

  const categories = [
    'All',
    'Computer Science',
    'Financial Aid',
    'Accommodation',
    'Engineering',
    'Psychology',
    'Law',
    'Mathematics',
    'Biology',
    'Physics',
    'Business',
    'Medicine',
    'General'
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory.toLowerCase() === 'all' || 
                           post.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleNewPost = () => {
    if (!user) {
      toast.error('Please sign in to create a post');
      router.push('/signin');
      return;
    }
    router.push('/forum/new');
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discussion Forum</h1>
          <p className="text-muted-foreground">
            Connect with fellow students, ask questions, and share advice
          </p>
        </div>
        <Button onClick={handleNewPost}>New Post</Button>
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
              placeholder="Search discussions..."
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
          <TabsTrigger value="all">All Discussions</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
          {user && <TabsTrigger value="my">My Posts</TabsTrigger>}
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          {filteredPosts.length > 0 ? (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <ForumPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No discussions found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters, or start a new discussion.
              </p>
              <Button onClick={handleNewPost}>Start a Discussion</Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="popular">
          <div className="space-y-4">
            {posts
              .sort((a, b) => b.views - a.views)
              .slice(0, 6)
              .map((post) => (
                <ForumPostCard key={post.id} post={post} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="recent">
          <div className="space-y-4">
            {posts
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 6)
              .map((post) => (
                <ForumPostCard key={post.id} post={post} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="unanswered">
          <div className="space-y-4">
            {posts
              .filter(post => post.replies === 0)
              .map((post) => (
                <ForumPostCard key={post.id} post={post} />
              ))}
          </div>
        </TabsContent>
        {user && (
          <TabsContent value="my">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">You haven't created any discussions yet</h3>
              <p className="text-muted-foreground mb-4">
                Start a discussion to ask questions or share advice with the community.
              </p>
              <Button onClick={handleNewPost}>Start Your First Discussion</Button>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

function ForumPostCard({ post }: { post: any }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Link href={`/forum/${post.id}`} className="hover:underline">
              <h3 className="font-medium text-lg">{post.title}</h3>
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {post.content}
            </p>
          </div>
          {post.isResolved && (
            <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Resolved
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="flex items-center space-x-4">
            <div className="text-muted-foreground">
              Posted by {post.author}
            </div>
            <div className="text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1 text-muted-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              {post.replies} replies
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1 text-muted-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {post.views} views
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
