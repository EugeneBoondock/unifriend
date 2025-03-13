import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// This would normally come from a database
const VENDOR = {
  id: "v1",
  name: "Thandi's Textbook Exchange",
  university: "University of Cape Town",
  universityAbbr: "UCT",
  category: "Textbooks",
  description: "Affordable second-hand textbooks for all UCT courses. Save up to 70% compared to new books! I source quality textbooks from graduates and ensure they're in good condition before selling them at student-friendly prices.",
  longDescription: "As a 3rd year BCom student, I started this textbook exchange to help fellow students save money on expensive course materials. Having struggled with textbook costs in my first year, I now work with graduates and other students to provide affordable, quality books that are curriculum-specific for UCT courses. All books are checked for highlighting, notes, and physical condition before being listed.",
  rating: 4.8,
  reviews: 56,
  location: "Upper Campus, near the library",
  contactDetails: {
    phone: "+27 71 234 5678",
    whatsapp: "+27 71 234 5678",
    email: "thandib@gmail.com",
  },
  meetingPreference: "On campus, usually at the Student Center or Library entrance",
  paymentMethods: ["Cash", "SnapScan", "Bank Transfer"],
  operatingHours: "Mon-Fri: 10am-4pm (during term)",
  verified: true,
  memberSince: "August 2023",
  featuredProducts: [
    {
      id: "p1",
      title: "Economics 101 Textbook (Mankiw)",
      price: "R320",
      condition: "Like New",
      description: "7th Edition, perfect condition with no highlights or notes.",
      image: null,
    },
    {
      id: "p2",
      title: "Accounting Principles Bundle",
      price: "R550",
      condition: "Good",
      description: "Complete set of accounting textbooks for 1st year BCom students. Includes workbooks.",
      image: null,
    },
    {
      id: "p3",
      title: "Business Law Textbook",
      price: "R280",
      condition: "Very Good",
      description: "2023 edition, some highlighting on key chapters but otherwise in excellent condition.",
      image: null,
    },
  ],
  allProducts: [
    {
      id: "p1",
      title: "Economics 101 Textbook (Mankiw)",
      price: "R320",
      condition: "Like New",
      description: "7th Edition, perfect condition with no highlights or notes.",
      image: null,
    },
    {
      id: "p2",
      title: "Accounting Principles Bundle",
      price: "R550",
      condition: "Good",
      description: "Complete set of accounting textbooks for 1st year BCom students. Includes workbooks.",
      image: null,
    },
    {
      id: "p3",
      title: "Business Law Textbook",
      price: "R280",
      condition: "Very Good",
      description: "2023 edition, some highlighting on key chapters but otherwise in excellent condition.",
      image: null,
    },
    {
      id: "p4",
      title: "Statistics for Business",
      price: "R240",
      condition: "Good",
      description: "Required textbook for BUS2010F. Includes practice question booklet.",
      image: null,
    },
    {
      id: "p5",
      title: "Corporate Finance Essentials",
      price: "R350",
      condition: "Like New",
      description: "Latest edition (2024) with online access code unused.",
      image: null,
    },
    {
      id: "p6",
      title: "Marketing Management",
      price: "R260",
      condition: "Good",
      description: "Used for one semester only, minor wear on corners.",
      image: null,
    },
  ],
  reviews: [
    {
      id: "r1",
      user: "Sipho M.",
      rating: 5,
      date: "February 15, 2024",
      text: "Saved so much money buying my textbooks from Thandi! The books were in perfect condition as described, and she was very helpful in recommending the correct editions for my courses.",
    },
    {
      id: "r2",
      user: "Lerato K.",
      rating: 5,
      date: "January 28, 2024",
      text: "Great service and fair prices. Thandi was on time for our meeting and the transaction was smooth. Will definitely buy from her again.",
    },
    {
      id: "r3",
      user: "David N.",
      rating: 4,
      date: "November 10, 2023",
      text: "Good quality textbooks at reasonable prices. One book had more highlighting than I expected, but Thandi offered a small discount which was fair.",
    },
  ],
};

