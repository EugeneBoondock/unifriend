import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useAuth } from '@/components/auth/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function ProtestPlannerPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [protests, setProtests] = useState([]);
  const [pastProtests, setPastProtests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Filter options
  const categories = ['Academic', 'Social Justice', 'Environmental', 'Housing', 'Fees', 'Campus Services', 'Other'];
  const locations = ['Main Campus', 'North Campus', 'South Campus', 'City Center', 'Online', 'Other'];

  useEffect(() => {
    fetchProtests();
  }, []);

  const fetchProtests = async () => {
    setIsLoading(true);
    try {
      const now = new Date().toISOString();
      
      // Fetch upcoming protests
      const { data: upcomingData, error: upcomingError } = await supabase
        .from('protests')
        .select(`
          *,
          profiles:organizer_id (id, name, image),
          participants:protest_participants(id, user_id)
        `)
        .gte('date', now)
        .order('date', { ascending: true });

      if (upcomingError) throw upcomingError;
      
      // Fetch past protests
      const { data: pastData, error: pastError } = await supabase
        .from('protests')
        .select(`
          *,
          profiles:organizer_id (id, name, image),
          participants:protest_participants(id, user_id)
        `)
        .lt('date', now)
        .order('date', { ascending: false });

      if (pastError) throw pastError;
      
      setProtests(upcomingData || []);
      setPastProtests(pastData || []);
    } catch (error) {
      console.error('Error fetching protests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter protests based on search and filters
  const filteredProtests = (activeTab === 'upcoming' ? protests : pastProtests).filter(protest => {
    const matchesSearch = 
      searchQuery === '' || 
      protest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protest.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protest.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      protest.category === selectedCategory;
    
    const matchesLocation = 
      selectedLocation === 'all' || 
      protest.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const isParticipating = (protest) => {
    if (!user) return false;
    return protest.participants.some(p => p.user_id === user.id);
  };

  const handleJoinProtest = async (protestId) => {
    if (!user) return;
    
    try {
      // Check if already participating
      const { data: existingParticipation, error: checkError } = await supabase
        .from('protest_participants')
        .select('id')
        .eq('protest_id', protestId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingParticipation) {
        // Already participating, so leave the protest
        const { error: deleteError } = await supabase
          .from('protest_participants')
          .delete()
          .eq('id', existingParticipation.id);
        
        if (deleteError) throw deleteError;
      } else {
        // Not participating, so join the protest
        const { error: insertError } = await supabase
          .from('protest_participants')
          .insert([
            { protest_id: protestId, user_id: user.id }
          ]);
        
        if (insertError) throw insertError;
      }
      
      // Refresh protests data
      fetchProtests();
    } catch (error) {
      console.error('Error joining/leaving protest:', error);
    }
  };

  return (
    <div className="container py-6 md:py-8 pattern-container">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Protest Planner</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Organize and participate in peaceful demonstrations for causes that matter to your university community
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input 
              placeholder="Search protests by title, description, or location..." 
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
          <div className="w-full md:w-48">
            <select 
              value={selectedLocation} 
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>

        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="upcoming">Upcoming Protests</TabsTrigger>
              <TabsTrigger value="past">Past Protests</TabsTrigger>
            </TabsList>
            
            {user ? (
              <Button asChild>
                <Link href="/protest-planner/create">Organize a Protest</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/signin">Sign In to Organize</Link>
              </Button>
            )}
          </div>

          <TabsContent value="upcoming" className="space-y-6 mt-0">
            {isLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading protests...</p>
              </div>
            ) : filteredProtests.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">No upcoming protests found</h3>
                  <p className="text-muted-foreground mb-6">Be the first to organize a protest for a cause you care about</p>
                  {user && (
                    <Button asChild>
                      <Link href="/protest-planner/create">Organize a Protest</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProtests.map((protest) => (
                  <Card key={protest.id} className="glass-card h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg">{protest.title}</CardTitle>
                        <Badge className={`${protest.status === 'Approved' ? 'bg-green-500' : protest.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                          {protest.status}
                        </Badge>
                      </div>
                      <CardDescription>{protest.category} • {protest.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDate(protest.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{formatTime(protest.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{protest.meeting_point}</span>
                        </div>
                      </div>
                      
                      {protest.description && (
                        <p className="text-sm mt-3 line-clamp-3">{protest.description}</p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-4">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={protest.profiles?.image || '/placeholder-user.png'} />
                          <AvatarFallback>{protest.profiles?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <span>Organized by </span>
                          <span className="font-medium">{protest.profiles?.name}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm">{protest.participants.length} participants</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 flex flex-col gap-3">
                      <Button 
                        className="w-full" 
                        variant={isParticipating(protest) ? "secondary" : "default"}
                        onClick={() => handleJoinProtest(protest.id)}
                        disabled={!user || protest.status !== 'Approved'}
                      >
                        {isParticipating(protest) ? 'Leave Protest' : 'Join Protest'}
                      </Button>
                      <Button className="w-full" variant="outline" asChild>
                        <Link href={`/protest-planner/${protest.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6 mt-0">
            {isLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading past protests...</p>
              </div>
            ) : filteredProtests.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">No past protests found</h3>
                  <p className="text-muted-foreground">Check back later for a history of protests</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProtests.map((protest) => (
                  <Card key={protest.id} className="glass-card h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg">{protest.title}</CardTitle>
                        <Badge variant="outline">Past Event</Badge>
                      </div>
                      <CardDescription>{protest.category} • {protest.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDate(protest.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{protest.meeting_point}</span>
                        </div>
                      </div>
                      
                      {protest.description && (
                        <p className="text-sm mt-3 line-clamp-3">{protest.description}</p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-4">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={protest.profiles?.image || '/placeholder-user.png'} />
                          <AvatarFallback>{protest.profiles?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <span>Organized by </span>
                          <span className="font-medium">{protest.profiles?.name}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm">{protest.participants.length} participants</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button className="w-full" variant="outline" asChild>
                        <Link href={`/protest-planner/${protest.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-14">
          <Card className="glass-card p-6 max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Protest Guidelines</CardTitle>
              <CardDescription>
                Our platform supports peaceful demonstrations that adhere to university policies and local laws
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div>
                <h3 className="font-medium">✅ Do's</h3>
                <ul className="list-disc pl-5 text-muted-foreground text-sm mt-1">
                  <li>Obtain necessary permits and approvals</li>
                  <li>Maintain peaceful and respectful conduct</li>
                  <li>Clearly communicate your message and demands</li>
                  <li>Designate protest marshals for safety</li>
                  <li>Clean up after your demonstration</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium">❌ Don'ts</h3>
                <ul className="list-disc pl-5 text-muted-foreground text-sm mt-1">
                  <li>Engage in or encourage violence</li>
                  <li>Damage property or disrupt essential services</li>
                  <li>Block emergency access routes</li>
                  <li>Violate university policies or local laws</li>
                  <li>Discriminate against any individuals or groups</li>
                </ul>
              </div>
              <div className="bg-muted p-4 rounded-md mt-4">
                <p className="text-sm font-medium mb-2">Important Notice:</p>
                <p className="text-sm text-muted-foreground">
                  UniFriend provides this platform to facilitate organization of peaceful protests but does not endorse specific causes or viewpoints. Organizers are responsible for ensuring all demonstrations comply with university policies and local laws.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
