import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import Link from "next/link";
import { useAuth } from '@/components/auth/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function CreateProtestPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    meeting_point: '',
    date: null,
    time: '',
    expected_duration: '',
    safety_measures: '',
    image: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [date, setDate] = useState(null);

  // Categories for protests
  const categories = ['Academic', 'Social Justice', 'Environmental', 'Housing', 'Fees', 'Campus Services', 'Other'];
  
  // Locations
  const locations = ['Main Campus', 'North Campus', 'South Campus', 'City Center', 'Online', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setFormData(prev => ({ ...prev, date: newDate }));
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
      if (!formData.location) throw new Error('Location is required');
      if (!formData.meeting_point.trim()) throw new Error('Meeting point is required');
      if (!formData.date) throw new Error('Date is required');
      if (!formData.time.trim()) throw new Error('Time is required');
      
      let imageUrl = null;
      
      // Upload image if provided
      if (formData.image) {
        const fileName = `${Date.now()}_${formData.image.name}`;
        const filePath = `protests/${user.id}/${fileName}`;
        
        const { data: fileData, error: fileError } = await supabase.storage
          .from('protest_images')
          .upload(filePath, formData.image);
        
        if (fileError) throw fileError;
        
        const { data: urlData } = await supabase.storage
          .from('protest_images')
          .getPublicUrl(filePath);
        
        imageUrl = urlData.publicUrl;
      }
      
      // Combine date and time
      const dateTime = new Date(formData.date);
      const [hours, minutes] = formData.time.split(':');
      dateTime.setHours(parseInt(hours), parseInt(minutes));
      
      // Create the protest
      const { data, error } = await supabase
        .from('protests')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            location: formData.location,
            meeting_point: formData.meeting_point,
            date: dateTime.toISOString(),
            expected_duration: formData.expected_duration,
            safety_measures: formData.safety_measures,
            organizer_id: user.id,
            image_url: imageUrl,
            status: 'Pending' // All protests start as pending until approved
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      // Add organizer as a participant automatically
      await supabase
        .from('protest_participants')
        .insert([
          { protest_id: data.id, user_id: user.id }
        ]);
      
      // Create notification for admins to review
      await supabase
        .from('notifications')
        .insert([
          {
            user_id: null, // null means for admins
            type: 'protest_review',
            content: `New protest "${formData.title}" needs approval`,
            link: `/admin/protests/${data.id}`,
            is_read: false
          }
        ]);
      
      setSuccess(true);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        location: '',
        meeting_point: '',
        date: null,
        time: '',
        expected_duration: '',
        safety_measures: '',
        image: null
      });
      setDate(null);
      setImagePreview('');
      
      // Redirect to the new protest page after a short delay
      setTimeout(() => {
        window.location.href = `/protest-planner/${data.id}`;
      }, 2000);
    } catch (error) {
      console.error('Error creating protest:', error);
      setError(error.message || 'Failed to create protest. Please try again.');
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
            <CardTitle>Organize a Protest</CardTitle>
            <CardDescription>Sign in to organize a protest</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-6">
            <p className="mb-4">You need to be signed in to organize a protest.</p>
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
            <Link href="/protest-planner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Protests
            </Link>
          </Button>
          
          <h1 className="text-2xl font-bold">Organize a Protest</h1>
          <p className="text-muted-foreground">Create a peaceful demonstration for a cause that matters</p>
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
                <h3 className="text-lg font-semibold mb-2">Protest Created Successfully!</h3>
                <p className="text-muted-foreground mb-4">Your protest has been submitted for approval. You'll be notified once it's approved.</p>
                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Protest Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Rally for Affordable Student Housing"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the purpose of your protest, demands, and what participants can expect..."
                    rows={5}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <select 
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <select 
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      required
                    >
                      <option value="">Select location</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="meeting_point">
                    Meeting Point <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="meeting_point"
                    name="meeting_point"
                    value={formData.meeting_point}
                    onChange={handleChange}
                    placeholder="e.g., In front of the Student Union Building"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>
                      Date <span className="text-red-500">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={handleDateChange}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">
                      Time <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                      />
                      <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expected_duration">
                    Expected Duration
                  </Label>
                  <Input
                    id="expected_duration"
                    name="expected_duration"
                    value={formData.expected_duration}
                    onChange={handleChange}
                    placeholder="e.g., 2 hours"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="safety_measures">
                    Safety Measures
                  </Label>
                  <Textarea
                    id="safety_measures"
                    name="safety_measures"
                    value={formData.safety_measures}
                    onChange={handleChange}
                    placeholder="Describe safety measures you'll implement (e.g., designated marshals, first aid, communication plan)..."
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">
                    Protest Image
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
                
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Important Notice:</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    By organizing a protest, you agree to:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Ensure the protest remains peaceful and respectful</li>
                    <li>Comply with all university policies and local laws</li>
                    <li>Take responsibility for participant safety</li>
                    <li>Clean up after the demonstration</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    All protests require approval before they become visible to other users.
                  </p>
                </div>
                
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" type="button" asChild>
                    <Link href="/protest-planner">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                        Creating...
                      </>
                    ) : 'Submit for Approval'}
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
