"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UniShare() {
  const [activeTab, setActiveTab] = useState("textbooks");
  const [searchTerm, setSearchTerm] = useState("");
  const [universityFilter, setUniversityFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  // Mock data for demonstration
  const textbooks = [
    {
      id: 1,
      title: "Introduction to Calculus and Analysis",
      author: "Richard Courant",
      course: "Mathematics 101",
      condition: "Good",
      price: "R250",
      type: "Sell",
      user: {
        name: "Thabo M.",
        university: "University of Cape Town",
        avatar: "/avatars/01.png",
        rating: 4.8,
      },
      listed: "2 days ago",
      location: "Observatory, Cape Town",
    },
    {
      id: 2,
      title: "Organic Chemistry",
      author: "Paula Bruice",
      course: "Chemistry 202",
      condition: "Like New",
      price: "Free to Borrow",
      type: "Lend",
      user: {
        name: "Amahle N.",
        university: "University of the Witwatersrand",
        avatar: "/avatars/02.png",
        rating: 4.5,
      },
      listed: "5 days ago",
      location: "Braamfontein, Johannesburg",
    },
    {
      id: 3,
      title: "Psychology: The Science of Mind and Behaviour",
      author: "Nigel Holt",
      course: "Psychology 101",
      condition: "Fair",
      price: "R150",
      type: "Sell",
      user: {
        name: "Daniel K.",
        university: "Stellenbosch University",
        avatar: "/avatars/03.png",
        rating: 4.2,
      },
      listed: "1 week ago",
      location: "Stellenbosch",
    },
    {
      id: 4,
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen",
      course: "Computer Science 202",
      condition: "Good",
      price: "Share Purchase (R400 ÷ 4)",
      type: "Co-own",
      user: {
        name: "Lerato P.",
        university: "University of Pretoria",
        avatar: "/avatars/04.png",
        rating: 4.9,
      },
      listed: "3 days ago",
      location: "Hatfield, Pretoria",
    }
  ];

  const mealShares = [
    {
      id: 1,
      title: "3 Meal Vouchers Available",
      description: "Have extra meal vouchers this week, available for anyone who needs them.",
      location: "UCT Upper Campus",
      expires: "Today",
      user: {
        name: "Anonymous",
        university: "University of Cape Town",
      },
      listed: "5 hours ago",
    },
    {
      id: 2,
      title: "Weekly Potluck Dinner",
      description: "Organizing a weekly dinner where everyone brings a dish. Great way to share meals and meet people!",
      location: "Student Village, Braamfontein",
      date: "Every Thursday at 7 PM",
      user: {
        name: "Thandi M.",
        university: "University of the Witwatersrand",
        avatar: "/avatars/05.png",
        rating: 4.7,
      },
      listed: "2 days ago",
    }
  ];

  const rides = [
    {
      id: 1,
      title: "Daily Commute to UKZN",
      route: "Durban North → UKZN Howard College",
      schedule: "Mon-Fri, Depart 7:15am, Return 5pm",
      seats: 3,
      costShare: "R30 per trip",
      user: {
        name: "Mbali Z.",
        university: "University of KwaZulu-Natal",
        avatar: "/avatars/06.png",
        rating: 4.6,
        verified: true,
      },
      listed: "1 day ago",
    },
    {
      id: 2,
      title: "Weekend Trip to Cape Town",
      route: "Stellenbosch → Cape Town CBD",
      schedule: "Sat, Nov 18, Depart 10am",
      seats: 2,
      costShare: "R50 per person",
      user: {
        name: "James T.",
        university: "Stellenbosch University",
        avatar: "/avatars/07.png",
        rating: 4.9,
        verified: true,
      },
      listed: "3 days ago",
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">UniShare</h1>
          <p className="text-lg text-zinc-600 mb-6">
            Connect, share resources, and help fellow students - A peer-to-peer exchange platform for South African students
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <Link href="/unishare/list">
              <Button className="bg-violet-800 hover:bg-violet-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                List a Resource
              </Button>
            </Link>
            <Button variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              Find Resources
            </Button>
          </div>

          <div className="stats grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="stat bg-white p-4 rounded-lg shadow-sm text-center">
              <div className="stat-title text-xs text-zinc-500">Active Listings</div>
              <div className="stat-value text-2xl font-bold">1,256</div>
            </div>
            <div className="stat bg-white p-4 rounded-lg shadow-sm text-center">
              <div className="stat-title text-xs text-zinc-500">Users</div>
              <div className="stat-value text-2xl font-bold">3,842</div>
            </div>
            <div className="stat bg-white p-4 rounded-lg shadow-sm text-center">
              <div className="stat-title text-xs text-zinc-500">Exchanges</div>
              <div className="stat-value text-2xl font-bold">785</div>
            </div>
            <div className="stat bg-white p-4 rounded-lg shadow-sm text-center">
              <div className="stat-title text-xs text-zinc-500">Universities</div>
              <div className="stat-value text-2xl font-bold">26</div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="textbooks" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6 w-full">
            <TabsTrigger value="textbooks">Textbooks</TabsTrigger>
            <TabsTrigger value="mealshare">MealShare</TabsTrigger>
            <TabsTrigger value="ridelink">RideLink</TabsTrigger>
            <TabsTrigger value="skillswap">SkillSwap</TabsTrigger>
          </TabsList>

          <div className="filters bg-zinc-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search" className="text-sm">Search</Label>
                <Input
                  id="search"
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="university" className="text-sm">University</Label>
                <Select value={universityFilter} onValueChange={setUniversityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All universities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All universities</SelectItem>
                    <SelectItem value="uct">University of Cape Town</SelectItem>
                    <SelectItem value="wits">University of the Witwatersrand</SelectItem>
                    <SelectItem value="up">University of Pretoria</SelectItem>
                    <SelectItem value="su">Stellenbosch University</SelectItem>
                    <SelectItem value="ukzn">University of KwaZulu-Natal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location" className="text-sm">Location</Label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All locations</SelectItem>
                    <SelectItem value="cape-town">Cape Town</SelectItem>
                    <SelectItem value="johannesburg">Johannesburg</SelectItem>
                    <SelectItem value="pretoria">Pretoria</SelectItem>
                    <SelectItem value="durban">Durban</SelectItem>
                    <SelectItem value="stellenbosch">Stellenbosch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <TabsContent value="textbooks" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {textbooks.map(book => (
                <Card key={book.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{book.title}</h3>
                          <p className="text-zinc-600 text-sm">by {book.author}</p>
                        </div>
                        <Badge variant={
                          book.type === "Sell" ? "default" :
                          book.type === "Lend" ? "secondary" :
                          "outline"
                        }>
                          {book.type}
                        </Badge>
                      </div>

                      <div className="text-sm space-y-1 mb-4">
                        <p><span className="text-zinc-500">Course:</span> {book.course}</p>
                        <p><span className="text-zinc-500">Condition:</span> {book.condition}</p>
                        <p><span className="text-zinc-500">Price:</span> <span className="font-medium">{book.price}</span></p>
                        <p><span className="text-zinc-500">Location:</span> {book.location}</p>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{book.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <p className="font-medium">{book.user.name}</p>
                            <p className="text-zinc-500 text-xs">{book.user.university}</p>
                          </div>
                        </div>
                        <p className="text-xs text-zinc-500">Listed {book.listed}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-zinc-50 flex justify-between">
                      <Button variant="outline" size="sm">Message</Button>
                      <Button size="sm">Request {book.type === "Sell" ? "to Buy" : book.type === "Lend" ? "to Borrow" : "to Join"}</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mealshare" className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-amber-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                About MealShare
              </h3>
              <p className="text-sm text-amber-700 mt-1">
                MealShare connects students with excess meal plan credits to those who need them. All requests are anonymous and donors won't know who receives their meals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mealShares.map(meal => (
                <Card key={meal.id}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">{meal.title}</h3>
                    <p className="text-zinc-600 text-sm mb-3">{meal.description}</p>

                    <div className="text-sm space-y-1 mb-4">
                      <p><span className="text-zinc-500">Location:</span> {meal.location}</p>
                      {meal.expires && <p><span className="text-zinc-500">Expires:</span> <span className="text-red-600 font-medium">{meal.expires}</span></p>}
                      {meal.date && <p><span className="text-zinc-500">Date:</span> {meal.date}</p>}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {meal.user.name === "Anonymous" ? (
                          <p className="text-sm text-zinc-500">Posted anonymously</p>
                        ) : (
                          <>
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{meal.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                              <p className="font-medium">{meal.user.name}</p>
                              <p className="text-zinc-500 text-xs">{meal.user.university}</p>
                            </div>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500">Listed {meal.listed}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    {meal.user.name === "Anonymous" ? (
                      <Button className="w-full">Request Meal</Button>
                    ) : (
                      <>
                        <Button variant="outline" className="flex-1">Message</Button>
                        <Button className="flex-1">RSVP</Button>
                      </>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ridelink" className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-emerald-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                About RideLink
              </h3>
              <p className="text-sm text-emerald-700 mt-1">
                RideLink helps students share commutes safely. All users are verified with university emails and safety features include live tracking and emergency contacts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rides.map(ride => (
                <Card key={ride.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{ride.title}</h3>
                      {ride.user.verified && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </Badge>
                      )}
                    </div>

                    <div className="text-sm space-y-1 mb-4">
                      <p><span className="text-zinc-500">Route:</span> {ride.route}</p>
                      <p><span className="text-zinc-500">Schedule:</span> {ride.schedule}</p>
                      <p><span className="text-zinc-500">Available Seats:</span> {ride.seats}</p>
                      <p><span className="text-zinc-500">Cost Sharing:</span> {ride.costShare}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{ride.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <p className="font-medium">{ride.user.name}</p>
                          <p className="text-zinc-500 text-xs">{ride.user.university}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-amber-500">★</span>
                        <span className="text-sm font-medium">{ride.user.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button variant="outline" className="flex-1">Message</Button>
                    <Button className="flex-1">Request Seat</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skillswap" className="space-y-4">
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-2">SkillSwap Coming Soon!</h3>
              <p className="text-zinc-600 mb-4">
                Exchange your skills and knowledge with other students - tutoring, design work, tech support, and more.
              </p>
              <Button>Get Notified When Launched</Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="divider border-t my-8"></div>

        <div className="bg-zinc-50 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">How UniShare Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="bg-violet-100 text-violet-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">1. Create Your Profile</h3>
              <p className="text-sm text-zinc-600">Sign up with your university email to get verified status and build your profile.</p>
            </div>

            <div className="text-center">
              <div className="bg-violet-100 text-violet-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">2. List or Find Resources</h3>
              <p className="text-sm text-zinc-600">Share textbooks, meal vouchers, rides, or skills. Search for what you need.</p>
            </div>

            <div className="text-center">
              <div className="bg-violet-100 text-violet-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">3. Connect & Exchange</h3>
              <p className="text-sm text-zinc-600">Message, meet safely, and complete your exchange through our trusted system.</p>
            </div>
          </div>

          <div className="community-principles bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-2">Our Community Principles</h3>
            <ul className="text-sm text-zinc-600 space-y-1">
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Trust:</strong> Verified university profiles and rating system</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Fairness:</strong> Transparent exchange policies and clear guidelines</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Respect:</strong> Respectful communication and honoring commitments</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Safety:</strong> Meetup guidelines and reporting mechanisms</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
