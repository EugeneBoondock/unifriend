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

export default function UniCircle() {
  const [activeTab, setActiveTab] = useState("discover");
  const [searchTerm, setSearchTerm] = useState("");
  const [interestFilter, setInterestFilter] = useState("");
  const [universityFilter, setUniversityFilter] = useState("");

  // Mock data for demonstration
  const circles = [
    {
      id: 1,
      name: "Tech Innovators SA",
      category: "Technology",
      members: 128,
      university: "Cross-University",
      description: "A community of tech enthusiasts exploring the latest innovations and startups in South Africa.",
      image: "/circles/tech.jpg",
      tags: ["Programming", "AI", "Startups"],
      upcoming: "AWS Cloud Workshop - May 12"
    },
    {
      id: 2,
      name: "Future Doctors Circle",
      category: "Health Sciences",
      members: 94,
      university: "University of Cape Town",
      description: "Medical students supporting each other through studies, internships, and residency placements.",
      image: "/circles/medical.jpg",
      tags: ["Medicine", "Healthcare", "Research"],
      upcoming: "Hospital Shadowing Program - April 30"
    },
    {
      id: 3,
      name: "Environmental Action Network",
      category: "Environment",
      members: 76,
      university: "Stellenbosch University",
      description: "Students passionate about environmental conservation and climate action initiatives.",
      image: "/circles/environment.jpg",
      tags: ["Climate Action", "Conservation", "Sustainability"],
      upcoming: "Beach Cleanup - May 8"
    },
    {
      id: 4,
      name: "Financial Freedom Society",
      category: "Finance",
      members: 112,
      university: "University of the Witwatersrand",
      description: "Learning financial literacy, investment strategies, and building wealth as students.",
      image: "/circles/finance.jpg",
      tags: ["Investing", "Financial Literacy", "Budgeting"],
      upcoming: "Stock Market Workshop - May 5"
    },
    {
      id: 5,
      name: "Creative Writers Guild",
      category: "Arts & Culture",
      members: 63,
      university: "University of Johannesburg",
      description: "A supportive community for student writers, poets, and storytellers to share and improve their craft.",
      image: "/circles/writing.jpg",
      tags: ["Writing", "Poetry", "Storytelling"],
      upcoming: "Poetry Slam Night - April 28"
    },
    {
      id: 6,
      name: "Future Entrepreneurs Hub",
      category: "Business",
      members: 87,
      university: "Cross-University",
      description: "Students building businesses and developing entrepreneurial skills while at university.",
      image: "/circles/entrepreneurs.jpg",
      tags: ["Entrepreneurship", "Business", "Innovation"],
      upcoming: "Pitch Competition - May 15"
    }
  ];

  const myCircles = [
    circles[0],
    circles[3],
    circles[4]
  ];

  const filteredCircles = circles.filter(circle => {
    const matchesSearch = circle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      circle.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesInterest = interestFilter ?
      circle.category === interestFilter ||
      circle.tags.some(tag => tag.toLowerCase().includes(interestFilter.toLowerCase())) :
      true;

    const matchesUniversity = universityFilter ?
      circle.university === universityFilter :
      true;

    return matchesSearch && matchesInterest && matchesUniversity;
  });

  const interests = [
    { value: "Technology", label: "Technology" },
    { value: "Health Sciences", label: "Health Sciences" },
    { value: "Business", label: "Business" },
    { value: "Arts & Culture", label: "Arts & Culture" },
    { value: "Environment", label: "Environment" },
    { value: "Finance", label: "Finance" },
    { value: "Sports", label: "Sports" },
    { value: "Social Impact", label: "Social Impact" }
  ];

  const universities = [
    { value: "University of Cape Town", label: "University of Cape Town" },
    { value: "University of the Witwatersrand", label: "University of the Witwatersrand" },
    { value: "Stellenbosch University", label: "Stellenbosch University" },
    { value: "University of Johannesburg", label: "University of Johannesburg" },
    { value: "Cross-University", label: "Cross-University" }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">UniCircle</h1>
        <p className="text-zinc-600 max-w-2xl mx-auto">
          Join interest-based communities to connect with other students who share your passions,
          collaborate on projects, and attend events together.
        </p>
      </div>

      <Tabs defaultValue="discover" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="my-circles">My Circles</TabsTrigger>
          <TabsTrigger value="create">Create Circle</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="mt-6">
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-3 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search circles by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="w-full md:w-64">
                  <Select onValueChange={setInterestFilter} value={interestFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by interest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All interests</SelectItem>
                      {interests.map(interest => (
                        <SelectItem key={interest.value} value={interest.value}>
                          {interest.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-64">
                  <Select onValueChange={setUniversityFilter} value={universityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by university" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All universities</SelectItem>
                      {universities.map(uni => (
                        <SelectItem key={uni.value} value={uni.value}>
                          {uni.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {filteredCircles.length === 0 ? (
              <div className="col-span-1 md:col-span-3 text-center py-12">
                <p className="text-zinc-500">No circles match your search criteria.</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setSearchTerm("");
                  setInterestFilter("");
                  setUniversityFilter("");
                }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              filteredCircles.map(circle => (
                <Card key={circle.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-36 bg-zinc-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                      {circle.category}
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{circle.name}</CardTitle>
                      <Badge>{circle.members} members</Badge>
                    </div>
                    <CardDescription>{circle.university}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-zinc-600 mb-4">{circle.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {circle.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="bg-zinc-100">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-zinc-500 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Upcoming: {circle.upcoming}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button size="sm">Join Circle</Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="my-circles" className="mt-6">
          {myCircles.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">You haven't joined any circles yet</h3>
              <p className="text-zinc-600 mb-4">Join interest-based communities to connect with students who share your passions.</p>
              <Button onClick={() => setActiveTab("discover")}>Discover Circles</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {myCircles.map(circle => (
                <Card key={circle.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-36 bg-zinc-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                      {circle.category}
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{circle.name}</CardTitle>
                      <Badge>{circle.members} members</Badge>
                    </div>
                    <CardDescription>{circle.university}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-zinc-600 mb-4">{circle.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {circle.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="bg-zinc-100">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-zinc-500 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Upcoming: {circle.upcoming}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button variant="destructive" size="sm">Leave Circle</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Create a New Circle</CardTitle>
              <CardDescription>
                Start your own interest-based community to connect with like-minded students.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="circleName">Circle Name</Label>
                  <Input id="circleName" placeholder="Give your circle a catchy name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {interests.map(interest => (
                        <SelectItem key={interest.value} value={interest.value}>
                          {interest.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="university">University Affiliation</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select university access" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cross-University">Open to All Universities</SelectItem>
                      {universities.filter(uni => uni.value !== "Cross-University").map(uni => (
                        <SelectItem key={uni.value} value={uni.value}>
                          {uni.label} Only
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="What is your circle about? What activities will members participate in?"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <Label>Tags (Select up to 5)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Programming", "AI", "Startups", "Medicine", "Healthcare", "Research", "Climate Action",
                      "Conservation", "Sustainability", "Investing", "Financial Literacy", "Budgeting",
                      "Writing", "Poetry", "Storytelling", "Entrepreneurship", "Business", "Innovation"].map((tag) => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox id={`tag-${tag}`} />
                        <Label htmlFor={`tag-${tag}`} className="text-sm font-normal">
                          {tag}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Create Circle</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
