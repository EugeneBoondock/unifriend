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
      icon: "🎓",
      link: "/unicircle"
    }
  ];

  // Platform features
  const features = [
    {
      title: "NSFAS Hub",
      icon: "🎯",
      description: "Complete NSFAS guidance from application to appeals, with status tracking and direct support from successful applicants."
    },
    {
      title: "Study Resources",
      icon: "📖",
      description: "Access past papers, study guides, and course materials across various disciplines, with peer-reviewed content."
    },
    {
      title: "Mentorship Network",
      icon: "👥",
      description: "Connect with senior students who've faced the same challenges and can provide personalized academic and career guidance."
    },
    {
      title: "Student Community",
      icon: "🌐",
      description: "Join South Africa's largest student forum to discuss academics, campus life, and find peer support for any student issue."
    }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "After my NSFAS application was rejected, I was devastated. The appeal guidance on Unifriend helped me correct my submission issues and my appeal was approved within 3 weeks!",
      name: "Thabo B.",
      university: "University of Pretoria, 2nd Year",
      initials: "TB"
    },
    {
      quote: "The mental health resources and peer support groups helped me overcome severe anxiety during exam periods. I finally feel like I'm not alone in these struggles.",
      name: "Lerato M.",
      university: "Stellenbosch University, 3rd Year",
      initials: "LM"
    },
    {
      quote: "As a first-generation student, university was overwhelming. My Unifriend mentor helped me navigate everything from course selection to finding affordable accommodation near campus.",
      name: "Sizwe N.",
      university: "University of KwaZulu-Natal, 1st Year",
      initials: "SN"
    }
  ];

  return (
    <main className="flex flex-col">
      {/* Hero section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-indigo-700 dark:from-[#513c64] dark:to-[#262626] text-white">
        <div className="container grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter">
              The Ultimate Home for South African Students
            </h1>
            <p className="text-lg">
              Unifriend is your all-in-one platform for NSFAS support, academic resources, mentorship, and connecting with fellow students across South Africa.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="bg-white text-purple-700 hover:bg-gray-100 dark:bg-white/90 dark:hover:bg-white">
                <Link href="/join-community">Join Community</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                <Link href="/forum">Explore Forum</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="aspect-[9/16] bg-white/5 rounded-lg flex items-center justify-center">
                <span className="text-5xl">📱</span>
              </div>
              <p className="mt-4 text-center text-sm text-white/80">
                Overcome Every Student Challenge
              </p>
              <p className="text-center text-xs text-white/60">
                From NSFAS to Academic Success
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Student challenges section */}
      <section className="py-20 bg-background dark:bg-[#262626] pattern-container">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">We Understand Your Challenges</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Unifriend provides targeted solutions for the most common challenges South African students face
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge, i) => (
              <Link href={challenge.link} key={i} className="group">
                <Card className="h-full transition-all pattern-card hover:shadow-md group-hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" role="img" aria-label={challenge.title}>
                        {challenge.icon}
                      </span>
                      <CardTitle>{challenge.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{challenge.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="text-primary">Find Solutions</Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How Unifriend helps section */}
      <section className="py-20 bg-background dark:bg-[#262626] pattern-container border-t border-border dark:border-purple-900/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Unifriend Helps You</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides essential resources and community support for your entire academic journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="pattern-card">
                <CardHeader>
                  <span className="text-3xl mb-2" role="img" aria-label={feature.title}>
                    {feature.icon}
                  </span>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="text-primary">Learn More</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Universities section */}
      <section className="py-20 bg-background dark:bg-[#262626] pattern-container border-t border-border dark:border-purple-900/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Connect With Students From All Universities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join students from across South Africa in building a supportive academic community
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {universities.map((uni, i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <div className={`bg-gradient-to-r ${uni.color} p-4 text-white h-full flex flex-col justify-between transition-transform hover:scale-[1.02]`}>
                  <h3 className="font-bold">{uni.name}</h3>
                  <p className="text-sm text-white/80">{uni.location}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button variant="outline" className="dark:border-purple-900/40 dark:text-white dark:hover:bg-purple-900/20">
              Explore All 26 Universities
            </Button>
          </div>
        </div>
      </section>

      {/* Trust factors section */}
      <section className="py-16 bg-slate-50 dark:bg-[#1e1e1e]">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Students Trust Unifriend</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Created by South African students, for South African students
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="relative pl-8">
              <div className="absolute top-0 left-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 flex items-center justify-center text-sm font-bold">1</div>
              <h3 className="font-bold mb-2">NSFAS Appeal Success Rate</h3>
              <p className="text-sm text-muted-foreground">
                Students using our NSFAS appeal guidance report an 80% success rate compared to the national average of 40%. Our step-by-step templates and mentor support make the difference.
              </p>
            </div>
            <div className="relative pl-8">
              <div className="absolute top-0 left-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 flex items-center justify-center text-sm font-bold">2</div>
              <h3 className="font-bold mb-2">Verified Student Resources</h3>
              <p className="text-sm text-muted-foreground">
                All study materials are verified by top-performing students and lecturers, ensuring you only access accurate and helpful content for your specific courses.
              </p>
            </div>
            <div className="relative pl-8">
              <div className="absolute top-0 left-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 flex items-center justify-center text-sm font-bold">3</div>
              <h3 className="font-bold mb-2">University-Specific Support</h3>
              <p className="text-sm text-muted-foreground">
                We understand that each university has unique challenges and processes. Our resources are tailored to your specific institution, not generic advice.
              </p>
            </div>
            <div className="relative pl-8">
              <div className="absolute top-0 left-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 flex items-center justify-center text-sm font-bold">4</div>
              <h3 className="font-bold mb-2">Mental Health Focus</h3>
              <p className="text-sm text-muted-foreground">
                We provide free access to mental wellness resources, peer support groups, and connections to campus mental health services to help you manage academic stress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-20 bg-background dark:bg-[#262626] pattern-container border-t border-border dark:border-purple-900/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Students Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from students who have found support and community on Unifriend
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="pattern-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-brand-purple/20 text-purple-800 dark:text-purple-300 flex items-center justify-center font-medium">
                      {testimonial.initials}
                    </div>
                    <div>
                      <CardTitle className="text-base">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.university}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 bg-purple-600 dark:bg-brand-purple text-white">
        <div className="container text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Your University Experience?</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Join 50,000+ South African students who are overcoming challenges together and building a brighter academic future.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100 dark:bg-white/90 dark:hover:bg-white">
              Create Free Account
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Get NSFAS Help
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
