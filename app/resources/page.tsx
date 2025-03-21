import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function ResourcesPage() {
  // Categories of resources
  const resourceCategories = [
    {
      id: "study-tips",
      title: "Study Tips & Academic Support",
      description: "Effective study techniques, exam preparation, and academic skills development",
      icon: "📚",
      color: "bg-blue-100 text-blue-600",
      link: "/resources/study-tips"
    },
    {
      id: "mental-health",
      title: "Mental Health & Wellness",
      description: "Resources for managing stress, anxiety, depression and maintaining well-being",
      icon: "🧠",
      color: "bg-green-100 text-green-600",
      link: "/resources/mental-health"
    },
    {
      id: "scholarships",
      title: "Scholarships & Bursaries",
      description: "Find funding opportunities beyond NSFAS to support your education",
      icon: "💰",
      color: "bg-purple-100 text-purple-600",
      link: "/resources/scholarships"
    },
    {
      id: "career",
      title: "Career Development",
      description: "Career planning, CV building, interview skills, and job opportunities",
      icon: "💼",
      color: "bg-amber-100 text-amber-600",
      link: "/resources/career"
    },
    {
      id: "accommodation",
      title: "Accommodation Guide",
      description: "Finding safe and affordable housing near your campus",
      icon: "🏠",
      color: "bg-rose-100 text-rose-600",
      link: "/resources/accommodation"
    },
    {
      id: "tech-tools",
      title: "Tech Tools for Students",
      description: "Digital tools, student discounts, and resources for online learning",
      icon: "💻",
      color: "bg-cyan-100 text-cyan-600",
      link: "/resources/tech-tools"
    }
  ];

  // Featured resources
  const featuredResources = [
    {
      title: "NSFAS Appeal Guide 2025",
      category: "Funding",
      description: "Comprehensive step-by-step guide to successfully appeal NSFAS rejections with templates and examples",
      downloads: 2547,
      link: "/resources/nsfas-appeal-guide-2025",
      isNew: true
    },
    {
      title: "Exam Anxiety Management Toolkit",
      category: "Mental Health",
      description: "Practical techniques to manage exam stress and anxiety, created by campus counsellors",
      downloads: 1832,
      link: "/resources/exam-anxiety-toolkit",
      isNew: false
    },
    {
      title: "Budget Calculator for Students",
      category: "Financial",
      description: "Excel spreadsheet to help manage your student allowance, track expenses, and plan your finances",
      downloads: 3421,
      link: "/resources/student-budget-calculator",
      isNew: false
    }
  ];

  // University-specific resources
  const universities = [
    { name: "University of Cape Town", abbr: "UCT", resources: 342 },
    { name: "University of the Witwatersrand", abbr: "Wits", resources: 286 },
    { name: "University of Pretoria", abbr: "UP", resources: 274 },
    { name: "Stellenbosch University", abbr: "SU", resources: 231 },
    { name: "University of Johannesburg", abbr: "UJ", resources: 218 },
    { name: "University of KwaZulu-Natal", abbr: "UKZN", resources: 205 },
    { name: "University of the Western Cape", abbr: "UWC", resources: 187 },
    { name: "Rhodes University", abbr: "RU", resources: 165 },
    { name: "University of the Free State", abbr: "UFS", resources: 153 },
    { name: "University of South Africa", abbr: "UNISA", resources: 412 }
  ];

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-violet-600 border-violet-200 bg-violet-50 hover:bg-violet-100">
            Verified Resources
          </Badge>
          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 hover:bg-green-100">
            Peer Reviewed
          </Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Student Resources</h1>
        <p className="text-lg text-zinc-600 max-w-3xl">
          Access high-quality, verified resources to help you succeed in your studies, manage your finances,
          and navigate university life in South Africa.
        </p>
      </div>

      {/* Featured Resources */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Featured Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredResources.map((resource, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2">
                  <Badge>{resource.category}</Badge>
                  {resource.isNew && (
                    <Badge className="bg-green-600">New</Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-zinc-600 mb-4">{resource.description}</p>
                <p className="text-xs text-zinc-500">{resource.downloads} downloads</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={resource.link}>Download Resource</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Resource Categories */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Browse Resources by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resourceCategories.map((category, index) => (
            <Link href={category.link} key={index} className="block">
              <Card className="border-none shadow-sm hover:shadow-md transition-shadow h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${category.color}`}>
                      <span className="text-2xl">{category.icon}</span>
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-600">{category.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    Explore Resources →
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* University-Specific Resources */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Find Resources for Your University</h2>
        <p className="text-zinc-600 mb-6">
          We have course-specific materials, past papers, and guides tailored to your institution.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {universities.map((uni, index) => (
            <Link key={index} href={`/resources/university/${uni.abbr.toLowerCase()}`} className="block">
              <div className="bg-white border rounded-lg p-4 text-center hover:border-violet-300 hover:shadow-sm transition-all">
                <h3 className="font-bold text-sm mb-1">{uni.abbr}</h3>
                <p className="text-xs text-zinc-500">{uni.resources} resources</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline" asChild>
            <Link href="/resources/universities">View All Universities</Link>
          </Button>
        </div>
      </section>

      {/* Mental Health Resources Focus */}
      <section className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-xl mb-16">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold mb-4">Mental Health Support</h2>
            <p className="text-zinc-700 mb-4">
              University can be stressful. We've partnered with mental health professionals to provide resources
              that help you maintain your wellbeing throughout your academic journey.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 text-sm">✓</span>
                </div>
                <span className="text-zinc-700">Free confidential online counseling sessions</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 text-sm">✓</span>
                </div>
                <span className="text-zinc-700">Stress management and anxiety reduction techniques</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 text-sm">✓</span>
                </div>
                <span className="text-zinc-700">Connect with trained peer supporters at your university</span>
              </div>
            </div>
            <Button asChild>
              <Link href="/resources/mental-health">
                Access Mental Health Resources
              </Link>
            </Button>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="w-40 h-40 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
              <span className="text-6xl">🧠</span>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Resources */}
      <section className="bg-white p-8 rounded-xl border shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold mb-4">Contribute Your Knowledge</h2>
            <p className="text-zinc-700 mb-6">
              Share your study notes, summaries, or guides to help fellow students. Earn badges and recognition
              for your contributions to the South African student community.
            </p>
            <Button asChild>
              <Link href="/resources/upload">
                Upload Your Resources
              </Link>
            </Button>
          </div>
          <div className="md:w-1/3 bg-violet-50 p-6 rounded-lg">
            <h3 className="font-bold mb-3">Top Contributors</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-violet-200 rounded-full flex items-center justify-center">
                  <span className="font-bold text-violet-600">SN</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Sipho N.</p>
                  <p className="text-xs text-zinc-500">43 resources shared</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                  <span className="font-bold text-amber-600">TM</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Thandi M.</p>
                  <p className="text-xs text-zinc-500">36 resources shared</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center">
                  <span className="font-bold text-emerald-600">LK</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Lesego K.</p>
                  <p className="text-xs text-zinc-500">29 resources shared</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Center */}
      <section className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Need Help Finding Resources?</h2>
        <p className="text-zinc-700 mb-8 max-w-2xl mx-auto">
          Can't find what you're looking for? Our team can help you locate the specific resources you need
          for your courses or university.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/resources/request">
              Request Specific Resources
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/mentorship">
              Connect with a Mentor
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
