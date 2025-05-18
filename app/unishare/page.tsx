import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useAuth } from '@/components/auth/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function UniSharePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('resources');
  const [resources, setResources] = useState([]);
  const [textbooks, setTextbooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedUniversity, setSelectedUniversity] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [listBookDialogOpen, setListBookDialogOpen] = useState(false);

  // Filter options
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Economics', 'Law', 'Literature', 'Engineering', 'Medicine'];
  const universities = ['University of Cape Town', 'University of the Witwatersrand', 'Stellenbosch University', 'University of Pretoria', 'Rhodes University', 'University of Johannesburg'];
  const formats = ['PDF', 'Word', 'PowerPoint', 'Excel', 'Video', 'Audio', 'Code', 'Other'];

  useEffect(() => {
    fetchResources();
    fetchTextbooks();
  }, []);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('shared_resources')
        .select(`
          *,
          profiles:user_id (id, name, image)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTextbooks = async () => {
    try {
      const { data, error } = await supabase
        .from('textbooks')
        .select(`
          *,
          profiles:user_id (id, name, image)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTextbooks(data || []);
    } catch (error) {
      console.error('Error fetching textbooks:', error);
    }
  };

  const handleResourceUpload = async (formData) => {
    if (!user) return;

    try {
      // First upload the file to storage
      const fileName = `${Date.now()}_${formData.file.name}`;
      const filePath = `resources/${user.id}/${fileName}`;
      
      const { data: fileData, error: fileError } = await supabase.storage
        .from('resources')
        .upload(filePath, formData.file);
      
      if (fileError) throw fileError;
      
      // Get the public URL for the file
      const { data: urlData } = await supabase.storage
        .from('resources')
        .getPublicUrl(filePath);
      
      // Create the resource record in the database
      const { data, error } = await supabase
        .from('shared_resources')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            subject: formData.subject,
            university: formData.university,
            user_id: user.id,
            file_url: urlData.publicUrl,
            file_size: formData.file.size,
            file_type: formData.file.type,
            format: formData.format,
            tags: formData.tags.split(',').map(tag => tag.trim()),
            downloads: 0
          }
        ])
        .select();
      
      if (error) throw error;
      
      // Add the new resource to the list
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('name, image')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      
      const newResource = {
        ...data[0],
        profiles: {
          id: user.id,
          name: profileData.name,
          image: profileData.image
        }
      };
      
      setResources([newResource, ...resources]);
      setUploadDialogOpen(false);
    } catch (error) {
      console.error('Error uploading resource:', error);
      alert('Failed to upload resource. Please try again.');
    }
  };

  const handleTextbookListing = async (formData) => {
    if (!user) return;

    try {
      // Upload book image if provided
      let imageUrl = null;
      if (formData.image) {
        const fileName = `${Date.now()}_${formData.image.name}`;
        const filePath = `textbooks/${user.id}/${fileName}`;
        
        const { data: fileData, error: fileError } = await supabase.storage
          .from('textbooks')
          .upload(filePath, formData.image);
        
        if (fileError) throw fileError;
        
        const { data: urlData } = await supabase.storage
          .from('textbooks')
          .getPublicUrl(filePath);
        
        imageUrl = urlData.publicUrl;
      }
      
      // Create the textbook listing
      const { data, error } = await supabase
        .from('textbooks')
        .insert([
          {
            title: formData.title,
            author: formData.author,
            description: formData.description,
            condition: formData.condition,
            price: formData.price,
            location: formData.location,
            user_id: user.id,
            image_url: imageUrl,
            tags: formData.tags.split(',').map(tag => tag.trim()),
            is_available: true
          }
        ])
        .select();
      
      if (error) throw error;
      
      // Add the new textbook to the list
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('name, image')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      
      const newTextbook = {
        ...data[0],
        profiles: {
          id: user.id,
          name: profileData.name,
          image: profileData.image
        }
      };
      
      setTextbooks([newTextbook, ...textbooks]);
      setListBookDialogOpen(false);
    } catch (error) {
      console.error('Error listing textbook:', error);
      alert('Failed to list textbook. Please try again.');
    }
  };

  const incrementDownloads = async (resourceId) => {
    try {
      await supabase
        .from('shared_resources')
        .update({ downloads: supabase.rpc('increment', { x: 1 }) })
        .eq('id', resourceId);
      
      // Update local state
      setResources(resources.map(resource => 
        resource.id === resourceId 
          ? { ...resource, downloads: (resource.downloads || 0) + 1 } 
          : resource
      ));
    } catch (error) {
      console.error('Error incrementing downloads:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter resources based on search and filters
  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSubject = 
      selectedSubject === 'all' || 
      resource.subject === selectedSubject;
    
    const matchesUniversity = 
      selectedUniversity === 'all' || 
      resource.university === selectedUniversity;
    
    const matchesFormat = 
      selectedFormat === 'all' || 
      resource.format === selectedFormat;
    
    return matchesSearch && matchesSubject && matchesUniversity && matchesFormat;
  });

  // Filter textbooks based on search
  const filteredTextbooks = textbooks.filter(book => 
    searchQuery === '' || 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container py-6 md:py-8 pattern-container">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">UniShare</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Share and access study materials, textbooks, and resources with students across South Africa
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input 
              placeholder="Search resources, textbooks, and more..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          {activeTab === 'resources' && (
            <>
              <div className="w-full md:w-48">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-48">
                <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                  <SelectTrigger>
                    <SelectValue placeholder="University" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Universities</SelectItem>
                    {universities.map(university => (
                      <SelectItem key={university} value={university}>{university}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-48">
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Formats</SelectItem>
                    {formats.map(format => (
                      <SelectItem key={format} value={format}>{format}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        <Tabs defaultValue="resources" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="resources">Study Resources</TabsTrigger>
              <TabsTrigger value="textbooks">Textbooks</TabsTrigger>
            </TabsList>
            
            {user ? (
              activeTab === 'resources' ? (
                <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Upload Resource</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <ResourceUploadForm onSubmit={handleResourceUpload} onCancel={() => setUploadDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
              ) : (
                <Dialog open={listBookDialogOpen} onOpenChange={setListBookDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>List Textbook</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <TextbookListingForm onSubmit={handleTextbookListing} onCancel={() => setListBookDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
              )
            ) : (
              <Button asChild>
                <Link href="/signin">Sign In to Share</Link>
              </Button>
            )}
          </div>

          <TabsContent value="resources" className="space-y-6 mt-0">
            {isLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading resources...</p>
              </div>
            ) : filteredResources.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">No resources found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
                  {user && (
                    <Button onClick={() => setUploadDialogOpen(true)}>Upload First Resource</Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                  <Card key={resource.id} className="glass-card h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <Badge variant="outline" className="dark:bg-brand-purple/10">{resource.format}</Badge>
                      </div>
                      <CardDescription>{resource.university} • {resource.subject}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      {resource.description && (
                        <p className="text-sm mb-3 line-clamp-2">{resource.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {resource.tags && resource.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={resource.profiles?.image || '/placeholder-user.png'} />
                          <AvatarFallback>{resource.profiles?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm text-muted-foreground">
                          <span>{resource.profiles?.name}</span>
                          <span className="mx-1">•</span>
                          <span>{formatDate(resource.created_at)}</span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        <p>{resource.downloads || 0} downloads • {formatFileSize(resource.file_size)}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          incrementDownloads(resource.id);
                          window.open(resource.file_url, '_blank');
                        }}
                      >
                        Download
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {filteredResources.length > 0 && filteredResources.length < resources.length && (
              <div className="text-center mt-4">
                <p className="text-muted-foreground">
                  Showing {filteredResources.length} of {resources.length} resources
                </p>
              </div>
            )}

            {resources.length > 9 && (
              <div className="flex justify-center mt-8">
                <Button variant="outline" asChild>
                  <Link href="/unishare/resources">View All Resources</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="textbooks" className="space-y-6 mt-0">
            {isLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading textbooks...</p>
              </div>
            ) : filteredTextbooks.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">No textbooks found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your search or be the first to list a textbook</p>
                  {user && (
                    <Button onClick={() => setListBookDialogOpen(true)}>List First Textbook</Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredTextbooks.map((book) => (
                  <Card key={book.id} className="glass-card h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg">{book.title}</CardTitle>
                        <Badge className="bg-primary/80 hover:bg-primary">R{book.price}</Badge>
                      </div>
                      <CardDescription>By {book.author}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex gap-4">
                        {book.image_url && (
                          <div className="w-24 h-32 bg-muted rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={book.image_url} 
                              alt={book.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          {book.description && (
                            <p className="text-sm mb-3 line-clamp-3">{book.description}</p>
                          )}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {book.tags && book.tags.map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-3">
                            <div>
                              <span className="text-muted-foreground">Condition:</span>
                              <span className="ml-2 font-medium">{book.condition}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Location:</span>
                              <span className="ml-2 font-medium">{book.location}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Seller:</span>
                              <span className="ml-2 font-medium">{book.profiles?.name}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Listed:</span>
                              <span className="ml-2 font-medium">{formatDate(book.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button className="w-full" asChild>
                        <Link href={`/unishare/textbooks/${book.id}`}>Contact Seller</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {filteredTextbooks.length > 0 && filteredTextbooks.length < textbooks.length && (
              <div className="text-center mt-4">
                <p className="text-muted-foreground">
                  Showing {filteredTextbooks.length} of {textbooks.length} textbooks
                </p>
              </div>
            )}

            {textbooks.length > 6 && (
              <div className="flex justify-center mt-8">
                <Button variant="outline" asChild>
                  <Link href="/unishare/textbooks">View All Textbooks</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-14">
          <Card className="glass-card p-6 max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>UniShare Community Guidelines</CardTitle>
              <CardDescription>
                Our sharing platform is built on respect, integrity, and supporting fellow students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div>
                <h3 className="font-medium">✅ Do Share</h3>
                <ul className="list-disc pl-5 text-muted-foreground text-sm mt-1">
                  <li>Your personal notes, summaries, and study guides</li>
                  <li>Past exams and assignment examples (that are publicly released)</li>
                  <li>Helpful resources and reference materials</li>
                  <li>Second-hand textbooks at fair prices</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium">❌ Don't Share</h3>
                <ul className="list-disc pl-5 text-muted-foreground text-sm mt-1">
                  <li>Confidential or copyright-protected materials</li>
                  <li>Current assignment solutions or test answers</li>
                  <li>Resources that violate your university's academic integrity policies</li>
                  <li>Materials with personal information of other students</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Resource Upload Form Component
function ResourceUploadForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    university: '',
    format: '',
    tags: '',
    file: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
      setFileSelected(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Upload Study Resource</DialogTitle>
        <DialogDescription>
          Share your notes, summaries, or study guides with other students
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="title" className="text-right text-sm font-medium">
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="description" className="text-right text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="col-span-3"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="subject" className="text-right text-sm font-medium">
            Subject <span className="text-red-500">*</span>
          </label>
          <Input
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="col-span-3"
            placeholder="e.g., Mathematics, Physics, Economics"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="university" className="text-right text-sm font-medium">
            University <span className="text-red-500">*</span>
          </label>
          <Input
            id="university"
            name="university"
            value={formData.university}
            onChange={handleChange}
            className="col-span-3"
            placeholder="e.g., University of Cape Town"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="format" className="text-right text-sm font-medium">
            Format <span className="text-red-500">*</span>
          </label>
          <Input
            id="format"
            name="format"
            value={formData.format}
            onChange={handleChange}
            className="col-span-3"
            placeholder="e.g., PDF, Word, PowerPoint"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="tags" className="text-right text-sm font-medium">
            Tags
          </label>
          <Input
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="col-span-3"
            placeholder="e.g., First Year, Notes, Exam Prep (comma separated)"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="file" className="text-right text-sm font-medium">
            File <span className="text-red-500">*</span>
          </label>
          <div className="col-span-3">
            <Input
              id="file"
              name="file"
              type="file"
              onChange={handleFileChange}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Max file size: 50MB. Supported formats: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, ZIP
            </p>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !fileSelected}>
          {isLoading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
              Uploading...
            </>
          ) : 'Upload Resource'}
        </Button>
      </DialogFooter>
    </form>
  );
}

// Textbook Listing Form Component
function TextbookListingForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    condition: 'Good',
    price: '',
    location: '',
    tags: '',
    image: null
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>List Textbook for Sale</DialogTitle>
        <DialogDescription>
          Sell your used textbooks to other students
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="title" className="text-right text-sm font-medium">
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="author" className="text-right text-sm font-medium">
            Author <span className="text-red-500">*</span>
          </label>
          <Input
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="description" className="text-right text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="col-span-3"
            rows={3}
            placeholder="Edition, special features, etc."
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="condition" className="text-right text-sm font-medium">
            Condition <span className="text-red-500">*</span>
          </label>
          <Select 
            name="condition" 
            value={formData.condition} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Like New">Like New</SelectItem>
              <SelectItem value="Very Good">Very Good</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Acceptable">Acceptable</SelectItem>
              <SelectItem value="Poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="price" className="text-right text-sm font-medium">
            Price (R) <span className="text-red-500">*</span>
          </label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            className="col-span-3"
            placeholder="e.g., 350"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="location" className="text-right text-sm font-medium">
            Location <span className="text-red-500">*</span>
          </label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="col-span-3"
            placeholder="e.g., Cape Town, Johannesburg"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="tags" className="text-right text-sm font-medium">
            Tags
          </label>
          <Input
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="col-span-3"
            placeholder="e.g., Economics, Textbook, First Year (comma separated)"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="image" className="text-right text-sm font-medium">
            Book Image
          </label>
          <div className="col-span-3">
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Optional. Max file size: 5MB. Supported formats: JPG, PNG, GIF
            </p>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
              Listing...
            </>
          ) : 'List Textbook'}
        </Button>
      </DialogFooter>
    </form>
  );
}
