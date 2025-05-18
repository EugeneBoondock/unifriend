import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useAuth } from '@/components/auth/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function LibraryPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('books');
  const [books, setBooks] = useState([]);
  const [journals, setJournals] = useState([]);
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [userReservations, setUserReservations] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);

  // Filter options
  const categories = {
    books: ['Fiction', 'Non-Fiction', 'Textbook', 'Reference', 'Biography', 'Science', 'Technology', 'Arts', 'Business', 'Other'],
    journals: ['Academic', 'Scientific', 'Medical', 'Engineering', 'Arts', 'Business', 'Law', 'Social Sciences', 'Other'],
    resources: ['Research Papers', 'Theses', 'Dissertations', 'Reports', 'Conference Papers', 'Other']
  };

  useEffect(() => {
    fetchLibraryData();
    if (user) {
      fetchUserReservations();
    }
  }, [user]);

  const fetchLibraryData = async () => {
    setIsLoading(true);
    try {
      // Fetch books
      const { data: booksData, error: booksError } = await supabase
        .from('library_books')
        .select('*')
        .order('title');

      if (booksError) throw booksError;
      
      // Fetch journals
      const { data: journalsData, error: journalsError } = await supabase
        .from('library_journals')
        .select('*')
        .order('title');

      if (journalsError) throw journalsError;
      
      // Fetch resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('library_resources')
        .select('*')
        .order('title');

      if (resourcesError) throw resourcesError;
      
      // Fetch featured books
      const { data: featuredData, error: featuredError } = await supabase
        .from('library_books')
        .select('*')
        .eq('is_featured', true)
        .limit(5);

      if (featuredError) throw featuredError;
      
      setBooks(booksData || []);
      setJournals(journalsData || []);
      setResources(resourcesData || []);
      setFeaturedBooks(featuredData || []);
    } catch (error) {
      console.error('Error fetching library data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserReservations = async () => {
    try {
      const { data, error } = await supabase
        .from('library_reservations')
        .select(`
          *,
          book:book_id(id, title, cover_image)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setUserReservations(data || []);
    } catch (error) {
      console.error('Error fetching user reservations:', error);
    }
  };

  // Filter items based on search and filters
  const getFilteredItems = () => {
    let items = [];
    
    switch (activeTab) {
      case 'books':
        items = books;
        break;
      case 'journals':
        items = journals;
        break;
      case 'resources':
        items = resources;
        break;
      default:
        items = books;
    }
    
    return items.filter(item => {
      const matchesSearch = 
        searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'all' || 
        item.category === selectedCategory;
      
      const matchesAvailability = 
        selectedAvailability === 'all' || 
        (selectedAvailability === 'available' && item.available_copies > 0) ||
        (selectedAvailability === 'unavailable' && item.available_copies === 0);
      
      return matchesSearch && matchesCategory && matchesAvailability;
    });
  };

  const handleReserveBook = async (bookId) => {
    if (!user) return;
    
    try {
      // Check if book is already reserved by user
      const { data: existingReservation, error: checkError } = await supabase
        .from('library_reservations')
        .select('id')
        .eq('book_id', bookId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingReservation) {
        // Already reserved, so cancel reservation
        const { error: deleteError } = await supabase
          .from('library_reservations')
          .delete()
          .eq('id', existingReservation.id);
        
        if (deleteError) throw deleteError;
        
        // Update book available copies
        const { error: updateError } = await supabase
          .from('library_books')
          .update({ available_copies: supabase.rpc('increment', { x: 1 }) })
          .eq('id', bookId);
        
        if (updateError) throw updateError;
      } else {
        // Get book details to check availability
        const { data: book, error: bookError } = await supabase
          .from('library_books')
          .select('available_copies')
          .eq('id', bookId)
          .single();
        
        if (bookError) throw bookError;
        
        if (book.available_copies <= 0) {
          throw new Error('This book is currently unavailable for reservation');
        }
        
        // Create new reservation
        const { error: insertError } = await supabase
          .from('library_reservations')
          .insert([
            { 
              book_id: bookId, 
              user_id: user.id,
              reservation_date: new Date().toISOString(),
              due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
            }
          ]);
        
        if (insertError) throw insertError;
        
        // Update book available copies
        const { error: updateError } = await supabase
          .from('library_books')
          .update({ available_copies: supabase.rpc('decrement', { x: 1 }) })
          .eq('id', bookId);
        
        if (updateError) throw updateError;
      }
      
      // Refresh data
      fetchLibraryData();
      fetchUserReservations();
    } catch (error) {
      console.error('Error reserving book:', error);
      alert(error.message);
    }
  };

  const isBookReserved = (bookId) => {
    return userReservations.some(reservation => reservation.book_id === bookId);
  };

  return (
    <div className="container py-6 md:py-8 pattern-container">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">University Library</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Access academic resources, books, journals, and research materials
          </p>
        </div>

        {/* Featured Books Carousel */}
        {featuredBooks.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Featured Books</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {featuredBooks.map((book) => (
                <Card key={book.id} className="glass-card h-full flex flex-col overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={book.cover_image || '/placeholder-book.png'} 
                      alt={book.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="py-3 flex-grow">
                    <h3 className="font-medium line-clamp-1">{book.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
                  </CardContent>
                  <CardFooter className="pt-0 pb-3">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/library/books/${book.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* User Reservations */}
        {user && userReservations.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Your Reservations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userReservations.map((reservation) => (
                <Card key={reservation.id} className="glass-card flex overflow-hidden">
                  <div className="w-1/3 h-auto overflow-hidden">
                    <img 
                      src={reservation.book?.cover_image || '/placeholder-book.png'} 
                      alt={reservation.book?.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-2/3 p-4">
                    <h3 className="font-medium line-clamp-1">{reservation.book?.title}</h3>
                    <div className="flex flex-col gap-1 mt-2 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Due:</span>
                        <span>{new Date(reservation.due_date).toLocaleDateString()}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => handleReserveBook(reservation.book_id)}
                      >
                        Return Book
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input 
              placeholder="Search by title, author, or description..." 
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
              {categories[activeTab].map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-48">
            <select 
              value={selectedAvailability} 
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">All Availability</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="books" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="books">Books</TabsTrigger>
            <TabsTrigger value="journals">Journals</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {['books', 'journals', 'resources'].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-6 mt-6">
              {isLoading ? (
                <div className="text-center py-10">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading {tab}...</p>
                </div>
              ) : getFilteredItems().length === 0 ? (
                <Card className="glass-card">
                  <CardContent className="text-center py-10">
                    <h3 className="text-lg font-semibold mb-2">No {tab} found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredItems().map((item) => (
                    <Card key={item.id} className="glass-card h-full flex flex-col">
                      <div className="relative">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={item.cover_image || '/placeholder-book.png'} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {tab === 'books' && (
                          <Badge 
                            className={`absolute top-2 right-2 ${item.available_copies > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                          >
                            {item.available_copies > 0 ? 'Available' : 'Unavailable'}
                          </Badge>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
                        {item.author && (
                          <CardDescription>by {item.author}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="flex-grow">
                        {item.description && (
                          <p className="text-sm line-clamp-3 mb-3">{item.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline">{item.category}</Badge>
                          {item.publication_year && (
                            <Badge variant="outline">{item.publication_year}</Badge>
                          )}
                          {tab === 'books' && (
                            <Badge variant="outline">{item.isbn}</Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 flex flex-col gap-3">
                        <Button 
                          className="w-full" 
                          variant="default"
                          asChild
                        >
                          <Link href={`/library/${tab}/${item.id}`}>
                            View Details
                          </Link>
                        </Button>
                        
                        {tab === 'books' && (
                          <Button 
                            className="w-full" 
                            variant={isBookReserved(item.id) ? "secondary" : "outline"}
                            disabled={!user || (item.available_copies <= 0 && !isBookReserved(item.id))}
                            onClick={() => handleReserveBook(item.id)}
                          >
                            {isBookReserved(item.id) ? 'Return Book' : 'Reserve Book'}
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Reading Lists */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-6">Reading Lists</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>First Year Essentials</CardTitle>
                <CardDescription>Must-read books for first-year students</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Academic Writing for University Students</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Critical Thinking: A Student's Introduction</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>The University Student's Handbook</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/library/reading-lists/first-year">
                    View Full List
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Research Methodology</CardTitle>
                <CardDescription>Essential resources for research students</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Research Design: Qualitative, Quantitative, and Mixed Methods</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Statistical Methods for Research</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>The Craft of Research</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/library/reading-lists/research">
                    View Full List
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Career Development</CardTitle>
                <CardDescription>Books to help prepare for your career</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>What Color Is Your Parachute?</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Designing Your Life</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>The 7 Habits of Highly Effective People</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/library/reading-lists/career">
                    View Full List
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* University Libraries Integration */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-6">Partner Libraries</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Main University Library</CardTitle>
                <CardDescription>Central Campus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Open: 8:00 AM - 10:00 PM (Mon-Fri)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Open: 9:00 AM - 6:00 PM (Sat-Sun)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>Phone: (123) 456-7890</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Email: library@university.edu</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <a href="https://library.university.edu" target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Science & Engineering Library</CardTitle>
                <CardDescription>North Campus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Open: 8:00 AM - 9:00 PM (Mon-Fri)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Open: 10:00 AM - 5:00 PM (Sat)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Closed on Sundays</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>Phone: (123) 456-7891</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <a href="https://scilib.university.edu" target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Arts & Humanities Library</CardTitle>
                <CardDescription>South Campus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Open: 9:00 AM - 8:00 PM (Mon-Fri)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Open: 11:00 AM - 4:00 PM (Sat-Sun)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>Phone: (123) 456-7892</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <a href="https://artslib.university.edu" target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
