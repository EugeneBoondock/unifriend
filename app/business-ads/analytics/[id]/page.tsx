import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useAuth } from '@/components/auth/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { LineChart, BarChart, PieChart } from '@/components/ui/charts';

export default function AdAnalyticsPage({ params }) {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [businessAccount, setBusinessAccount] = useState(null);
  const [ad, setAd] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7days');
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      impressions: 0,
      clicks: 0,
      ctr: 0,
      averageEngagementTime: 0
    },
    demographics: {
      byYear: [],
      byMajor: [],
      byGender: []
    },
    timeData: {
      labels: [],
      impressions: [],
      clicks: []
    }
  });

  useEffect(() => {
    if (!user) {
      router.push('/signin');
      return;
    }
    
    checkBusinessAccount();
  }, [user, router]);

  useEffect(() => {
    if (businessAccount && params.id) {
      fetchAdDetails();
    }
  }, [businessAccount, params.id]);

  useEffect(() => {
    if (ad) {
      fetchAnalyticsData();
    }
  }, [ad, timeRange]);

  const checkBusinessAccount = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No business account found
          router.push('/business-ads/register');
          return;
        }
        throw error;
      }
      
      setBusinessAccount(data);
    } catch (error) {
      console.error('Error checking business account:', error);
      toast({
        title: "Error",
        description: "Failed to load business account. Please try again.",
        variant: "destructive"
      });
    }
  };

  const fetchAdDetails = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('business_ads')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (error) throw error;
      
      // Verify this ad belongs to the current business
      if (data.business_id !== businessAccount.id) {
        toast({
          title: "Access denied",
          description: "You don't have permission to view this ad's analytics.",
          variant: "destructive"
        });
        router.push('/business-ads/manage');
        return;
      }
      
      setAd(data);
    } catch (error) {
      console.error('Error fetching ad details:', error);
      toast({
        title: "Error",
        description: "Failed to load ad details. Please try again.",
        variant: "destructive"
      });
      router.push('/business-ads/manage');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch actual analytics data from the database
      // For this demo, we'll generate some realistic sample data
      
      // Generate date labels based on selected time range
      const labels = [];
      const impressionsData = [];
      const clicksData = [];
      
      const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
      const now = new Date();
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Format date as "May 18" or similar
        const formattedDate = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        
        labels.push(formattedDate);
        
        // Generate random data for demo purposes
        // In a real app, this would come from the database
        const baseImpressions = Math.floor(Math.random() * 50) + 20;
        impressionsData.push(baseImpressions);
        
        const clicks = Math.floor(baseImpressions * (Math.random() * 0.2 + 0.05));
        clicksData.push(clicks);
      }
      
      // Calculate totals
      const totalImpressions = impressionsData.reduce((sum, val) => sum + val, 0);
      const totalClicks = clicksData.reduce((sum, val) => sum + val, 0);
      const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(2) : 0;
      
      // Sample demographic data
      const demographicData = {
        byYear: [
          { name: 'Freshmen', value: 25 },
          { name: 'Sophomores', value: 30 },
          { name: 'Juniors', value: 20 },
          { name: 'Seniors', value: 15 },
          { name: 'Graduate', value: 10 }
        ],
        byMajor: [
          { name: 'Business', value: 22 },
          { name: 'Engineering', value: 18 },
          { name: 'Arts', value: 15 },
          { name: 'Science', value: 20 },
          { name: 'Medicine', value: 10 },
          { name: 'Other', value: 15 }
        ],
        byGender: [
          { name: 'Female', value: 55 },
          { name: 'Male', value: 42 },
          { name: 'Non-binary', value: 3 }
        ]
      };
      
      setAnalyticsData({
        overview: {
          impressions: totalImpressions,
          clicks: totalClicks,
          ctr: ctr,
          averageEngagementTime: Math.floor(Math.random() * 30) + 10 // 10-40 seconds
        },
        demographics: demographicData,
        timeData: {
          labels: labels,
          impressions: impressionsData,
          clicks: clicksData
        }
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !businessAccount || !ad) {
    return (
      <div className="container py-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-8 pattern-container">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild className="mb-4">
            <Link href="/business-ads/manage" legacyBehavior>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Manage Ads
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Ad Preview Card */}
          <Card className="glass-card w-full md:w-64">
            <div className="h-40 overflow-hidden">
              <img 
                src={ad.image_url || '/placeholder-ad.png'} 
                alt={ad.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-1">{ad.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{ad.category}</p>
              <p className="text-xs line-clamp-3">{ad.description}</p>
              
              <div className="mt-4 pt-4 border-t border-border">
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium">{ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{new Date(ad.created_at).toLocaleDateString()}</span>
                  </div>
                  {ad.valid_until && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expires:</span>
                      <span>{new Date(ad.valid_until).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Ad Analytics</h1>
              <p className="text-lg text-muted-foreground">
                Performance metrics and insights for your ad
              </p>
            </div>
            
            <div className="flex justify-between items-center">
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="demographics">Demographics</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {isLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading analytics data...</p>
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-3xl font-bold">{analyticsData.overview.impressions}</p>
                          <p className="text-sm text-muted-foreground">Impressions</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-3xl font-bold">{analyticsData.overview.clicks}</p>
                          <p className="text-sm text-muted-foreground">Clicks</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-3xl font-bold">{analyticsData.overview.ctr}%</p>
                          <p className="text-sm text-muted-foreground">Click-Through Rate</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-3xl font-bold">{analyticsData.overview.averageEngagementTime}s</p>
                          <p className="text-sm text-muted-foreground">Avg. Engagement</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Performance Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <LineChart
                          data={{
                            labels: analyticsData.timeData.labels,
                            datasets: [
                              {
                                label: 'Impressions',
                                data: analyticsData.timeData.impressions,
                                borderColor: 'rgb(99, 102, 241)',
                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                tension: 0.3
                              },
                              {
                                label: 'Clicks',
                                data: analyticsData.timeData.clicks,
                                borderColor: 'rgb(34, 197, 94)',
                                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                tension: 0.3
                              }
                            ]
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Performance Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-md">
                        <h3 className="font-semibold text-blue-700 mb-2">Ad Performance Summary</h3>
                        <p className="text-blue-700">
                          Your ad has received {analyticsData.overview.impressions} impressions and {analyticsData.overview.clicks} clicks, 
                          with a click-through rate of {analyticsData.overview.ctr}%. 
                          {parseFloat(analyticsData.overview.ctr) > 2 
                            ? " This is above the platform average of 2%." 
                            : " The platform average CTR is 2%."}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold">Recommendations</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Consider {parseFloat(analyticsData.overview.ctr) < 2 ? "improving your ad image for better engagement" : "maintaining your current ad creative"}</li>
                          <li>Your ad performs best with {analyticsData.demographics.byYear[0].name} students - consider targeting this group specifically</li>
                          <li>The {analyticsData.demographics.byMajor[0].name} major shows the highest interest in your ad</li>
                          <li>Consider running your ad during weekdays when student engagement is highest</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Demographics Tab */}
                <TabsContent value="demographics" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle>Audience by Year</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <PieChart
                            data={{
                              labels: analyticsData.demographics.byYear.map(item => item.name),
                              datasets: [
                                {
                                  data: analyticsData.demographics.byYear.map(item => item.value),
                                  backgroundColor: [
                                    'rgba(255, 99, 132, 0.7)',
                                    'rgba(54, 162, 235, 0.7)',
                                    'rgba(255, 206, 86, 0.7)',
                                    'rgba(75, 192, 192, 0.7)',
                                    'rgba(153, 102, 255, 0.7)'
                                  ]
                                }
                              ]
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle>Audience by Major</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <PieChart
                            data={{
                              labels: analyticsData.demographics.byMajor.map(item => item.name),
                              datasets: [
                                {
                                  data: analyticsData.demographics.byMajor.map(item => item.value),
                                  backgroundColor: [
                                    'rgba(255, 99, 132, 0.7)',
                                    'rgba(54, 162, 235, 0.7)',
                                    'rgba(255, 206, 86, 0.7)',
                                    'rgba(75, 192, 192, 0.7)',
                                    'rgba(153, 102, 255, 0.7)',
                                    'rgba(255, 159, 64, 0.7)'
                                  ]
                                }
                              ]
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle>Audience by Gender</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <PieChart
                            data={{
                              labels: analyticsData.demographics.byGender.map(item => item.name),
                              datasets: [
                                {
                                  data: analyticsData.demographics.byGender.map(item => item.value),
                                  backgroundColor: [
                                    'rgba(255, 99, 132, 0.7)',
                                    'rgba(54, 162, 235, 0.7)',
                                    'rgba(153, 102, 255, 0.7)'
                                  ]
                                }
                              ]
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Demographic Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>
                        Understanding your audience demographics can help you optimize your ad targeting and messaging.
                        Here are some insights based on your current ad performance:
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Year Level Distribution</h3>
                          <p>
                            Your ad resonates most with {analyticsData.demographics.byYear[0].name} students ({analyticsData.demographics.byYear[0].value}%), 
                            followed by {analyticsData.demographics.byYear[1].name} ({analyticsData.demographics.byYear[1].value}%). 
                            Consider tailoring your messaging to address the specific needs and interests of these groups.
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold mb-2">Major Distribution</h3>
                          <p>
                            Students in {analyticsData.demographics.byMajor[0].name} ({analyticsData.demographics.byMajor[0].value}%) and 
                            {analyticsData.demographics.byMajor[1].name} ({analyticsData.demographics.byMajor[1].value}%) 
                            show the highest engagement with your ad. This suggests your offering may be particularly relevant to these fields of study.
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold mb-2">Gender Distribution</h3>
                          <p>
                            Your ad has a {analyticsData.demographics.byGender[0].value > analyticsData.demographics.byGender[1].value ? 
                              `higher engagement rate among ${analyticsData.demographics.byGender[0].name} students` : 
                              `balanced engagement across genders`}.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Performance Tab */}
                <TabsContent value="performance" className="space-y-6">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Daily Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <BarChart
                          data={{
                            labels: analyticsData.timeData.labels,
                            datasets: [
                              {
                                label: 'Impressions',
                                data: analyticsData.timeData.impressions,
                                backgroundColor: 'rgba(99, 102, 241, 0.7)'
                              },
                              {
                                label: 'Clicks',
                                data: analyticsData.timeData.clicks,
                                backgroundColor: 'rgba(34, 197, 94, 0.7)'
                              }
                            ]
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4">Date</th>
                              <th className="text-right py-3 px-4">Impressions</th>
                              <th className="text-right py-3 px-4">Clicks</th>
                              <th className="text-right py-3 px-4">CTR</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analyticsData.timeData.labels.map((date, index) => (
                              <tr key={date} className="border-b">
                                <td className="py-3 px-4">{date}</td>
                                <td className="text-right py-3 px-4">{analyticsData.timeData.impressions[index]}</td>
                                <td className="text-right py-3 px-4">{analyticsData.timeData.clicks[index]}</td>
                                <td className="text-right py-3 px-4">
                                  {analyticsData.timeData.impressions[index] > 0 
                                    ? ((analyticsData.timeData.clicks[index] / analyticsData.timeData.impressions[index]) * 100).toFixed(2) 
                                    : 0}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-muted/50">
                              <td className="py-3 px-4 font-semibold">Total</td>
                              <td className="text-right py-3 px-4 font-semibold">{analyticsData.overview.impressions}</td>
                              <td className="text-right py-3 px-4 font-semibold">{analyticsData.overview.clicks}</td>
                              <td className="text-right py-3 px-4 font-semibold">{analyticsData.overview.ctr}%</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Optimization Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>
                        Based on your ad's performance data, here are some optimization recommendations:
                      </p>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-md">
                          <h3 className="font-semibold text-green-700 mb-2">What's Working Well</h3>
                          <ul className="list-disc pl-5 space-y-1 text-green-700">
                            <li>Your ad has a consistent daily impression rate</li>
                            <li>The {analyticsData.demographics.byYear[0].name} demographic shows strong engagement</li>
                            <li>Your ad performs well with students in the {analyticsData.demographics.byMajor[0].name} major</li>
                          </ul>
                        </div>
                        
                        <div className="p-4 bg-amber-50 rounded-md">
                          <h3 className="font-semibold text-amber-700 mb-2">Areas for Improvement</h3>
                          <ul className="list-disc pl-5 space-y-1 text-amber-700">
                            <li>Consider adjusting your ad creative to improve CTR</li>
                            <li>Experiment with different messaging for {analyticsData.demographics.byYear[analyticsData.demographics.byYear.length - 1].name} students</li>
                            <li>Test different call-to-action phrases to increase click rates</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold mb-2">Next Steps</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Consider creating targeted variations of your ad for different student segments</li>
                            <li>Adjust your budget allocation to focus on high-performing days</li>
                            <li>Update your ad creative based on performance data</li>
                            <li>Explore additional targeting options to reach more relevant students</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
