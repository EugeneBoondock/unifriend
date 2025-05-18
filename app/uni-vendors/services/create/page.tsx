import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useAuth } from '@/components/auth/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function CreateServicePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    location: '',
    tags: '',
    image: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  // Categories for services
  const categories = ['Tutoring', 'Academic Writing', 'Design Services', 'Programming', 'Translation', 'Event Planning', 'Photography', 'Other'];
  
  // Locations
  const locations = ['Cape Town', 'Johannesburg', 'Pretoria', 'Durban', 'Port Elizabeth', 'Bloemfontein', 'Stellenbosch', 'Online'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Validate form
      if (!formData.title.trim()) throw new Error('Title is required');
      if (!formData.category) throw new Error('Category is required');
      if (!formData.price.trim()) throw new Error('Price is required');
      if (!formData.location) throw new Error('Location is required');
      
      let imageUrl = null;
      
      // Upload image if provided
      if (formData.image) {
        const fileName = `${Date.now()}_${formData.image.name}`;
        const filePath = `services/${user.id}/${fileName}`;
        
        const { data: fileData, error: fileError } = await supabase.storage
          .from('vendor_images')
          .upload(filePath, formData.image);
        
        if (fileError) throw fileError;
        
        const { data: urlData } = await supabase.storage
          .from('vendor_images')
          .getPublicUrl(filePath);
        
        imageUrl = urlData.publicUrl;
      }
      
      // Create the service listing
      const { data, error } = await supabase
        .from('vendor_services')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            price: parseFloat(formData.price),
            location: formData.location,
            user_id: user.id,
            image_url: imageUrl,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            is_active: true,
            rating: 0,
            reviews_count: 0
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      setSuccess(true);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        price: '',
        location: '',
        tags: '',
        image: null
      });
      setImagePreview('');
      
      // Redirect to the new service page after a short delay
      setTimeout(() => {
        window.location.href = `/uni-vendors/services/${data.id}`;
      }, 2000);
    } catch (error) {
      console.error('Error creating service:', error);
      setError(error.message || 'Failed to create service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <div className="container py-8 md:py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Create Service Listing</CardTitle>
            <CardDescription>Sign in to offer your services</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-6">
            <p className="mb-4">You need to be signed in to create a service listing.</p>
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
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild className="mb-4">
            <Link href="/uni-vendors" legacyBehavior>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to UniVendor
            </Link>
          </Button>
          
          <h1 className="text-2xl font-bold">Create Service Listing</h1>
          <p className="text-muted-foreground">Offer your skills and services to the university community</p>
        </div>
        
        <Card className="glass-card">
          <CardContent className="pt-6">
            {success ? (
              <div className="text-center py-6">
                <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Service Listed Successfully!</h3>
                <p className="text-muted-foreground mb-4">Redirecting you to your service page...</p>
                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Service Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Math Tutoring for First-Year Students"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your service, experience, and what students can expect..."
                    rows={5}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleSelectChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price (R) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="e.g., 150"
                      min="0"
                      step="any"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location">
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={formData.location} 
                      onValueChange={(value) => handleSelectChange('location', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map(location => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tags">
                      Tags (comma separated)
                    </Label>
                    <Input
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="e.g., tutoring, mathematics, calculus"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">
                    Service Image
                  </Label>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional. Max file size: 5MB. Recommended size: 800x600 pixels.
                  </p>
                  
                  {imagePreview && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">Preview:</p>
                      <div className="w-full max-w-xs h-40 bg-muted rounded-md overflow-hidden">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" type="button" asChild>
                    <Link href="/uni-vendors">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                        Creating...
                      </>
                    ) : 'Create Service Listing'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
