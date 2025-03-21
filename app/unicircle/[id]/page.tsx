"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

// Use a variable declaration with arrow function for Next.js 15 compatibility
const CircleDetails = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const circleId = parseInt(params.id);
  const [activeTab, setActiveTab] = useState("about");
  const [isJoined, setIsJoined] = useState(false);

  // Mock data for demonstration
  const circle = {
    id: circleId,
    name: "Tech Innovators SA",
    category: "Technology",
    members: 128,
    university: "Cross-University",
    description: "A community of tech enthusiasts exploring the latest innovations and startups in South Africa. We organize workshops, hackathons, and networking events to help students build skills and connect with industry professionals.",
    image: "/circles/tech.jpg",
    tags: ["Programming", "AI", "Startups"],
    upcoming: "AWS Cloud Workshop - May 12",
    created: "August 2023",
    admin: {
      name: "Thabiso M.",
      university: "University of Cape Town",
      avatar: "/avatars/01.png",
    },
    events: [
      {
        id: 1,
        title: "AWS Cloud Workshop",
        date: "May 12, 2024",
        time: "14:00 - 16:00",
        location: "Online (Zoom)",
        description: "Learn the basics of AWS cloud services and how to deploy your first application.",
        attendees: 42
      },
      {
        id: 2,
        title: "Tech Startup Pitch Night",
        date: "May 25, 2024",
        time: "18:00 - 20:30",
        location: "Innovation Hub, Pretoria",
        description: "Present your startup idea to fellow students and local entrepreneurs for feedback.",
        attendees: 28
      },
      {
        id: 3,
        title: "Python for Data Science Workshop",
        date: "June 8, 2024",
        time: "10:00 - 15:00",
        location: "UCT Computer Science Lab",
        description: "A hands-on workshop covering Python fundamentals for data analysis and visualization.",
        attendees: 35
      }
    ],
    discussions: [
      {
        id: 1,
        title: "What programming language should I learn first?",
        author: "Sipho K.",
        date: "2 days ago",
        replies: 15,
        views: 87
      },
      {
        id: 2,
        title: "Job opportunities in AI in South Africa",
        author: "Lerato M.",
        date: "1 week ago",
        replies: 23,
        views: 132
      },
      {
        id: 3,
        title: "Starting a tech business as a student",
        author: "David N.",
        date: "3 days ago",
        replies: 8,
        views: 64
      },
      {
        id: 4,
        title: "Best online courses for web development",
        author: "Thandi G.",
        date: "5 days ago",
        replies: 12,
        views: 78
      }
    ],
    resources: [
      {
        id: 1,
        title: "Python Programming Guide",
        type: "PDF",
        size: "2.4 MB",
        added: "Apr 15, 2024",
        downloads: 48
      },
      {
        id: 2,
        title: "Introduction to Web Development",
        type: "Slide Deck",
        size: "5.1 MB",
        added: "Mar 28, 2024",
        downloads: 63
      },
      {
        id: 3,
        title: "Data Structures and Algorithms Cheat Sheet",
        type: "PDF",
        size: "1.2 MB",
        added: "Apr 5, 2024",
        downloads: 89
      }
    ],
    members: [
      {
        id: 1,
        name: "Thabiso M.",
        university: "University of Cape Town",
        role: "Admin",
        avatar: "/avatars/01.png",
        joined: "Aug 2023"
      },
      {
        id: 2,
        name: "Lerato N.",
        university: "University of Johannesburg",
        role: "Moderator",
        avatar: "/avatars/02.png",
        joined: "Sep 2023"
      },
      {
        id: 3,
        name: "David K.",
        university: "University of Pretoria",
        role: "Member",
        avatar: "/avatars/03.png",
        joined: "Nov 2023"
      },
      {
        id: 4,
        name: "Thandi Z.",
        university: "Stellenbosch University",
        role: "Member",
        avatar: "/avatars/04.png",
        joined: "Dec 2023"
      },
      {
        id: 5,
        name: "Sipho J.",
        university: "University of the Witwatersrand",
        role: "Member",
        avatar: "/avatars/05.png",
        joined: "Jan 2024"
      }
    ]
  };

  const toggleJoin = () => {
    setIsJoined(!isJoined);
  };

  if (!circle) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Circle not found</h1>
        <p className="text-zinc-600 mb-6">The circle you're looking for doesn't exist or may have been removed.</p>
        <Button onClick={() => router.push('/unicircle')}>Back to Circles</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Circle Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 text-xl font-bold">
              {circle.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{circle.name}</h1>
              <div className="flex items-center gap-2 text-zinc-600 text-sm mt-1">
                <span>{circle.university}</span>
                <span>•</span>
                <span>{circle.members} members</span>
                <span>•</span>
                <span>Created {circle.created}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={isJoined ? "outline" : "default"}
              onClick={toggleJoin}
              className={isJoined ? "border-red-500 text-red-500 hover:bg-red-50" : ""}
            >
              {isJoined ? "Leave Circle" : "Join Circle"}
            </Button>
            <Button variant="outline">Share</Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-200">{circle.category}</Badge>
          {circle.tags.map(tag => (
            <Badge key={tag} variant="outline" className="bg-zinc-100">
              {tag}
            </Badge>
          ))}
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-zinc-700">{circle.description}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="about" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="w-full max-w-3xl mx-auto">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        {/* About Tab */}
        <TabsContent value="about" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>About this Circle</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-700 mb-6">{circle.description}</p>

                  <h3 className="font-medium text-zinc-800 mb-3">What we do:</h3>
                  <ul className="list-disc pl-6 space-y-2 text-zinc-600 mb-6">
                    <li>Organize workshops and training sessions on various technology topics</li>
                    <li>Host hackathons and coding competitions</li>
                    <li>Connect students with tech industry professionals</li>
                    <li>Share resources for learning programming and tech skills</li>
                    <li>Provide support for tech-related academic projects</li>
                  </ul>

                  <h3 className="font-medium text-zinc-800 mb-3">Who should join:</h3>
                  <ul className="list-disc pl-6 space-y-2 text-zinc-600">
                    <li>Students interested in technology, programming, and innovation</li>
                    <li>Aspiring entrepreneurs and startup founders</li>
                    <li>Those looking to develop technical skills for future careers</li>
                    <li>Students working on tech projects who need support</li>
                    <li>Anyone curious about the tech industry in South Africa</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Circle Admin</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={circle.admin.avatar} alt={circle.admin.name} />
                      <AvatarFallback>{circle.admin.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{circle.admin.name}</p>
                      <p className="text-sm text-zinc-500">{circle.admin.university}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full">Message Admin</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">{circle.events[0].title}</h3>
                      <p className="text-sm text-zinc-500">{circle.events[0].date} • {circle.events[0].time}</p>
                      <p className="text-sm text-zinc-500">{circle.events[0].location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-600">{circle.events[0].description}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">{circle.events[0].attendees} people attending</p>
                    </div>
                    <Button size="sm" className="w-full">RSVP</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="mt-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Upcoming Events</h3>
              <Button variant="outline" size="sm">Add Event</Button>
            </div>

            <div className="space-y-4">
              {circle.events.map(event => (
                <Card key={event.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium mb-1">{event.title}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-600 mb-3">
                          <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>{event.attendees} attendees</span>
                          </div>
                        </div>
                        <p className="text-zinc-600">{event.description}</p>
                      </div>
                      <Button>RSVP</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Discussions Tab */}
        <TabsContent value="discussions" className="mt-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Discussions</h3>
              <div className="flex gap-3">
                <Input placeholder="Search discussions..." className="w-60" />
                <Button>New Discussion</Button>
              </div>
            </div>

            <div className="space-y-2">
              {circle.discussions.map(discussion => (
                <Card key={discussion.id} className="hover:bg-zinc-50 transition-colors">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-lg hover:text-violet-700 hover:underline cursor-pointer">
                          {discussion.title}
                        </h3>
                        <div className="text-xs text-zinc-500 mt-1">
                          Started by {discussion.author} • {discussion.date}
                        </div>
                      </div>
                      <div className="text-sm text-zinc-500 flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          <span>{discussion.replies}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>{discussion.views}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="mt-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Resources</h3>
              <Button>Upload Resource</Button>
            </div>

            <Card>
              <CardContent className="pt-6 pb-2">
                <div className="space-y-4">
                  {circle.resources.map(resource => (
                    <div key={resource.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-zinc-100 flex items-center justify-center text-zinc-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">{resource.title}</p>
                          <div className="text-xs text-zinc-500 flex gap-2">
                            <span>{resource.type}</span>
                            <span>•</span>
                            <span>{resource.size}</span>
                            <span>•</span>
                            <span>Added {resource.added}</span>
                            <span>•</span>
                            <span>{resource.downloads} downloads</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="mt-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Members ({circle.members.length})</h3>
              <Input placeholder="Search members..." className="w-60" />
            </div>

            <Card>
              <CardContent className="pt-6 pb-2">
                <div className="space-y-4">
                  {circle.members.map(member => (
                    <div key={member.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{member.name}</p>
                            {member.role !== "Member" && (
                              <Badge variant="outline" className={
                                member.role === "Admin" ? "bg-violet-100 text-violet-700" : "bg-blue-100 text-blue-700"
                              }>
                                {member.role}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-zinc-500 flex gap-2">
                            <span>{member.university}</span>
                            <span>•</span>
                            <span>Joined {member.joined}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Message</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Export the component separately for Next.js typing
export default CircleDetails;
