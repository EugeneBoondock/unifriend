import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useAuth } from '@/components/auth/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function BusinessAdsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');
  const [ads, setAds] = useState([]);
  const [featuredAds, setFeaturedAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userPreferences, setUserPreferences] = useState({
    categories: [],
    showAds: true,
    personalizedAds: true
  });
  const [businessAccount, setBusinessAccount] = useState(null);

  // Filter options
  const categories = [
    'Food & Dining', 
    'Retail & Shopping', 
    'Entertainment', 
    'Technology', 
    'Education', 
    'Health & Wellness', 
    'Financial Services', 
    'Housing & Accommodation', 
    'Travel', 
    'Career & Jobs',
    'Student Services',
    'Campus Events'
  ];

  useEffect(() => {
    fetchAds();
    if (user) {
      fetchUserPreferences();
      checkBusinessAccount();
    }
  }, [user]);

  const fetchAds = async () => {
    setIsLoading(true);
    try {
      // Fetch all approved ads
      const { data: adsData, error: adsError } = await supabase
        .from('business_ads')
        .select('*, businesses:business_id(*)')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (adsError) throw adsError;
      
      // Fetch featured ads
      const { data: featuredData, error: featuredError } = await supabase
        .from('business_ads')
        .select('*, businesses:business_id(*)')
        .eq('status', 'approved')
        .eq('is_featured', true)
        .limit(3);

      if (featuredError) throw featuredError;
      
      setAds(adsData || []);
      setFeaturedAds(featuredData || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_ad_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No preferences found, create default
          const { data: newData, error: insertError } = await supabase
            .from('user_ad_preferences')
            .insert([
              { 
                user_id: user.id,
                categories: [],
                show_ads: true,
                personalized_ads: true
              }
            ])
            .select()
            .single();
          
          if (insertError) throw insertError;
          
          setUserPreferences({
            categories: [],
            showAds: true,
            personalizedAds: true
          });
        } else {
          throw error;
        }
      } else {
        setUserPreferences({
          categories: data.categories || [],
          showAds: data.show_ads,
          personalizedAds: data.personalized_ads
        });
      }
    } catch (error) {
      console.error('Error fetching user preferences:', error);
    }
  };

  const checkBusinessAccount = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      setBusinessAccount(data);
    } catch (error) {
      console.error('Error checking business account:', error);
    }
  };

  const handleSavePreferences = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_ad_preferences')
        .upsert([
          {
            user_id: user.id,
            categories: userPreferences.categories,
            show_ads: userPreferences.showAds,
            personalized_ads: userPreferences.personalizedAds
          }
        ]);
      
      if (error) throw error;
      
      alert('Preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences. Please try again.');
    }
  };

  const toggleCategory = (category) => {
    setUserPreferences(prev => {
      const categories = [...prev.categories];
      const index = categories.indexOf(category);
      
      if (index === -1) {
        categories.push(category);
      } else {
        categories.splice(index, 1);
      }
      
      return {
        ...prev,
        categories
      };
    });
  };

  // Filter ads based on search, category, and user preferences
  const getFilteredAds = () => {
    if (!userPreferences.showAds) {
      return [];
    }
    
    let filteredAds = [...ads];
    
    // Apply search filter
    if (searchQuery) {
      filteredAds = filteredAds.filter(ad => 
        ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.businesses?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filteredAds = filteredAds.filter(ad => ad.category === selectedCategory);
    }
    
    // Apply personalization if enabled
    if (userPreferences.personalizedAds && userPreferences.categories.length > 0) {
      // Prioritize ads in user's preferred categories but don't exclude others
      filteredAds.sort((a, b) => {
        const aInPreferences = userPreferences.categories.includes(a.category);
        const bInPreferences = userPreferences.categories.includes(b.category);
        
        if (aInPreferences && !bInPreferences) return -1;
        if (!aInPreferences && bInPreferences) return 1;
        return 0;
      });
    }
    
    return filteredAds;
  };

  const handleAdClick = async (adId) => {
    if (!user) return;
    
    try {
      // Record ad click
      await supabase
        .from('ad_interactions')
        .insert([
          {
            ad_id: adId,
            user_id: user.id,
            interaction_type: 'click'
          }
        ]);
      
      // Update ad click count
      await supabase
        .rpc('increment_ad_clicks', { ad_id: adId });
    } catch (error) {
      console.error('Error recording ad click:', error);
    }
  };

  return (
    <div className="container py-6 md:py-8 pattern-container">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Business Ads</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover products, services, and opportunities from businesses catering to students
          </p>
        </div>

        {/* Featured Ads */}
        {featuredAds.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Featured Promotions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredAds.map((ad) => (
                <Card key={ad.id} className="glass-card h-full flex flex-col overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={ad.image_url || '/placeholder-ad.png'} 
                      alt={ad.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="py-4 flex-grow">
                    <Badge className="mb-2">{ad.category}</Badge>
                    <h3 className="text-lg font-semibold mb-1">{ad.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">By {ad.businesses?.name}</p>
                    <p className="text-sm line-clamp-3">{ad.description}</p>
                  </CardContent>
                  <CardFooter className="pt-0 pb-4">
                    <Button 
                      className="w-full" 
                      onClick={() => handleAdClick(ad.id)}
                      asChild
                    >
                      <a href={ad.link_url} target="_blank" rel="noopener noreferrer">
                        Learn More
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="browse" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="browse">Browse Ads</TabsTrigger>
            <TabsTrigger value="preferences">Ad Preferences</TabsTrigger>
            <TabsTrigger value="business">Business Center</TabsTrigger>
          </TabsList>

          {/* Browse Ads Tab */}
          <TabsContent value="browse" className="space-y-6 mt-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input 
                  placeholder="Search ads by title, description, or business..." 
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

            {/* Ads Grid */}
            {isLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading ads...</p>
              </div>
            ) : getFilteredAds().length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">No ads found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredAds().map((ad) => (
                  <Card key={ad.id} className="glass-card h-full flex flex-col">
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={ad.image_url || '/placeholder-ad.png'} 
                        alt={ad.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge>{ad.category}</Badge>
                        {ad.discount_percentage && (
                          <Badge variant="destructive">{ad.discount_percentage}% OFF</Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg mt-2">{ad.title}</CardTitle>
                      <CardDescription>By {ad.businesses?.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm line-clamp-3 mb-3">{ad.description}</p>
                      {ad.valid_until && (
                        <p className="text-xs text-muted-foreground">
                          Valid until: {new Date(ad.valid_until).toLocaleDateString()}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        className="w-full" 
                        onClick={() => handleAdClick(ad.id)}
                        asChild
                      >
                        <a href={ad.link_url} target="_blank" rel="noopener noreferrer">
                          Learn More
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Ad Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6 mt-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Ad Preferences</CardTitle>
                <CardDescription>
                  Customize your ad experience on UniFriend
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!user ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">
                      You need to sign in to customize your ad preferences
                    </p>
                    <Button asChild>
                      <Link href="/signin">Sign In</Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Show Ads</h3>
                          <p className="text-sm text-muted-foreground">
                            Toggle to show or hide ads across the platform
                          </p>
                        </div>
                        <Switch 
                          checked={userPreferences.showAds}
                          onCheckedChange={(checked) => setUserPreferences(prev => ({
                            ...prev,
                            showAds: checked
                          }))}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Personalized Ads</h3>
                          <p className="text-sm text-muted-foreground">
                            Show ads based on your interests and preferences
                          </p>
                        </div>
                        <Switch 
                          checked={userPreferences.personalizedAds}
                          onCheckedChange={(checked) => setUserPreferences(prev => ({
                            ...prev,
                            personalizedAds: checked
                          }))}
                          disabled={!userPreferences.showAds}
                        />
                      </div>
                    </div>
                    
                    <div className="border-t pt-6">
                      <h3 className="font-medium mb-4">Ad Categories of Interest</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Select categories you're interested in to see more relevant ads
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              id={`category-${category}`}
                              checked={userPreferences.categories.includes(category)}
                              onChange={() => toggleCategory(category)}
                              disabled={!userPreferences.showAds || !userPreferences.personalizedAds}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor={`category-${category}`}>{category}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleSavePreferences}>
                        Save Preferences
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>About Ads on UniFriend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  UniFriend partners with businesses to bring you relevant products, services, and opportunities that enhance your student experience. Here's how we handle ads:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>All ads are reviewed to ensure they're relevant and appropriate for students</li>
                  <li>Your personal data is never shared with advertisers</li>
                  <li>You have complete control over your ad experience</li>
                  <li>We prioritize ads from student-run businesses and local establishments</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  If you encounter an inappropriate ad, please report it using the "Report Ad" option.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Center Tab */}
          <TabsContent value="business" className="space-y-6 mt-6">
            {!user ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">Sign in to access Business Center</h3>
                  <p className="text-muted-foreground mb-6">
                    Create and manage your business ads on UniFriend
                  </p>
                  <Button asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : businessAccount ? (
              <>
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Business Dashboard</CardTitle>
                    <CardDescription>
                      Manage your business profile and advertisements
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                        <img 
                          src={businessAccount.logo_url || '/placeholder-business.png'} 
                          alt={businessAccount.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{businessAccount.name}</h3>
                        <p className="text-sm text-muted-foreground">{businessAccount.business_type}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-3xl font-bold">0</p>
                            <p className="text-sm text-muted-foreground">Active Ads</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-3xl font-bold">0</p>
                            <p className="text-sm text-muted-foreground">Total Impressions</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-3xl font-bold">0</p>
                            <p className="text-sm text-muted-foreground">Total Clicks</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4">
                      <Button className="flex-1" asChild>
                        <Link href="/business-ads/create">
                          Create New Ad
                        </Link>
                      </Button>
                      <Button variant="outline" className="flex-1" asChild>
                        <Link href="/business-ads/manage">
                          Manage Ads
                        </Link>
                      </Button>
                      <Button variant="outline" className="flex-1" asChild>
                        <Link href="/business-ads/analytics">
                          View Analytics
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Ad Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      To ensure your ads are approved quickly and perform well, please follow these guidelines:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Ads must be relevant to student life and interests</li>
                      <li>Use high-quality images (recommended size: 1200x628px)</li>
                      <li>Keep ad titles under 50 characters</li>
                      <li>Provide clear and accurate descriptions</li>
                      <li>Ensure landing pages are mobile-friendly</li>
                      <li>Avoid excessive capitalization or punctuation</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-4">
                      All ads are reviewed before going live. The review process typically takes 24-48 hours.
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Create a Business Account</CardTitle>
                  <CardDescription>
                    Start advertising your business to students on UniFriend
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p>
                    Create a business account to advertise your products, services, or opportunities to students. 
                    Whether you're a local business, student entrepreneur, or campus organization, UniFriend 
                    helps you connect with the student community.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <h3 className="font-semibold mb-2">Targeted Reach</h3>
                          <p className="text-sm text-muted-foreground">
                            Connect with students based on interests, majors, and more
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <h3 className="font-semibold mb-2">Performance Analytics</h3>
                          <p className="text-sm text-muted-foreground">
                            Track impressions, clicks, and engagement
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <h3 className="font-semibold mb-2">Affordable Pricing</h3>
                          <p className="text-sm text-muted-foreground">
                            Special rates for student-run businesses
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-center mt-6">
                    <Button size="lg" asChild>
                      <Link href="/business-ads/register">
                        Create Business Account
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
