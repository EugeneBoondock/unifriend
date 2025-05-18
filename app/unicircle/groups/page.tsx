import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useAuth } from '@/components/auth/AuthContext';

export default function GroupsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('my-groups');
  const [myGroups, setMyGroups] = React.useState<any[]>([]);
  const [allGroups, setAllGroups] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    if (user) {
      fetchMyGroups();
      fetchAllGroups();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchMyGroups = async () => {
    if (!user) return;
    
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      
      // Fetch groups where user is a member
      const { data, error } = await supabase
        .from('study_group_members')
        .select(`
          group_id,
          is_admin,
          study_groups:group_id (
            id,
            name,
            description,
            course,
            university,
            created_by,
            created_at,
            member_count,
            profiles:created_by (name, image)
          )
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Transform data to get group details
      const groups = data.map(item => ({
        ...item.study_groups,
        isAdmin: item.is_admin
      }));
      
      setMyGroups(groups || []);
    } catch (error) {
      console.error('Error fetching my groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllGroups = async () => {
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      
      // Fetch all public groups
      const { data, error } = await supabase
        .from('study_groups')
        .select(`
          *,
          profiles:created_by (name, image)
        `)
        .order('member_count', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      setAllGroups(data || []);
    } catch (error) {
      console.error('Error fetching all groups:', error);
    }
  };

  const joinGroup = async (groupId: string) => {
    if (!user) return;
    
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      
      // Check if user is already a member
      const { data: existingMember, error: checkError } = await supabase
        .from('study_group_members')
        .select('*')
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingMember) {
        console.log('Already a member of this group');
        return;
      }
      
      // Add user as a member
      const { error: memberError } = await supabase
        .from('study_group_members')
        .insert([
          {
            group_id: groupId,
            user_id: user.id,
            is_admin: false
          }
        ]);
      
      if (memberError) throw memberError;
      
      // Increment member count
      const { error: updateError } = await supabase
        .from('study_groups')
        .update({
          member_count: supabase.rpc('increment', { x: 1 })
        })
        .eq('id', groupId);
      
      if (updateError) throw updateError;
      
      // Refresh groups
      fetchMyGroups();
      fetchAllGroups();
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const leaveGroup = async (groupId: string) => {
    if (!user) return;
    
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      
      // Remove user from members
      const { error: memberError } = await supabase
        .from('study_group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);
      
      if (memberError) throw memberError;
      
      // Decrement member count
      const { error: updateError } = await supabase
        .from('study_groups')
        .update({
          member_count: supabase.rpc('decrement', { x: 1 })
        })
        .eq('id', groupId);
      
      if (updateError) throw updateError;
      
      // Refresh groups
      setMyGroups(myGroups.filter(group => group.id !== groupId));
      fetchAllGroups();
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  const filteredAllGroups = allGroups.filter(group => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      group.name.toLowerCase().includes(query) ||
      group.description.toLowerCase().includes(query) ||
      group.course.toLowerCase().includes(query) ||
      group.university.toLowerCase().includes(query)
    );
  });

  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <div className="container py-8 md:py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Study Groups</CardTitle>
            <CardDescription>Sign in to join study groups</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-6">
            <p className="mb-4">You need to be signed in to access study groups.</p>
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
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Study Groups</h1>
            <p className="text-muted-foreground">Connect with students for collaborative learning</p>
          </div>
          <Button asChild>
            <Link href="/unicircle/groups/create">Create New Group</Link>
          </Button>
        </div>
        
        <Tabs defaultValue="my-groups" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-2 mb-6">
            <TabsTrigger value="my-groups">My Groups</TabsTrigger>
            <TabsTrigger value="discover">Discover Groups</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-groups" className="mt-0">
            {isLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading your groups...</p>
              </div>
            ) : myGroups.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">You haven't joined any groups yet</h3>
                  <p className="text-muted-foreground mb-6">Join a study group to collaborate with other students</p>
                  <Button onClick={() => setActiveTab('discover')}>Discover Groups</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myGroups.map((group) => (
                  <Card key={group.id} className="glass-card">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        {group.isAdmin && (
                          <Badge variant="outline">Admin</Badge>
                        )}
                      </div>
                      <CardDescription>{group.university} • {group.course}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{group.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>{group.member_count} members</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button variant="outline" className="flex-1" asChild>
                        <Link href={`/unicircle/groups/${group.id}`}>View</Link>
                      </Button>
                      <Button variant="destructive" className="flex-1" onClick={() => leaveGroup(group.id)}>
                        Leave
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="discover" className="mt-0">
            <div className="mb-6">
              <Input 
                placeholder="Search for groups by name, course, or university..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {isLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading groups...</p>
              </div>
            ) : filteredAllGroups.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">No groups found</h3>
                  <p className="text-muted-foreground mb-6">Try a different search or create your own group</p>
                  <Button asChild>
                    <Link href="/unicircle/groups/create">Create New Group</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAllGroups.map((group) => {
                  const isMember = myGroups.some(g => g.id === group.id);
                  
                  return (
                    <Card key={group.id} className="glass-card">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                          {isMember && (
                            <Badge>Member</Badge>
                          )}
                        </div>
                        <CardDescription>{group.university} • {group.course}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4">{group.description}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span>{group.member_count} members</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={group.profiles?.image || '/placeholder-user.png'} />
                              <AvatarFallback>{group.profiles?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                            <span>Created by {group.profiles?.name}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button variant="outline" className="flex-1" asChild>
                          <Link href={`/unicircle/groups/${group.id}`}>View</Link>
                        </Button>
                        {isMember ? (
                          <Button variant="destructive" className="flex-1" onClick={() => leaveGroup(group.id)}>
                            Leave
                          </Button>
                        ) : (
                          <Button className="flex-1" onClick={() => joinGroup(group.id)}>
                            Join
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
