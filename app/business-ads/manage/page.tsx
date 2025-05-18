import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useAuth } from '@/components/auth/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ManageAdsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [businessAccount, setBusinessAccount] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [ads, setAds] = useState({
    active: [],
    pending: [],
    expired: [],
    rejected: []
  });
  const [adToDelete, setAdToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/signin');
      return;
    }
    
    checkBusinessAccount();
  }, [user, router]);

  useEffect(() => {
    if (businessAccount) {
      fetchAds();
    }
  }, [businessAccount]);

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

  const fetchAds = async () => {
    setIsLoading(true);
    try {
      // Fetch all ads for this business
      const { data, error } = await supabase
        .from('business_ads')
        .select('*')
        .eq('business_id', businessAccount.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Categorize ads by status
      const now = new Date();
      const categorizedAds = {
        active: [],
        pending: [],
        expired: [],
        rejected: []
      };
      
      data.forEach(ad => {
        // Check if ad is expired
        const isExpired = ad.valid_until && new Date(ad.valid_until) < now;
        
        if (isExpired) {
          categorizedAds.expired.push(ad);
        } else if (ad.status === 'approved') {
          categorizedAds.active.push(ad);
        } else if (ad.status === 'pending') {
          categorizedAds.pending.push(ad);
        } else if (ad.status === 'rejected') {
          categorizedAds.rejected.push(ad);
        }
      });
      
      setAds(categorizedAds);
    } catch (error) {
      console.error('Error fetching ads:', error);
      toast({
        title: "Error",
        description: "Failed to load your ads. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAd = async () => {
    if (!adToDelete) return;
    
    setDeleteLoading(true);
    
    try {
      // Delete ad from database
      const { error } = await supabase
        .from('business_ads')
        .delete()
        .eq('id', adToDelete.id);
      
      if (error) throw error;
      
      // If ad has an image, delete it from storage
      if (adToDelete.image_url) {
        const imagePath = adToDelete.image_url.split('/').pop();
        if (imagePath) {
          const { error: storageError } = await supabase.storage
            .from('ad_images')
            .remove([`business_ads/${businessAccount.id}/${imagePath}`]);
          
          if (storageError) {
            console.error('Error deleting image:', storageError);
            // Continue even if image deletion fails
          }
        }
      }
      
      toast({
        title: "Ad deleted",
        description: "Your ad has been successfully deleted.",
      });
      
      // Refresh ads list
      fetchAds();
    } catch (error) {
      console.error('Error deleting ad:', error);
      toast({
        title: "Error",
        description: "Failed to delete ad. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setAdToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No expiration';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending Review</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'expired':
        return <Badge className="bg-gray-500">Expired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (!user || !businessAccount) {
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
            <Link href="/business-ads">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Business Ads
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Your Ads</h1>
            <p className="text-lg text-muted-foreground">
              View and manage your advertisements on UniFriend
            </p>
          </div>
          <Button asChild>
            <Link href="/business-ads/create">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Ad
            </Link>
          </Button>
        </div>
        
        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
            <TabsTrigger value="active">
              Active ({ads.active.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({ads.pending.length})
            </TabsTrigger>
            <TabsTrigger value="expired">
              Expired ({ads.expired.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({ads.rejected.length})
            </TabsTrigger>
          </TabsList>
          
          {['active', 'pending', 'expired', 'rejected'].map((status) => (
            <TabsContent key={status} value={status} className="space-y-6 mt-6">
              {isLoading ? (
                <div className="text-center py-10">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading ads...</p>
                </div>
              ) : ads[status].length === 0 ? (
                <Card className="glass-card">
                  <CardContent className="text-center py-10">
                    <h3 className="text-lg font-semibold mb-2">No {status} ads</h3>
                    <p className="text-muted-foreground mb-6">
                      {status === 'active' && "You don't have any active ads at the moment."}
                      {status === 'pending' && "You don't have any ads pending review."}
                      {status === 'expired' && "You don't have any expired ads."}
                      {status === 'rejected' && "You don't have any rejected ads."}
                    </p>
                    {status !== 'active' && status !== 'pending' && (
                      <Button asChild>
                        <Link href="/business-ads/create">Create New Ad</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ads[status].map((ad) => (
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
                          {getStatusBadge(ad.status)}
                        </div>
                        <CardTitle className="text-lg mt-2">{ad.title}</CardTitle>
                        <CardDescription>Created: {new Date(ad.created_at).toLocaleDateString()}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm line-clamp-2 mb-3">{ad.description}</p>
                        <div className="space-y-1 text-sm">
                          {ad.valid_until && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Valid until:</span>
                              <span>{formatDate(ad.valid_until)}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Impressions:</span>
                            <span>{ad.impressions || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Clicks:</span>
                            <span>{ad.clicks || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">CTR:</span>
                            <span>
                              {ad.impressions ? ((ad.clicks || 0) / ad.impressions * 100).toFixed(2) : 0}%
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 flex flex-col gap-2">
                        <div className="grid grid-cols-2 gap-2 w-full">
                          <Button 
                            variant="outline" 
                            size="sm"
                            asChild
                          >
                            <Link href={`/business-ads/analytics/${ad.id}`}>
                              Analytics
                            </Link>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            asChild
                          >
                            <a href={ad.link_url} target="_blank" rel="noopener noreferrer">
                              View Link
                            </a>
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 w-full">
                          {status === 'active' || status === 'expired' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              asChild
                            >
                              <Link href={`/business-ads/edit/${ad.id}`}>
                                Edit
                              </Link>
                            </Button>
                          ) : status === 'rejected' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              asChild
                            >
                              <Link href={`/business-ads/edit/${ad.id}`}>
                                Revise
                              </Link>
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled
                            >
                              Pending
                            </Button>
                          )}
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => {
                              setAdToDelete(ad);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        
        <Card className="glass-card mt-10">
          <CardHeader>
            <CardTitle>Ad Performance Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Improve your ad performance with these tips:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use high-quality images that clearly showcase your offering</li>
              <li>Create compelling headlines that grab attention</li>
              <li>Include a clear call-to-action in your description</li>
              <li>Target specific student groups relevant to your offering</li>
              <li>Regularly review analytics to optimize your campaigns</li>
              <li>Consider offering exclusive student discounts to increase engagement</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Ad</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this ad? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {adToDelete && (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 overflow-hidden rounded">
                  <img 
                    src={adToDelete.image_url || '/placeholder-ad.png'} 
                    alt={adToDelete.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{adToDelete.title}</h3>
                  <p className="text-sm text-muted-foreground">{adToDelete.category}</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAd}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                  Deleting...
                </>
              ) : 'Delete Ad'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
