'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type StudyGroup = {
  id: string;
  name: string;
  description: string;
  course: string;
  university: string;
  created_by: string;
  created_at: string;
  member_count: number;
  is_member?: boolean;
};

export default function StudyGroupsPage() {
  const { user, loading: authLoading } = useAuth();
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [myGroups, setMyGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchStudyGroups = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, this would fetch from Supabase
        // Mock data for demonstration
        const mockStudyGroups: StudyGroup[] = [
          {
            id: '1',
            name: 'Computer Science Study Group',
            description: 'Weekly study sessions for CS101 and CS102 courses',
            course: 'Computer Science',
            university: 'University of Cape Town',
            created_by: 'John Doe',
            created_at: '2025-03-15T10:30:00Z',
            member_count: 12,
            is_member: true
          },
          {
            id: '2',
            name: 'Economics Discussion Group',
            description: 'Discussing economic theories and current events',
            course: 'Economics',
            university: 'University of Johannesburg',
            created_by: 'Jane Smith',
            created_at: '2025-03-10T14:20:00Z',
            member_count: 8,
            is_member: false
          },
          {
            id: '3',
            name: 'Organic Chemistry Lab Prep',
            description: 'Preparation for organic chemistry lab experiments',
            course: 'Chemistry',
            university: 'Stellenbosch University',
            created_by: 'David Johnson',
            created_at: '2025-03-05T09:15:00Z',
            member_count: 6,
            is_member: false
          },
          {
            id: '4',
            name: 'Engineering Mathematics',
            description: 'Solving complex engineering math problems together',
            course: 'Engineering',
            university: 'University of Pretoria',
            created_by: 'Michael Brown',
            created_at: '2025-02-28T16:45:00Z',
            member_count: 15,
            is_member: true
          },
          {
            id: '5',
            name: 'Psychology Research Methods',
            description: 'Group for discussing research methods in psychology',
            course: 'Psychology',
            university: 'University of the Witwatersrand',
            created_by: 'Sarah Wilson',
            created_at: '2025-02-20T11:30:00Z',
            member_count: 9,
            is_member: false
          }
        ];
        
        setStudyGroups(mockStudyGroups);
        setMyGroups(mockStudyGroups.filter(group => group.is_member));
      } catch (err) {
        console.error('Error fetching study groups:', err);
        toast.error('Failed to load study groups');
      } finally {
        setLoading(false);
      }
    };

    fetchStudyGroups();
  }, [user]);

  const handleJoinGroup = async (groupId: string) => {
    if (!user) {
      toast.error('Please sign in to join a study group');
      return;
    }

    try {
      // In a real implementation, this would update Supabase
      // Mock implementation for demonstration
      toast.success('Successfully joined the study group!');
      
      // Update local state
      setStudyGroups(prev => 
        prev.map(group => 
          group.id === groupId 
            ? { ...group, is_member: true, member_count: group.member_count + 1 } 
            : group
        )
      );
      
      // Add to my groups
      const joinedGroup = studyGroups.find(group => group.id === groupId);
      if (joinedGroup && !joinedGroup.is_member) {
        setMyGroups(prev => [...prev, { ...joinedGroup, is_member: true, member_count: joinedGroup.member_count + 1 }]);
      }
    } catch (err) {
      console.error('Error joining study group:', err);
      toast.error('Failed to join study group');
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    if (!user) return;

    try {
      // In a real implementation, this would update Supabase
      // Mock implementation for demonstration
      toast.success('Successfully left the study group');
      
      // Update local state
      setStudyGroups(prev => 
        prev.map(group => 
          group.id === groupId 
            ? { ...group, is_member: false, member_count: Math.max(0, group.member_count - 1) } 
            : group
        )
      );
      
      // Remove from my groups
      setMyGroups(prev => prev.filter(group => group.id !== groupId));
    } catch (err) {
      console.error('Error leaving study group:', err);
      toast.error('Failed to leave study group');
    }
  };

  const filteredGroups = studyGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.university.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Study Groups</h1>
          <p className="text-muted-foreground">
            Connect with fellow students for collaborative learning
          </p>
        </div>
        <Button asChild>
          <Link href="/study-groups/create">Create Study Group</Link>
        </Button>
      </div>

      <div className="mb-8">
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
            placeholder="Search study groups..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Groups</TabsTrigger>
          {user && <TabsTrigger value="my">My Groups</TabsTrigger>}
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map(group => (
                <StudyGroupCard 
                  key={group.id} 
                  group={group} 
                  onJoin={handleJoinGroup}
                  onLeave={handleLeaveGroup}
                  isAuthenticated={!!user}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No study groups found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or create a new study group.
              </p>
              <Button asChild>
                <Link href="/study-groups/create">Create Study Group</Link>
              </Button>
            </div>
          )}
        </TabsContent>
        
        {user && (
          <TabsContent value="my" className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : myGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myGroups.map(group => (
                  <StudyGroupCard 
                    key={group.id} 
                    group={group} 
                    onJoin={handleJoinGroup}
                    onLeave={handleLeaveGroup}
                    isAuthenticated={!!user}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">You haven't joined any study groups yet</h3>
                <p className="text-muted-foreground mb-4">
                  Join existing groups or create your own to collaborate with fellow students.
                </p>
                <Button asChild>
                  <Link href="/study-groups/create">Create Study Group</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        )}
        
        <TabsContent value="recommended" className="space-y-6">
          {user ? (
            loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studyGroups
                  .filter(group => !group.is_member && (group.university === user.university || group.course === user.course))
                  .slice(0, 3)
                  .map(group => (
                    <StudyGroupCard 
                      key={group.id} 
                      group={group} 
                      onJoin={handleJoinGroup}
                      onLeave={handleLeaveGroup}
                      isAuthenticated={!!user}
                      recommended
                    />
                  ))}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Sign in to see recommended groups</h3>
              <p className="text-muted-foreground mb-4">
                We'll recommend study groups based on your university and courses.
              </p>
              <Button asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StudyGroupCard({ 
  group, 
  onJoin, 
  onLeave, 
  isAuthenticated,
  recommended = false
}: { 
  group: StudyGroup; 
  onJoin: (id: string) => Promise<void>;
  onLeave: (id: string) => Promise<void>;
  isAuthenticated: boolean;
  recommended?: boolean;
}) {
  return (
    <Card className={`h-full flex flex-col ${recommended ? 'border-primary/50' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{group.name}</CardTitle>
          {recommended && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Recommended
            </Badge>
          )}
        </div>
        <CardDescription className="text-xs">
          {group.university} • {group.course}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">
          {group.description}
        </p>
        <div className="flex items-center text-xs text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          {group.member_count} members
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t">
        {isAuthenticated ? (
          group.is_member ? (
            <div className="w-full flex gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link href={`/study-groups/${group.id}`}>View Group</Link>
              </Button>
              <Button 
                variant="ghost" 
                className="flex-1"
                onClick={() => onLeave(group.id)}
              >
                Leave
              </Button>
            </div>
          ) : (
            <Button 
              className="w-full"
              onClick={() => onJoin(group.id)}
            >
              Join Group
            </Button>
          )
        ) : (
          <Button variant="outline" className="w-full" asChild>
            <Link href="/signin">Sign in to Join</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
