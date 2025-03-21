import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EventsPage() {
  // Current date to check if events are upcoming or past
  const currentDate = new Date();

  // Sample events data
  const events = [
    {
      id: "1",
      title: "UCT Career Fair 2025",
      date: new Date("2025-05-15T10:00:00"),
      endDate: new Date("2025-05-15T16:00:00"),
      location: "University of Cape Town, Sports Centre",
      description: "Connect with over 50 employers from various industries. Bring your CV and dress professionally for on-the-spot interviews.",
      organizer: "UCT Careers Service",
      category: "career",
      image: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      isFeatured: true
    },
    {
      id: "2",
      title: "NSFAS Application Workshop",
      date: new Date("2025-03-22T14:00:00"),
      endDate: new Date("2025-03-22T16:00:00"),
      location: "Online (Zoom)",
      description: "Step-by-step guidance on completing your NSFAS application for the 2026 academic year. Learn about required documents and common mistakes to avoid.",
      organizer: "Unifriend Student Support",
      category: "workshop",
      image: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      isFeatured: true
    },
    {
      id: "3",
      title: "Wits Engineering Open Day",
      date: new Date("2025-04-05T09:00:00"),
      endDate: new Date("2025-04-05T15:00:00"),
      location: "University of the Witwatersrand, Engineering Building",
      description: "Explore the facilities, meet professors, and learn about different engineering disciplines at Wits University. Perfect for prospective students.",
      organizer: "Wits Faculty of Engineering",
      category: "open-day",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: "4",
      title: "Student Entrepreneurship Summit",
      date: new Date("2025-06-10T08:30:00"),
      endDate: new Date("2025-06-10T16:30:00"),
      location: "University of Johannesburg, Business School",
      description: "Full-day summit featuring successful student entrepreneurs, workshops on starting your business, and networking opportunities with investors.",
      organizer: "UJ Business School",
      category: "conference",
      image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80"
    },
    {
      id: "5",
      title: "Study Abroad Information Session",
      date: new Date("2025-05-28T13:00:00"),
      endDate: new Date("2025-05-28T15:00:00"),
      location: "Stellenbosch University, International Office",
      description: "Learn about exchange programs, scholarships for international study, and hear from students who have studied abroad.",
      organizer: "Stellenbosch International Office",
      category: "info-session",
      image: "https://images.unsplash.com/photo-1527891751199-7225231a68dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: "6",
      title: "Mental Health Awareness Week",
      date: new Date("2025-04-15T00:00:00"),
      endDate: new Date("2025-04-19T23:59:59"),
      location: "Various university campuses",
      description: "A week of workshops, support groups, and activities focused on student mental health. Learn stress management techniques and connect with support services.",
      organizer: "South African Student Mental Health Coalition",
      category: "health",
      image: "https://images.unsplash.com/photo-1573497019707-1c04de26e58c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: "7",
      title: "Hackathon: Tech Solutions for Education",
      date: new Date("2025-07-12T09:00:00"),
      endDate: new Date("2025-07-13T17:00:00"),
      location: "University of Pretoria, Computer Science Building",
      description: "48-hour hackathon to develop tech solutions that address educational challenges in South Africa. Open to all skill levels. Great prizes for winning teams!",
      organizer: "UP Computer Science Department",
      category: "tech",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: "8",
      title: "Inter-University Sports Tournament",
      date: new Date("2025-09-05T08:00:00"),
      endDate: new Date("2025-09-07T18:00:00"),
      location: "University of KwaZulu-Natal, Sports Complex",
      description: "Annual sports tournament featuring teams from universities across South Africa. Events include soccer, netball, rugby, athletics, and swimming.",
      organizer: "University Sports South Africa",
      category: "sports",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  // Function to format date
  const formatEventDate = (startDate: Date, endDate: Date) => {
    const isSameDay = startDate.toDateString() === endDate.toDateString();

    if (isSameDay) {
      return `${startDate.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })} • ${startDate.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `${startDate.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long' })} - ${endDate.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    }
  };

  // Filter events by date
  const upcomingEvents = events.filter(event => event.date > currentDate);
  const featuredEvents = events.filter(event => event.isFeatured && event.date > currentDate);

  // Get categories for filtering
  const categories = [...new Set(events.map(event => event.category))];

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4">University Events</h1>
        <p className="text-lg text-zinc-600 max-w-3xl">
          Discover workshops, career fairs, talks, and social events happening at universities across South Africa.
          Stay connected and make the most of your student experience.
        </p>
      </div>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Featured Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredEvents.map(event => (
              <Card key={event.id} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-violet-600 hover:bg-violet-700 text-white">Featured</Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <Badge variant="outline" className="capitalize">{event.category.replace('-', ' ')}</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatEventDate(event.date, event.endDate)}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-zinc-700">{event.location}</span>
                  </div>
                  <p className="text-sm text-zinc-600 line-clamp-3">{event.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-xs text-zinc-500">Organized by: {event.organizer}</p>
                  <Button size="sm">View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Events */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
            </Button>
            <Button variant="ghost" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.map(event => (
            <Card key={event.id} className="overflow-hidden">
              <div className="relative h-40">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <Badge variant="outline" className="capitalize text-xs">{event.category.replace('-', ' ')}</Badge>
                </div>
                <CardDescription className="flex items-center gap-1 text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatEventDate(event.date, event.endDate)}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-start gap-1 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs text-zinc-700">{event.location}</span>
                </div>
                <p className="text-xs text-zinc-600 line-clamp-2">{event.description}</p>
              </CardContent>
              <CardFooter className="pt-2">
                <Button size="sm" className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button variant="outline">Load More Events</Button>
        </div>
      </div>

      {/* Create Event Section */}
      <div className="mt-20 bg-violet-50 p-8 rounded-xl">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Hosting an Event?</h2>
            <p className="text-zinc-700 mb-6">
              If you're organizing an academic event, workshop, or student activity, you can promote it on Unifriend
              to reach students across South Africa. Submit your event for review and increase your attendance!
            </p>
            <Button>
              <Link href="/events/create">
                Submit Your Event
              </Link>
            </Button>
          </div>
          <div className="w-full md:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold mb-4">Event Submission Guidelines</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>Events must be relevant to university students</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>Include clear date, time, and location details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>Provide a complete description of the event</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>High-quality event image recommended</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Integration */}
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Never Miss an Event</h2>
        <p className="text-zinc-700 mb-8 max-w-2xl mx-auto">
          Sync university events with your calendar so you never miss important workshops, career fairs, and other
          opportunities. Get notifications and reminders for events you're interested in.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Google Calendar
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Apple Calendar
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download ICS
          </Button>
        </div>
      </div>
    </div>
  );
}
