import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  // South African university data
  const universities = [
    { name: "University of Cape Town", location: "Cape Town", color: "from-blue-500 to-blue-700" },
    { name: "University of the Witwatersrand", location: "Johannesburg", color: "from-yellow-500 to-amber-600" },
    { name: "Stellenbosch University", location: "Stellenbosch", color: "from-purple-500 to-purple-700" },
    { name: "University of Pretoria", location: "Pretoria", color: "from-rose-500 to-red-700" },
    { name: "University of KwaZulu-Natal", location: "Durban", color: "from-emerald-500 to-green-700" },
    { name: "University of Johannesburg", location: "Johannesburg", color: "from-orange-500 to-amber-700" },
    { name: "University of the Western Cape", location: "Cape Town", color: "from-cyan-500 to-blue-600" },
    { name: "University of South Africa", location: "Pretoria", color: "from-indigo-500 to-indigo-700" },
    { name: "North-West University", location: "Potchefstroom, Mahikeng, Vanderbijlpark", color: "from-amber-500 to-yellow-700" },
    { name: "Rhodes University", location: "Makhanda", color: "from-violet-500 to-purple-700" },
    { name: "University of the Free State", location: "Bloemfontein", color: "from-red-500 to-rose-700" },
    { name: "Nelson Mandela University", location: "Port Elizabeth", color: "from-blue-400 to-cyan-600" }
  ];

  // Common student challenges to address
  const challenges = [
    {
      title: "NSFAS Funding",
      description: "Struggling with NSFAS applications, appeals, and funding allocations",
      icon: "💰",
      link: "/nsfas"
    },
    {
      title: "Academic Support",
      description: "Need help with assignments, exam prep, and understanding complex concepts",
      icon: "📚",
      link: "/resources/study-tips"
    },
    {
      title: "Mental Health",
      description: "Battling stress, anxiety, and depression due to academic pressures",
      icon: "🧠",
      link: "/resources/mental-health"
    },
    {
      title: "Accommodation",
      description: "Finding affordable and safe housing near campus",
      icon: "🏠",
      link: "/resources/accommodation"
    },
    {
      title: "Career Guidance",
      description: "Uncertainty about career paths and job opportunities after graduation",
      icon: "💼",
      link: "/resources/career"
    },
    {
      title: "Campus Life",
      description: "Adjusting to university life and building a social network",
      icon: "🎭",
      link: "/forum/campus-life"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-violet-600 to-violet-900 py-20 md:py-28">
        <div className="container relative z-10 max-w-6xl mx-auto px-4 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                The Ultimate Home for South African Students
              </h1>
              <p className="mt-4 text-lg text-white/90">
                Unifriend is your all-in-one platform for NSFAS support, academic resources,
                mentorship, and connecting with fellow students across South Africa.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" className="bg-white text-violet-900 hover:bg-white/90">
                  <Link href="/signup">Join Community</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href="/forum">Explore Forum</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br from-violet-400/30 to-violet-800/30 backdrop-blur flex items-center justify-center">
                <div className="text-white text-8xl opacity-20">🎓</div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-violet-900 to-transparent">
                  <h3 className="font-bold text-xl">Overcome Every Student Challenge</h3>
                  <p className="text-white/70 text-sm">From NSFAS to Academic Success</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-violet-800/30 rounded-full blur-2xl"></div>
          <div className="absolute top-1/3 left-0 w-72 h-72 bg-pink-600/20 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Common Challenges Section */}
      <section className="py-16 bg-zinc-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-zinc-900">We Understand Your Challenges</h2>
            <p className="mt-4 text-lg text-zinc-600 max-w-2xl mx-auto">
              Unifriend provides targeted solutions for the most common challenges South African students face
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-violet-100 flex items-center justify-center mb-4">
                      <span className="text-2xl">{challenge.icon}</span>
                    </div>
                    <div>
                      <CardTitle>{challenge.title}</CardTitle>
                      <CardDescription className="mt-1">{challenge.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="text-violet-600 hover:text-violet-700 p-0 ml-16">
                    <Link href={challenge.link}>Find Solutions →</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900">How Unifriend Helps You</h2>
            <p className="mt-4 text-lg text-zinc-600 max-w-2xl mx-auto">
              Our platform provides essential resources and community support for your entire academic journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <CardTitle>NSFAS Hub</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600">
                  Complete NSFAS guidance from application to appeals, with status tracking and direct support from successful applicants.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 p-0">
                  <Link href="/nsfas">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Feature 2 */}
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <CardTitle>Study Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600">
                  Access past papers, study guides, and course materials across various disciplines, with peer-reviewed content.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 p-0">
                  <Link href="/resources">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Feature 3 */}
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <CardTitle>Mentorship Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600">
                  Connect with senior students who've faced the same challenges and can provide personalized academic and career guidance.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 p-0">
                  <Link href="/mentorship">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Feature 4 */}
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <CardTitle>Student Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600">
                  Join South Africa's largest student forum to discuss academics, campus life, and find peer support for any student issue.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="text-pink-600 hover:text-pink-700 p-0">
                  <Link href="/forum">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Universities Section */}
      <section className="py-16 bg-zinc-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-zinc-900">Connect With Students From All Universities</h2>
            <p className="mt-4 text-lg text-zinc-600 max-w-2xl mx-auto">
              Join students from across South Africa in building a supportive academic community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {universities.slice(0, 6).map((university, index) => (
              <div key={index} className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className={`h-32 bg-gradient-to-r ${university.color} relative flex items-center justify-center`}>
                  <div className="text-white text-4xl opacity-30">🏛️</div>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-sm md:text-base">{university.name}</h3>
                    <p className="text-white/80 text-xs">{university.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Universities Collapsible Section */}
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {universities.slice(6, 12).map((university, index) => (
                <div key={index} className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className={`h-32 bg-gradient-to-r ${university.color} relative flex items-center justify-center`}>
                    <div className="text-white text-4xl opacity-30">🏛️</div>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-sm md:text-base">{university.name}</h3>
                      <p className="text-white/80 text-xs">{university.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button variant="outline">
              <Link href="/universities">
                Explore All SA Universities
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Unifriend Is Different */}
      <section className="py-16 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900">Why Students Trust Unifriend</h2>
            <p className="mt-4 text-lg text-zinc-600 max-w-2xl mx-auto">
              Created by South African students, for South African students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-zinc-50 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-violet-600 text-xl font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">NSFAS Appeal Success Rate</h3>
                  <p className="text-zinc-600 mt-2">
                    Students using our NSFAS appeal guidance report an 80% success rate compared to the national average of 40%. Our step-by-step templates and mentor support make the difference.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-50 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-violet-600 text-xl font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Verified Student Resources</h3>
                  <p className="text-zinc-600 mt-2">
                    All study materials are verified by top-performing students and lecturers, ensuring you only access accurate and helpful content for your specific courses.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-50 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-violet-600 text-xl font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">University-Specific Support</h3>
                  <p className="text-zinc-600 mt-2">
                    We understand that each university has unique challenges and processes. Our resources are tailored to your specific institution, not generic advice.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-50 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-violet-600 text-xl font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Mental Health Focus</h3>
                  <p className="text-zinc-600 mt-2">
                    We provide free access to mental wellness resources, peer support groups, and connections to campus mental health services to help you manage academic stress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-violet-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900">What Students Say</h2>
            <p className="mt-4 text-lg text-zinc-600 max-w-2xl mx-auto">
              Hear from students who have found support and community on Unifriend
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-violet-200 overflow-hidden flex items-center justify-center">
                    <span className="text-violet-700 font-bold text-lg">TB</span>
                  </div>
                  <div>
                    <CardTitle className="text-base">Thabo B.</CardTitle>
                    <CardDescription>University of Pretoria, 2nd Year</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600">
                  "After my NSFAS application was rejected, I was devastated. The appeal guidance on Unifriend helped me correct my submission issues and my appeal was approved within 3 weeks!"
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-200 overflow-hidden flex items-center justify-center">
                    <span className="text-emerald-700 font-bold text-lg">LM</span>
                  </div>
                  <div>
                    <CardTitle className="text-base">Lerato M.</CardTitle>
                    <CardDescription>Stellenbosch University, 3rd Year</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600">
                  "The mental health resources and peer support groups helped me overcome severe anxiety during exam periods. I finally feel like I'm not alone in these struggles."
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-200 overflow-hidden flex items-center justify-center">
                    <span className="text-amber-700 font-bold text-lg">SN</span>
                  </div>
                  <div>
                    <CardTitle className="text-base">Sizwe N.</CardTitle>
                    <CardDescription>University of KwaZulu-Natal, 1st Year</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600">
                  "As a first-generation student, university was overwhelming. My Unifriend mentor helped me navigate everything from course selection to finding affordable accommodation near campus."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-violet-900 to-purple-800 text-white">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your University Experience?</h2>
          <p className="mt-4 text-lg text-white/90 max-w-3xl mx-auto">
            Join 50,000+ South African students who are overcoming challenges together and building a brighter academic future.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-violet-900 hover:bg-white/90">
              <Link href="/signup">Create Free Account</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/nsfas">Get NSFAS Help</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
