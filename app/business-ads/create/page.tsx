import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useAuth } from '@/components/auth/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function CreateAdPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [businessAccount, setBusinessAccount] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [previewImage, setPreviewImage] = useState(null);
  
  // Form state
  const [adData, setAdData] = useState({
    title: '',
    description: '',
    category: '',
    link_url: '',
    valid_until: null,
    discount_percentage: '',
    target_audience: [],
    budget: '',
    image_file: null
  });

  // Categories
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

  // Target audience options
  const audienceOptions = [
    { id: 'freshman', label: 'Freshmen' },
    { id: 'sophomore', label: 'Sophomores' },
    { id: 'junior', label: 'Juniors' },
    { id: 'senior', label: 'Seniors' },
    { id: 'graduate', label: 'Graduate Students' },
    { id: 'international', label: 'International Students' },
    { id: 'arts', label: 'Arts & Humanities' },
    { id: 'business', label: 'Business' },
    { id: 'engineering', label: 'Engineering' },
    { id: 'science', label: 'Science' },
    { id: 'medicine', label: 'Medicine & Health' },
    { id: 'law', label: 'Law' }
  ];

  useEffect(() => {
    if (!user) {
      router.push('/signin');
      return;
    }
    
    checkBusinessAccount();
  }, [user, router]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (value) => {
    setAdData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleDateChange = (date) => {
    setAdData(prev => ({
      ...prev,
      valid_until: date
    }));
  };

  const handleAudienceToggle = (audienceId) => {
    setAdData(prev => {
      const currentAudience = [...prev.target_audience];
      const index = currentAudience.indexOf(audienceId);
      
      if (index === -1) {
        currentAudience.push(audienceId);
      } else {
        currentAudience.splice(index, 1);
      }
      
      return {
        ...prev,
        target_audience: currentAudience
      };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    
    setAdData(prev => ({
      ...prev,
      image_file: file
    }));
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    if (!adData.title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a title for your ad",
        variant: "destructive"
      });
      return false;
    }
    
    if (!adData.description.trim()) {
      toast({
        title: "Missing description",
        description: "Please enter a description for your ad",
        variant: "destructive"
      });
      return false;
    }
    
    if (!adData.category) {
      toast({
        title: "Missing category",
        description: "Please select a category for your ad",
        variant: "destructive"
      });
      return false;
    }
    
    if (!adData.link_url.trim()) {
      toast({
        title: "Missing link URL",
        description: "Please enter a destination URL for your ad",
        variant: "destructive"
      });
      return false;
    }
    
    // Validate URL format
    try {
      new URL(adData.link_url);
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (e.g., https://example.com)",
        variant: "destructive"
      });
      return false;
    }
    
    if (!adData.image_file) {
      toast({
        title: "Missing image",
        description: "Please upload an image for your ad",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // 1. Upload image to storage
      const fileExt = adData.image_file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `business_ads/${businessAccount.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('ad_images')
        .upload(filePath, adData.image_file);
      
      if (uploadError) throw uploadError;
      
      // 2. Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('ad_images')
        .getPublicUrl(filePath);
      
      // 3. Create ad record in database
      const { error: insertError } = await supabase
        .from('business_ads')
        .insert([
          {
            business_id: businessAccount.id,
            title: adData.title,
            description: adData.description,
            category: adData.category,
            link_url: adData.link_url,
            image_url: publicUrl,
            valid_until: adData.valid_until,
            discount_percentage: adData.discount_percentage || null,
            target_audience: adData.target_audience,
            budget: adData.budget || null,
            status: 'pending' // Ads require approval
          }
        ]);
      
      if (insertError) throw insertError;
      
      toast({
        title: "Ad submitted successfully",
        description: "Your ad has been submitted for review and will be live once approved.",
      });
      
      // Redirect to ad management page
      router.push('/business-ads/manage');
    } catch (error) {
      console.error('Error creating ad:', error);
      toast({
        title: "Error creating ad",
        description: error.message || "Failed to create ad. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild className="mb-4">
            <Link href="/business-ads" legacyBehavior>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Business Ads
            </Link>
          </Button>
        </div>
        
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Create New Ad</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Design your ad to reach students on UniFriend
          </p>
        </div>
        
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="details">Ad Details</TabsTrigger>
            <TabsTrigger value="targeting">Targeting</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <TabsContent value="details" className="space-y-6 mt-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Ad Details</CardTitle>
                  <CardDescription>
                    Provide the basic information for your ad
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Ad Title</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      placeholder="Enter a catchy title (max 50 characters)" 
                      maxLength={50}
                      value={adData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Ad Description</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      placeholder="Describe your offer or promotion (max 200 characters)" 
                      maxLength={200}
                      rows={4}
                      value={adData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={adData.category} 
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="link_url">Destination URL</Label>
                    <Input 
                      id="link_url" 
                      name="link_url" 
                      placeholder="https://example.com/your-offer" 
                      value={adData.link_url}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Where users will go when they click your ad
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="valid_until">Valid Until (Optional)</Label>
                      <DatePicker 
                        date={adData.valid_until} 
                        setDate={handleDateChange} 
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="discount_percentage">Discount Percentage (Optional)</Label>
                      <Input 
                        id="discount_percentage" 
                        name="discount_percentage" 
                        type="number" 
                        min="0"
                        max="100"
                        placeholder="e.g., 20" 
                        value={adData.discount_percentage}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="image">Ad Image</Label>
                    <div className="border-2 border-dashed rounded-md p-6 text-center">
                      {previewImage ? (
                        <div className="space-y-4">
                          <img 
                            src={previewImage} 
                            alt="Ad preview" 
                            className="max-h-48 mx-auto"
                          />
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => {
                              setPreviewImage(null);
                              setAdData(prev => ({ ...prev, image_file: null }));
                            }}
                          >
                            Remove Image
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm text-muted-foreground">
                            Upload a high-quality image (recommended size: 1200x628px)
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Maximum file size: 5MB
                          </p>
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => document.getElementById('image-upload').click()}
                          >
                            Select Image
                          </Button>
                          <input 
                            id="image-upload" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageChange}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" disabled>
                    Back
                  </Button>
                  <Button type="button" onClick={() => setActiveTab('targeting')}>
                    Next: Targeting
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="targeting" className="space-y-6 mt-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Ad Targeting</CardTitle>
                  <CardDescription>
                    Define who should see your ad
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>Target Audience</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select the student groups you want to target (optional)
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {audienceOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id={`audience-${option.id}`}
                            checked={adData.target_audience.includes(option.id)}
                            onChange={() => handleAudienceToggle(option.id)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor={`audience-${option.id}`}>{option.label}</Label>
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      If no options are selected, your ad will be shown to all students
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (Optional)</Label>
                    <Select 
                      value={adData.budget} 
                      onValueChange={(value) => setAdData(prev => ({ ...prev, budget: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Basic ($50-100)</SelectItem>
                        <SelectItem value="medium">Standard ($100-250)</SelectItem>
                        <SelectItem value="high">Premium ($250-500)</SelectItem>
                        <SelectItem value="custom">Custom (Contact Us)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Higher budgets increase your ad's visibility and reach
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('details')}>
                    Back
                  </Button>
                  <Button type="button" onClick={() => setActiveTab('preview')}>
                    Next: Preview
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-6 mt-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Ad Preview</CardTitle>
                  <CardDescription>
                    Review your ad before submission
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-muted p-2 text-xs font-medium">
                      Ad Preview
                    </div>
                    <div className="p-4">
                      <div className="max-w-md mx-auto">
                        <div className="rounded-md overflow-hidden border mb-4">
                          {previewImage ? (
                            <img 
                              src={previewImage} 
                              alt="Ad preview" 
                              className="w-full h-48 object-cover"
                            />
                          ) : (
                            <div className="w-full h-48 bg-muted flex items-center justify-center">
                              <p className="text-muted-foreground">No image uploaded</p>
                            </div>
                          )}
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="text-xs text-muted-foreground">{adData.category || 'Category'}</p>
                                <h3 className="font-semibold">{adData.title || 'Ad Title'}</h3>
                              </div>
                              {adData.discount_percentage && (
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                  {adData.discount_percentage}% OFF
                                </span>
                              )}
                            </div>
                            <p className="text-sm mb-3">{adData.description || 'Ad description will appear here'}</p>
                            <p className="text-xs text-muted-foreground">
                              By {businessAccount.name}
                            </p>
                            {adData.valid_until && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Valid until: {new Date(adData.valid_until).toLocaleDateString()}
                              </p>
                            )}
                            <Button 
                              className="w-full mt-3" 
                              size="sm"
                              disabled
                            >
                              Learn More
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Ad Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Title:</p>
                        <p>{adData.title || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Category:</p>
                        <p>{adData.category || 'Not selected'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Destination URL:</p>
                        <p className="truncate">{adData.link_url || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Valid Until:</p>
                        <p>{adData.valid_until ? new Date(adData.valid_until).toLocaleDateString() : 'No expiration'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Target Audience:</p>
                        <p>
                          {adData.target_audience.length > 0 
                            ? adData.target_audience.map(id => 
                                audienceOptions.find(opt => opt.id === id)?.label
                              ).join(', ')
                            : 'All students'
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Budget:</p>
                        <p>{adData.budget ? adData.budget.charAt(0).toUpperCase() + adData.budget.slice(1) : 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-semibold mb-2">What happens next?</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Your ad will be reviewed by our team (typically within 24-48 hours)</li>
                      <li>You'll receive an email notification once your ad is approved or if changes are needed</li>
                      <li>Once approved, your ad will start appearing to students based on your targeting preferences</li>
                      <li>You can monitor performance and make adjustments in the Business Center</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('targeting')}>
                    Back
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                        Submitting...
                      </>
                    ) : 'Submit Ad'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>
        </Tabs>
      </div>
    </div>
  );
}
