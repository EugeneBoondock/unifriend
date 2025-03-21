import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MentorshipPage() {
  // Mock data for mentors
  const mentors = [
    {
      id: "1",
      name: "Thabo Ndlovu",
      university: "University of Cape Town",
      year: 3,
      program: "Computer Science",
      specialties: ["Programming", "Internships", "NSFAS"],
      bio: "I'm passionate about helping first-years navigate their academic journey. As someone who came from a rural area and struggled initially, I want to make the transition easier for others.",
      rating: 4.9,
      reviews: 23,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    {
      id: "2",
      name: "Ntombi Khumalo",
      university: "University of the Witwatersrand",
      year: 4,
      program: "Medicine",
      specialties: ["Med School Applications", "Academic Support", "Work-Life Balance"],
      bio: "Medical school is challenging but rewarding. I help prospective and current medical students navigate the demanding academic environment while maintaining well-being.",
      rating: 4.8,
      reviews: 17,
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    {
      id: "3",
      name: "Samuel Osei",
      university: "University of Johannesburg",
      year: 3,
      program: "Engineering",
      specialties: ["Engineering Courses", "Internships", "Scholarships"],
      bio: "Engineering is about problem-solving. I help students tackle academic challenges and find opportunities in the engineering field.",
      rating: 4.7,
      reviews: 14,
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    {
      id: "4",
      name: "Lerato Molefe",
      university: "Stellenbosch University",
      year: 5,
      program: "Business Administration",
      specialties: ["Business Studies", "Entrepreneurship", "Campus Life"],
      bio: "As a senior business student, I've learned the ins and outs of networking, internships, and academic excellence. Let me help you fast-track your success.",
      rating: 4.9,
      reviews: 31,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    {
      id: "5",
      name: "Zinhle Nkosi",
      university: "University of KwaZulu-Natal",
      year: 4,
      program: "Law",
      specialties: ["Law School", "Moot Court", "NSFAS"],
      bio: "Law school can be intimidating. I'm here to help with everything from understanding complex legal concepts to preparing for moot court competitions.",
      rating: 4.6,
      reviews: 19,
      image: "https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=778&q=80"
    },
    {
      id: "6",
      name: "David Mokwena",
      university: "University of Pretoria",
      year: 3,
      program: "Education",
      specialties: ["Teaching Practice", "Education Theory", "Campus Life"],
      bio: "Future educators need guidance too! I share insights about teaching practicals, coursework, and building a strong foundation for your teaching career.",
      rating: 4.8,
      reviews: 12,
      image: "https://images.unsplash.com/photo-1504257365157-1496a50d48f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    }
  ];

  // Mock data for categories
  const mentorshipCategories = [
    {
      name: "Academic Support",
      description: "Get help with coursework, study techniques, and exam preparation",
      icon: "📚"
    },
    {
      name: "University Applications",
      description: "Guidance on applying to universities and program selection",
      icon: "🎓"
    },
    {
      name: "NSFAS & Funding",
      description: "Assistance with financial aid applications and management",
      icon: "💰"
    },
    {
      name: "Campus Life",
      description: "Tips on adapting to university life, accommodation, and social aspects",
      icon: "🏛️"
    },
    {
      name: "Career Planning",
      description: "Advice on internships, job applications, and career paths",
      icon: "💼"
    },
    {
      name: "International Students",
      description: "Support for international students navigating South African universities",
      icon: "🌍"
    }
  ];

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4">Student Mentorship Program</h1>
        <p className="text-lg text-zinc-600 max-w-3xl">
          Connect with experienced student mentors who can guide you through your academic journey,
          share valuable insights, and help you navigate university life.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="w-full md:w-2/3">
          <div className="bg-gradient-to-r from-violet-100 to-violet-50 p-8 rounded-xl mb-8">
            <h2 className="text-2xl font-bold mb-4">How Mentorship Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-violet-200 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">1</span>
                </div>
                <h3 className="font-semibold mb-2">Find a Mentor</h3>
                <p className="text-zinc-700 text-sm">
                  Browse profiles and find a senior student who matches your needs and interests
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-violet-200 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">2</span>
                </div>
                <h3 className="font-semibold mb-2">Connect</h3>
                <p className="text-zinc-700 text-sm">
                  Send a mentorship request explaining what you need help with
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-violet-200 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">3</span>
                </div>
                <h3 className="font-semibold mb-2">Get Guidance</h3>
                <p className="text-zinc-700 text-sm">
                  Schedule virtual or in-person sessions and receive personalized advice
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Browse Mentors</h2>
            <div className="flex flex-wrap gap-4 mb-8">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="University" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Universities</SelectLabel>
                    <SelectItem value="all">All Universities</SelectItem>
                    <SelectItem value="uct">University of Cape Town</SelectItem>
                    <SelectItem value="wits">University of the Witwatersrand</SelectItem>
                    <SelectItem value="up">University of Pretoria</SelectItem>
                    <SelectItem value="uj">University of Johannesburg</SelectItem>
                    <SelectItem value="ukzn">University of KwaZulu-Natal</SelectItem>
                    <SelectItem value="su">Stellenbosch University</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Field of Study" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fields</SelectLabel>
                    <SelectItem value="all">All Fields</SelectItem>
                    <SelectItem value="comp-sci">Computer Science</SelectItem>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="law">Law</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="humanities">Humanities</SelectItem>
                    <SelectItem value="science">Sciences</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Specialties</SelectLabel>
                    <SelectItem value="all">All Specialties</SelectItem>
                    <SelectItem value="academic">Academic Support</SelectItem>
                    <SelectItem value="nsfas">NSFAS & Funding</SelectItem>
                    <SelectItem value="applications">Applications</SelectItem>
                    <SelectItem value="career">Career Planning</SelectItem>
                    <SelectItem value="campus">Campus Life</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentors.map((mentor) => (
                <Card key={mentor.id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-1/3 h-32 sm:h-auto relative">
                      <Image
                        src={mentor.image}
                        alt={mentor.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{mentor.name}</CardTitle>
                            <CardDescription>{mentor.university}</CardDescription>
                          </div>
                          <div className="flex items-center">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span className="text-sm font-medium">{mentor.rating}</span>
                            <span className="text-xs text-zinc-500 ml-1">({mentor.reviews})</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-zinc-600 mb-2">
                          Year {mentor.year} • {mentor.program}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {mentor.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary">{specialty}</Badge>
                          ))}
                        </div>
                        <p className="text-xs text-zinc-600 line-clamp-2">{mentor.bio}</p>
                      </CardContent>
                      <CardFooter>
                        <Button size="sm" className="w-full">View Profile & Connect</Button>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Button variant="outline">View More Mentors</Button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3">
          <div className="bg-zinc-50 rounded-xl p-6 mb-8 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Browse by Category</h2>
            <div className="space-y-4">
              {mentorshipCategories.map((category, index) => (
                <Link
                  key={index}
                  href={`/mentorship?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block"
                >
                  <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{category.icon}</div>
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-xs text-zinc-600 mt-1">{category.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Become a Mentor</CardTitle>
              <CardDescription>
                Share your knowledge and experience with other students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-600 mb-4">
                If you're in your 3rd year or above, you can help other students by becoming a mentor.
                Improve your leadership skills while making a difference in someone's academic journey.
              </p>
              <ul className="text-sm space-y-2 mb-4">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Flexible time commitment</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Earn community service hours</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Add to your CV/resume</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Make a positive impact</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Apply to be a Mentor</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="bg-blue-50 p-8 rounded-xl mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">What Students Say About Mentorship</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-500 text-lg">★★★★★</span>
              </div>
              <p className="text-sm italic text-zinc-600 mb-6">
                "Having a mentor who went through the same program helped me avoid so many mistakes.
                My grades improved and I gained confidence in my abilities."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-medium text-blue-600">SM</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Sipho M.</p>
                  <p className="text-xs text-zinc-500">1st Year, University of Johannesburg</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-500 text-lg">★★★★★</span>
              </div>
              <p className="text-sm italic text-zinc-600 mb-6">
                "My mentor helped me successfully apply for NSFAS and guided me through the
                academic challenges of first year. This program is absolutely invaluable!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="font-medium text-pink-600">NM</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Nomsa M.</p>
                  <p className="text-xs text-zinc-500">2nd Year, University of Cape Town</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-500 text-lg">★★★★★</span>
              </div>
              <p className="text-sm italic text-zinc-600 mb-6">
                "As an international student, I was completely lost until I connected with a mentor.
                They helped me understand the South African university system and thrive academically."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="font-medium text-green-600">KO</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Kwame O.</p>
                  <p className="text-xs text-zinc-500">3rd Year, University of Pretoria</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-violet-600 text-white p-8 rounded-xl text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Connect with a mentor who can help you navigate your academic journey and achieve your goals.
          Sign up to find the perfect mentor match for your needs.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="bg-white text-violet-600 hover:bg-white/90">
            <Link href="/signup">
              Sign Up to Connect with Mentors
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
            <Link href="/signin">
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
