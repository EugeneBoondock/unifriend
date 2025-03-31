import { Metadata } from "next";
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
    email: "thandi@textbooks.co.za",
    whatsapp: "+27 71 234 5678",
    socialMedia: {
      instagram: "@thandis_books",
      facebook: "ThandisTextbooks",
    },
    preferredContact: "WhatsApp"
  },
  openingHours: {
    monday: "10:00 - 16:00",
    tuesday: "10:00 - 16:00",
    wednesday: "10:00 - 16:00",
    thursday: "10:00 - 16:00",
    friday: "10:00 - 15:00",
    saturday: "By appointment",
    sunday: "Closed"
  },
  products: [
    {
      id: "p1",
      title: "Financial Accounting 101",
      course: "ACC1006S",
      condition: "Good - minimal highlighting",
      price: "R350",
      originalPrice: "R880",
      availability: "Available"
    },
    {
      id: "p2",
      title: "Introduction to Economics",
      course: "ECO1010F",
      condition: "Very Good - like new",
      price: "R400",
      originalPrice: "R950",
      availability: "Available"
    },
    {
      id: "p3",
      title: "Business Statistics",
      course: "STA1000S",
      condition: "Good - some highlighting",
      price: "R300",
      originalPrice: "R820",
      availability: "Reserved"
    },
    {
      id: "p4",
      title: "Commercial Law",
      course: "CML1001S",
      condition: "Very Good - minimal notes",
      price: "R380",
      originalPrice: "R900",
      availability: "Available"
    }
  ],
  services: [
    {
      id: "s1",
      title: "Book Finding Service",
      description: "Can't find a specific textbook? Let me know and I'll source it for you.",
      price: "Free (pay only for the book)"
    },
    {
      id: "s2",
      title: "Book Trade-in",
      description: "Trade in your old textbooks for credit toward other books.",
      price: "Depends on condition"
    }
  ],
  policy: "All books can be returned within 7 days if you find they don't match your course requirements. No returns for highlighting or normal wear."
}

interface Props {
  params: { id: string };
}

export default function VendorDetailPage({ params }: Props) {
  const vendor = VENDOR;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/uni-vendors" className="text-violet-600 hover:underline flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to all vendors
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-violet-100 text-violet-800 hover:bg-violet-200">{vendor.category}</Badge>
              <Badge variant="outline">{vendor.universityAbbr}</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{vendor.name}</h1>
            <p className="text-zinc-600 mb-4">{vendor.description}</p>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium ml-1">{vendor.rating}</span>
                <span className="text-zinc-500 ml-1">({vendor.reviews} reviews)</span>
              </div>
              <span className="text-zinc-400">•</span>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-zinc-600 ml-1">{vendor.location}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Button>Contact Vendor</Button>
              <Button variant="outline">Save for Later</Button>
            </div>
          </div>

          <div className="bg-violet-50 rounded-lg p-4 w-full md:w-80 shrink-0">
            <h3 className="font-medium mb-3">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>{vendor.contactDetails.phone}</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>{vendor.contactDetails.email}</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>WhatsApp: {vendor.contactDetails.whatsapp}</span>
              </div>
              <div className="pt-2 text-sm text-zinc-500">
                Preferred contact method: <span className="font-medium">{vendor.contactDetails.preferredContact}</span>
              </div>
            </div>

            <div className="border-t border-zinc-200 mt-4 pt-4">
              <h3 className="font-medium mb-3">Opening Hours</h3>
              <div className="text-sm">
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-zinc-600">Monday:</div>
                  <div>{vendor.openingHours.monday}</div>
                  <div className="text-zinc-600">Tuesday:</div>
                  <div>{vendor.openingHours.tuesday}</div>
                  <div className="text-zinc-600">Wednesday:</div>
                  <div>{vendor.openingHours.wednesday}</div>
                  <div className="text-zinc-600">Thursday:</div>
                  <div>{vendor.openingHours.thursday}</div>
                  <div className="text-zinc-600">Friday:</div>
                  <div>{vendor.openingHours.friday}</div>
                  <div className="text-zinc-600">Saturday:</div>
                  <div>{vendor.openingHours.saturday}</div>
                  <div className="text-zinc-600">Sunday:</div>
                  <div>{vendor.openingHours.sunday}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="products" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="products">Available Products</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="policy">Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendor.products.map(product => (
              <Card key={product.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{product.title}</CardTitle>
                      <CardDescription>{product.course}</CardDescription>
                    </div>
                    <Badge variant={product.availability === "Available" ? "default" : "outline"}>
                      {product.availability}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="text-zinc-600">
                      Condition: <span className="text-zinc-800">{product.condition}</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-lg font-medium">{product.price}</span>
                      <span className="text-zinc-400 line-through ml-2">{product.originalPrice}</span>
                      <span className="text-green-600 text-xs ml-2">
                        {Math.round((1 - parseInt(product.price.substring(1)) / parseInt(product.originalPrice.substring(1))) * 100)}% off
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant={product.availability === "Available" ? "default" : "outline"}
                    disabled={product.availability !== "Available"} className="w-full">
                    {product.availability === "Available" ? "Reserve Now" : "Not Available"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="services">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vendor.services.map(service => (
              <Card key={service.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600">{service.description}</p>
                  <p className="mt-2 font-medium">Price: {service.price}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Enquire</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardContent className="pt-6">
              <p className="text-zinc-700 whitespace-pre-line">
                {vendor.longDescription}
              </p>
              <div className="mt-6">
                <h3 className="font-medium text-lg mb-2">Follow {vendor.name}</h3>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm">
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                    Instagram
                  </Button>
                  <Button variant="outline" size="sm">
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                    Facebook
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policy">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium text-lg mb-3">Return & Refund Policy</h3>
              <p className="text-zinc-700">{vendor.policy}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
