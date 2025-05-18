import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useAuth } from '@/components/auth/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function UniVendorPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Filter options
  const categories = {
    services: ['Tutoring', 'Academic Writing', 'Design Services', 'Programming', 'Translation', 'Event Planning', 'Photography', 'Other'],
    products: ['Electronics', 'Stationery', 'Books', 'Clothing', 'Furniture', 'Appliances', 'Sports Equipment', 'Other']
  };
  
  const locations = ['Cape Town', 'Johannesburg', 'Pretoria', 'Durban', 'Port Elizabeth', 'Bloemfontein', 'Stellenbosch', 'Online'];

  useEffect(() => {
    fetchServices();
    fetchProducts();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('vendor_services')
        .select(`
          *,
          profiles:user_id (id, name, image)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_products')
        .select(`
          *,
          profiles:user_id (id, name, image)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter services based on search and filters
  const filteredServices = services.filter(service => {
    const matchesSearch = 
      searchQuery === '' || 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      service.category === selectedCategory;
    
    const matchesLocation = 
      selectedLocation === 'all' || 
      service.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      searchQuery === '' || 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      product.category === selectedCategory;
    
    const matchesLocation = 
      selectedLocation === 'all' || 
      product.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="container py-6 md:py-8 pattern-container">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">UniVendor</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Buy, sell, and exchange student services and products within your university community
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input 
              placeholder="Search services, products, and more..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories[activeTab].map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-48">
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="services" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="services">Student Services</TabsTrigger>
              <TabsTrigger value="products">Student Products</TabsTrigger>
            </TabsList>
            
            {user ? (
              activeTab === 'services' ? (
                <Button asChild>
                  <Link href="/uni-vendors/services/create">Offer a Service</Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/uni-vendors/products/create">List a Product</Link>
                </Button>
              )
            ) : (
              <Button asChild>
                <Link href="/signin">Sign In to Sell</Link>
              </Button>
            )}
          </div>

          <TabsContent value="services" className="space-y-6 mt-0">
            {isLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading services...</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">No services found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
                  {user && (
                    <Button asChild>
                      <Link href="/uni-vendors/services/create">Offer First Service</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <Card key={service.id} className="glass-card h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg">{service.title}</CardTitle>
                        <Badge className="bg-primary/80 hover:bg-primary">R{service.price}</Badge>
                      </div>
                      <CardDescription>{service.category} • {service.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      {service.description && (
                        <p className="text-sm mb-3 line-clamp-2">{service.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {service.tags && service.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={service.profiles?.image || '/placeholder-user.png'} />
                          <AvatarFallback>{service.profiles?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm text-muted-foreground">
                          <span>{service.profiles?.name}</span>
                          <span className="mx-1">•</span>
                          <span>{formatDate(service.created_at)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button className="w-full" asChild>
                        <Link href={`/uni-vendors/services/${service.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {filteredServices.length > 0 && filteredServices.length < services.length && (
              <div className="text-center mt-4">
                <p className="text-muted-foreground">
                  Showing {filteredServices.length} of {services.length} services
                </p>
              </div>
            )}

            {services.length > 9 && (
              <div className="flex justify-center mt-8">
                <Button variant="outline" asChild>
                  <Link href="/uni-vendors/services">View All Services</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="products" className="space-y-6 mt-0">
            {isLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
                  {user && (
                    <Button asChild>
                      <Link href="/uni-vendors/products/create">List First Product</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="glass-card h-full flex flex-col">
                    <div className="relative pt-[60%] overflow-hidden rounded-t-lg">
                      <img 
                        src={product.image_url || '/placeholder-product.png'} 
                        alt={product.title}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg">{product.title}</CardTitle>
                        <Badge className="bg-primary/80 hover:bg-primary">R{product.price}</Badge>
                      </div>
                      <CardDescription>{product.category} • {product.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      {product.description && (
                        <p className="text-sm mb-3 line-clamp-2">{product.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {product.tags && product.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={product.profiles?.image || '/placeholder-user.png'} />
                          <AvatarFallback>{product.profiles?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm text-muted-foreground">
                          <span>{product.profiles?.name}</span>
                          <span className="mx-1">•</span>
                          <span>{formatDate(product.created_at)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button className="w-full" asChild>
                        <Link href={`/uni-vendors/products/${product.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {filteredProducts.length > 0 && filteredProducts.length < products.length && (
              <div className="text-center mt-4">
                <p className="text-muted-foreground">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>
            )}

            {products.length > 9 && (
              <div className="flex justify-center mt-8">
                <Button variant="outline" asChild>
                  <Link href="/uni-vendors/products">View All Products</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-14">
          <Card className="glass-card p-6 max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>UniVendor Community Guidelines</CardTitle>
              <CardDescription>
                Our marketplace is built on trust, fairness, and supporting fellow students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div>
                <h3 className="font-medium">✅ Do's</h3>
                <ul className="list-disc pl-5 text-muted-foreground text-sm mt-1">
                  <li>Offer services and products at fair prices</li>
                  <li>Provide accurate descriptions and images</li>
                  <li>Respond promptly to inquiries</li>
                  <li>Meet in safe, public locations for exchanges</li>
                  <li>Report any suspicious activity to moderators</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium">❌ Don'ts</h3>
                <ul className="list-disc pl-5 text-muted-foreground text-sm mt-1">
                  <li>Sell prohibited or illegal items</li>
                  <li>Misrepresent your services or products</li>
                  <li>Engage in academic dishonesty (e.g., writing assignments for others)</li>
                  <li>Share personal information publicly</li>
                  <li>Create multiple listings for the same item</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