export default function VendorDetailPage({ params }: { params: { id: string } }) {
  const vendor = VENDOR; // In a real app, you would fetch the vendor by params.id

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <Link href="/uni-vendors" className="flex items-center text-sm text-zinc-500 mb-8 hover:text-zinc-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to UniVendors
      </Link>

      {/* Vendor Header */}
      <div className="bg-white border rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-24 h-24 bg-emerald-100 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
            📚
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold">{vendor.name}</h1>
              {vendor.verified && (
                <Badge className="bg-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Verified
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">{vendor.category}</Badge>
              <Badge variant="secondary">{vendor.universityAbbr}</Badge>
              <div className="flex items-center">
                <span className="text-amber-500 mr-1">★</span>
                <span className="text-sm font-medium">{vendor.rating}</span>
                <span className="text-xs text-zinc-500 ml-1">({vendor.reviews} reviews)</span>
              </div>
            </div>
            <p className="text-zinc-700 mb-4">{vendor.description}</p>
            <div className="flex flex-wrap gap-4">
              <Button>Contact Vendor</Button>
              <Button variant="outline">Save Vendor</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Products */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="featured" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="featured">Featured Products</TabsTrigger>
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="featured">
              <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vendor.featuredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="h-40 bg-zinc-100 flex items-center justify-center">
                      <span className="text-6xl opacity-40">📚</span>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start mb-1">
                        <CardTitle className="text-lg">{product.title}</CardTitle>
                        <span className="font-bold text-emerald-700">{product.price}</span>
                      </div>
                      <CardDescription>Condition: {product.condition}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-zinc-600">{product.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button size="sm" className="w-full">Contact About This Item</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="all">
              <h2 className="text-xl font-semibold mb-4">All Products ({vendor.allProducts.length})</h2>
              <div className="grid grid-cols-1 gap-4">
                {vendor.allProducts.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 hover:shadow-sm transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{product.title}</h3>
                        <p className="text-sm text-zinc-500">Condition: {product.condition}</p>
                      </div>
                      <span className="font-bold text-emerald-700">{product.price}</span>
                    </div>
                    <p className="text-sm text-zinc-600 mt-2 mb-4">{product.description}</p>
                    <Button size="sm" variant="outline">Contact About This Item</Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Reviews ({vendor.reviews.length})</h2>
                <div className="flex items-center">
                  <span className="text-3xl text-amber-500 mr-2">★</span>
                  <div>
                    <div className="font-bold text-xl">{vendor.rating}</div>
                    <div className="text-xs text-zinc-500">{vendor.reviews.length} reviews</div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                {vendor.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6">
                    <div className="flex justify-between mb-2">
                      <div className="font-semibold">{review.user}</div>
                      <div className="text-sm text-zinc-500">{review.date}</div>
                    </div>
                    <div className="flex items-center mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-lg ${i < review.rating ? 'text-amber-500' : 'text-zinc-200'}`}>★</span>
                      ))}
                    </div>
                    <p className="text-zinc-700">{review.text}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Vendor Info */}
        <div>
          <div className="bg-white border rounded-lg p-6 mb-6">
            <h2 className="font-semibold mb-4">About the Vendor</h2>
            <p className="text-sm text-zinc-600 mb-4">{vendor.longDescription}</p>
            <div className="text-sm space-y-2 border-t pt-4">
              <div className="flex items-start">
                <div className="w-24 font-medium text-zinc-700">Member since</div>
                <div>{vendor.memberSince}</div>
              </div>
              <div className="flex items-start">
                <div className="w-24 font-medium text-zinc-700">University</div>
                <div>{vendor.university}</div>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6 mb-6">
            <h2 className="font-semibold mb-4">Location & Meeting Details</h2>
            <div className="text-sm space-y-3">
              <div className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-zinc-700">{vendor.location}</span>
              </div>
              <div className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-zinc-700">{vendor.operatingHours}</span>
              </div>
              <div className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                <span className="text-zinc-700">Preferred Meeting: {vendor.meetingPreference}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h2 className="font-semibold mb-4">Contact Information</h2>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-zinc-700">{vendor.contactDetails.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                <span className="text-zinc-700">WhatsApp: {vendor.contactDetails.whatsapp}</span>
              </div>
              <div className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-zinc-700">{vendor.contactDetails.email}</span>
              </div>
            </div>
            <h3 className="text-sm font-medium mb-2">Payment Methods</h3>
            <div className="flex flex-wrap gap-2">
              {vendor.paymentMethods.map((method, index) => (
                <Badge key={index} variant="outline">{method}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Safety Reminder */}
      <div className="mt-10 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="font-medium text-amber-800">Safety Reminder</h3>
            <p className="text-sm text-amber-700">
              Always meet vendors in public, well-lit areas on campus. Never send payment before receiving items, and let someone know when and where you're meeting. For more safety tips, see our <Link href="/safety-guidelines" className="underline">Safety Guidelines</Link>.
            </p>
          </div>
        </div>
      </div>

      {/* Report Button */}
      <div className="mt-4 text-center">
        <Button variant="ghost" size="sm" className="text-zinc-500 text-xs">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
          </svg>
          Report this vendor
        </Button>
      </div>
    </div>
  );
}
