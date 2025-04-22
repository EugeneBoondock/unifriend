import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UniVendorsPage() {
  // Sample universities with vendors
  const universities = [
    { id: "uct", name: "University of Cape Town", vendorCount: 48 },
    { id: "wits", name: "University of the Witwatersrand", vendorCount: 42 },
    { id: "up", name: "University of Pretoria", vendorCount: 37 },
    { id: "ukzn", name: "University of KwaZulu-Natal", vendorCount: 33 },
    { id: "uj", name: "University of Johannesburg", vendorCount: 31 },
    { id: "su", name: "Stellenbosch University", vendorCount: 29 },
    { id: "unisa", name: "University of South Africa", vendorCount: 25 },
    { id: "uwc", name: "University of the Western Cape", vendorCount: 22 },
    { id: "nwu", name: "North-West University", vendorCount: 18 },
  ];

  // Sample featured vendors
  const featuredVendors = [
    {
      id: "v1",
      name: "Thandi's Textbook Exchange",
      university: "University of Cape Town",
      category: "Textbooks",
      description: "Affordable second-hand textbooks for all UCT courses. Save up to 70% compared to new books!",
      rating: 4.8,
      reviews: 56,
      location: "Upper Campus, near the library",
      image: "/placeholder-vendor.png",
      featured: true
    },
    {
      id: "v2",
      name: "Sipho's Stationary Supplies",
      university: "University of the Witwatersrand",
      category: "Stationery",
      description: "Quality stationery at student-friendly prices. Notebooks, pens, highlighters, and exam essentials.",
      rating: 4.9,
      reviews: 42,
      location: "Main Campus, Student Center Building",
      image: "/placeholder-vendor.png",
      featured: true
    },
    {
      id: "v3",
      name: "Fresh Bites by Lesego",
      university: "University of Johannesburg",
      category: "Food & Snacks",
      description: "Healthy and affordable lunch options, fresh fruits, and homemade snacks perfect for study sessions.",
      rating: 4.7,
      reviews: 38,
      location: "APK Campus, outside Student Center",
      image: "/placeholder-vendor.png",
      featured: true
    }
  ];

  // Sample product categories
  const categories = [
    { id: "textbooks", name: "Textbooks", icon: "📚", vendorCount: 87 },
    { id: "stationery", name: "Stationery & Supplies", icon: "✏️", vendorCount: 64 },
    { id: "food", name: "Food & Snacks", icon: "🍎", vendorCount: 51 },
    { id: "electronics", name: "Electronics", icon: "💻", vendorCount: 32 },
    { id: "clothing", name: "Clothing & Accessories", icon: "👕", vendorCount: 29 },
    { id: "services", name: "Academic Services", icon: "📝", vendorCount: 27 },
  ];

  // Sample recent listings
  const recentListings = [
    {
      id: "l1",
      title: "Business Management 101 Textbook",
      price: "R280",
      category: "Textbooks",
      vendor: "Thandi's Textbook Exchange",
      university: "UCT",
      postedAt: "2 hours ago",
      condition: "Like New"
    },
    {
      id: "l2",
      title: "Engineering Calculator (Casio FX-991ZA)",
      price: "R220",
      category: "Electronics",
      vendor: "TechTrade Student Shop",
      university: "UP",
      postedAt: "3 hours ago",
      condition: "Good"
    },
    {
      id: "l3",
      title: "Homemade Lunch Wraps - Daily Fresh",
      price: "R40",
      category: "Food & Snacks",
      vendor: "Fresh Bites by Lesego",
      university: "UJ",
      postedAt: "1 hour ago",
      condition: "Fresh"
    },
    {
      id: "l4",
      title: "Law Textbook Bundle (1st Year)",
      price: "R650",
      category: "Textbooks",
      vendor: "LegalLibrary",
      university: "Wits",
      postedAt: "5 hours ago",
      condition: "Good"
    },
    {
      id: "l5",
      title: "Premium Notebook Bundle (5 pack)",
      price: "R120",
      category: "Stationery",
      vendor: "Sipho's Stationery Supplies",
      university: "Wits",
      postedAt: "7 hours ago",
      condition: "New"
    },
    {
      id: "l6",
      title: "Fresh Fruit Salad Cup",
      price: "R25",
      category: "Food & Snacks",
      vendor: "Healthy Campus Eats",
      university: "UKZN",
      postedAt: "30 minutes ago",
      condition: "Fresh"
    }
  ];

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 mb-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-2/3">
            <div className="flex gap-2 mb-3">
              <Badge className="bg-emerald-600">New</Badge>
              <Badge variant="outline" className="bg-white">Student-Powered Marketplace</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">UniVendors Marketplace</h1>
            <p className="text-lg text-zinc-700 mb-6">
              Supporting student entrepreneurs across South African universities. Buy and sell textbooks, stationery,
              food, and more directly from fellow students on your campus.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/uni-vendors/create">
                  Become a Vendor
                </Link>
              </Button>
              <Button variant="outline">
                <Link href="#browse">
                  Browse Products
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="w-48 h-48 bg-gradient-to-br from-emerald-200 to-teal-100 rounded-full flex items-center justify-center text-6xl">
              🛍️
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="mb-12">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:max-w-md">
            <Input
              type="search"
              placeholder="Search for products, vendors or services..."
              className="pr-10"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>Filter by:</span>
            <Badge variant="outline" className="cursor-pointer">University</Badge>
            <Badge variant="outline" className="cursor-pointer">Category</Badge>
            <Badge variant="outline" className="cursor-pointer">Price</Badge>
          </div>
        </div>
      </section>

      {/* Universities & Categories Section */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* University List */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Browse by University</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {universities.map((uni) => (
                <Link key={uni.id} href={`/uni-vendors/university/${uni.id}`} className="block">
                  <div className="border rounded-lg p-4 hover:border-emerald-300 hover:shadow-sm transition-all">
                    <h3 className="font-semibold">{uni.name}</h3>
                    <p className="text-sm text-zinc-500">{uni.vendorCount} vendors</p>
                  </div>
                </Link>
              ))}
              <Link href="/uni-vendors/university" className="block">
                <div className="border border-dashed rounded-lg p-4 text-center text-zinc-500 hover:text-zinc-700 hover:border-zinc-400 transition-all">
                  <span>View All Universities</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Product Categories</h2>
            <div className="space-y-3">
              {categories.map((category) => (
                <Link key={category.id} href={`/uni-vendors/category/${category.id}`} className="block">
                  <div className="border rounded-lg p-3 hover:border-emerald-300 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.icon}</span>
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-xs text-zinc-500">{category.vendorCount} vendors</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Student Vendors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredVendors.map((vendor) => (
            <Card key={vendor.id} className="overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-emerald-100 to-teal-50 flex items-center justify-center">
                <span className="text-4xl">
                  {vendor.category === "Textbooks" && "📚"}
                  {vendor.category === "Stationery" && "✏️"}
                  {vendor.category === "Food & Snacks" && "🍎"}
                </span>
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Badge>{vendor.category}</Badge>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500">★</span>
                    <span className="text-sm">{vendor.rating}</span>
                  </div>
                </div>
                <CardTitle className="mt-2">{vendor.name}</CardTitle>
                <CardDescription className="text-xs">{vendor.university}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600 mb-2">{vendor.description}</p>
                <div className="flex items-start gap-1 text-xs text-zinc-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{vendor.location}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm" className="w-full" asChild>
                  <Link href={`/uni-vendors/${vendor.id}`}>
                    View Vendor
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Listings */}
      <section id="browse" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Recent Listings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentListings.map((listing) => (
            <div key={listing.id} className="border rounded-lg p-4 hover:shadow-sm transition-all">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline">{listing.category}</Badge>
                <span className="text-xs text-zinc-500">{listing.postedAt}</span>
              </div>
              <h3 className="font-semibold mb-1">{listing.title}</h3>
              <p className="text-lg font-bold text-emerald-700 mb-2">{listing.price}</p>
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <div>
                  <p>Condition: {listing.condition}</p>
                  <p>{listing.vendor}</p>
                </div>
                <Badge variant="secondary">{listing.university}</Badge>
              </div>
              <div className="mt-4">
                <Button size="sm" variant="outline" className="w-full">View Details</Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button variant="outline">View All Listings</Button>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-12 bg-zinc-50 p-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">How UniVendors Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
            <h3 className="text-lg font-semibold mb-2">Register as a Vendor</h3>
            <p className="text-sm text-zinc-600">Create your vendor profile with your university, location, and what you're selling.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
            <h3 className="text-lg font-semibold mb-2">List Your Products</h3>
            <p className="text-sm text-zinc-600">Add your textbooks, stationery, food items, or services with prices and details.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
            <h3 className="text-lg font-semibold mb-2">Connect & Sell</h3>
            <p className="text-sm text-zinc-600">Receive inquiries from interested students and arrange meetups on campus.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">From Student Vendors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <p className="italic text-zinc-600 mb-4">
              "UniVendors has been a game-changer for me. I started selling my old textbooks to make extra money,
              and now I have a thriving stationery business that helps pay for my tuition."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="font-bold text-emerald-700">SN</span>
              </div>
              <div>
                <p className="font-medium">Sipho N.</p>
                <p className="text-xs text-zinc-500">3rd Year, University of Cape Town</p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <p className="italic text-zinc-600 mb-4">
              "As a student from a rural area, I struggled with finances. Now I sell homemade snacks on campus
              through UniVendors and earn enough to cover my accommodation and data costs."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="font-bold text-purple-700">TM</span>
              </div>
              <div>
                <p className="font-medium">Thandi M.</p>
                <p className="text-xs text-zinc-500">2nd Year, University of Johannesburg</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 rounded-xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Start Your Student Business Today</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Turn your skills and resources into income while helping fellow students access affordable products and services.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="bg-white text-emerald-700 hover:bg-white/90">
            <Link href="/uni-vendors/create">
              Become a UniVendor
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
            <Link href="/uni-vendors/browse">
              Browse Student Businesses
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
