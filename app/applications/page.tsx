import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ApplicationsPage() {
  const universities = [
    {
      name: "University of Cape Town",
      deadline: "2025-09-30",
      applicationFee: "R100",
      website: "https://www.uct.ac.za/apply",
      requirements: "National Senior Certificate with Bachelor's pass; APS Score of 40+; Subject requirements vary by program",
      notes: "Early applications encouraged for competitive programs"
    },
    {
      name: "University of the Witwatersrand",
      deadline: "2025-09-30",
      applicationFee: "R150",
      website: "https://www.wits.ac.za/applications/",
      requirements: "National Senior Certificate with Bachelor's pass; APS Score of 42+; Specific subject requirements",
      notes: "Medicine applications due earlier (June 30, 2025)"
    },
    {
      name: "University of Pretoria",
      deadline: "2025-08-31",
      applicationFee: "R300",
      website: "https://www.up.ac.za/apply",
      requirements: "National Senior Certificate with Bachelor's pass; APS Score requirements vary by faculty",
      notes: "Some programs have limited spaces and earlier closing dates"
    },
    {
      name: "Stellenbosch University",
      deadline: "2025-06-30",
      applicationFee: "R100",
      website: "https://www.sun.ac.za/apply",
      requirements: "National Senior Certificate with Bachelor's pass; Specific subject requirements and minimum marks",
      notes: "Selection programs (e.g., Medicine, Law) have earlier deadlines"
    },
    {
      name: "University of Johannesburg",
      deadline: "2025-09-30",
      applicationFee: "R200",
      website: "https://www.uj.ac.za/apply",
      requirements: "National Senior Certificate with Bachelor's pass; APS Score of 21+ (program dependent)",
      notes: "Online applications preferred"
    },
    {
      name: "University of KwaZulu-Natal",
      deadline: "2025-09-30",
      applicationFee: "R250",
      website: "https://www.ukzn.ac.za/apply",
      requirements: "National Senior Certificate with Bachelor's pass; Subject requirements vary by program",
      notes: "Some health science programs close earlier"
    },
    {
      name: "University of the Free State",
      deadline: "2025-09-30",
      applicationFee: "R150",
      website: "https://www.ufs.ac.za/apply",
      requirements: "National Senior Certificate with Bachelor's pass; APS Score requirements vary by qualification",
      notes: "Selection courses have additional requirements"
    },
    {
      name: "University of South Africa",
      deadline: "2025-01-24",
      applicationFee: "R150",
      website: "https://www.unisa.ac.za/apply",
      requirements: "National Senior Certificate with Bachelor's pass for degree studies",
      notes: "Distance learning institution with multiple application periods"
    }
  ];

  const applicationSteps = [
    {
      title: "Research Universities and Programs",
      description: "Explore different institutions and programs to find the best fit for your interests, goals, and qualifications.",
      icon: "🔍"
    },
    {
      title: "Check Entry Requirements",
      description: "Review the specific admission requirements for your chosen programs, including APS scores and subject requirements.",
      icon: "📋"
    },
    {
      title: "Prepare Your Documents",
      description: "Gather all required documents: ID copy, academic records, proof of residence, and any program-specific requirements.",
      icon: "📄"
    },
    {
      title: "Complete the Application Form",
      description: "Fill out the application form accurately, either online or through a paper application if available.",
      icon: "✏️"
    },
    {
      title: "Pay the Application Fee",
      description: "Make the required application fee payment and keep proof of payment.",
      icon: "💸"
    },
    {
      title: "Submit Your Application",
      description: "Submit your completed application and supporting documents before the deadline.",
      icon: "📬"
    },
    {
      title: "Track Your Application",
      description: "Monitor your application status through the university's online portal or specified channels.",
      icon: "🔍"
    },
    {
      title: "Prepare for Potential Interviews or Tests",
      description: "Some programs require additional assessments - be prepared to schedule and attend these if required.",
      icon: "📝"
    }
  ];

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4">University Application Guide</h1>
        <p className="text-lg text-zinc-600 max-w-3xl">
          Everything you need to know about applying to South African universities - from deadlines and
          requirements to tips for a successful application.
        </p>
      </div>

      <Tabs defaultValue="deadlines" className="mb-16">
        <TabsList className="mb-8 w-full sm:w-auto">
          <TabsTrigger value="deadlines">Application Deadlines</TabsTrigger>
          <TabsTrigger value="process">Application Process</TabsTrigger>
          <TabsTrigger value="tips">Application Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="deadlines" className="mt-0">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">2025 Application Deadlines</h2>
            <p className="text-zinc-600 mb-4">
              Application deadlines for major South African universities for the 2025 academic year. Always check the official university
              websites for the most up-to-date information and for specific program deadlines which may differ.
            </p>
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>University</TableHead>
                    <TableHead>General Deadline</TableHead>
                    <TableHead>Application Fee</TableHead>
                    <TableHead>Key Requirements</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Website</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {universities.map((uni, index) => {
                    // Calculate if deadline is approaching (within 3 months)
                    const deadline = new Date(uni.deadline);
                    const now = new Date();
                    const threeMonthsFromNow = new Date();
                    threeMonthsFromNow.setMonth(now.getMonth() + 3);
                    const isApproaching = deadline <= threeMonthsFromNow && deadline > now;

                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{uni.name}</TableCell>
                        <TableCell>
                          {new Date(uni.deadline).toLocaleDateString('en-ZA', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                          {isApproaching && (
                            <Badge variant="destructive" className="ml-2">Approaching</Badge>
                          )}
                        </TableCell>
                        <TableCell>{uni.applicationFee}</TableCell>
                        <TableCell className="max-w-xs">{uni.requirements}</TableCell>
                        <TableCell className="max-w-xs text-sm">{uni.notes}</TableCell>
                        <TableCell>
                          <Button variant="link" size="sm" asChild>
                            <Link href={uni.website} target="_blank" rel="noopener noreferrer">
                              Apply
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="process" className="mt-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Application Process</h2>
            <p className="text-zinc-600 mb-6">
              Follow these general steps when applying to South African universities. Remember that each institution may have
              specific requirements or additional steps for particular programs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {applicationSteps.map((step, index) => (
                <Card key={index} className="border-t-4 border-t-violet-500">
                  <CardHeader className="pb-2">
                    <div className="text-3xl mb-2">{step.icon}</div>
                    <CardTitle className="text-lg">{`Step ${index + 1}: ${step.title}`}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-600 text-sm">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-blue-50 p-6 rounded-xl mt-8">
              <h3 className="text-xl font-bold mb-2">Required Documents</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>ID document or passport</li>
                <li>National Senior Certificate or equivalent qualification</li>
                <li>Academic records/transcripts from Grade 11 and 12</li>
                <li>Proof of payment of application fee</li>
                <li>Proof of residence</li>
                <li>Additional program-specific documents (portfolio, essays, etc. if required)</li>
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tips" className="mt-0">
          <div>
            <h2 className="text-2xl font-bold mb-4">Application Tips from Senior Students</h2>
            <p className="text-zinc-600 mb-6">
              Advice collected from students who have successfully navigated the university application process.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Before Applying</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">Research thoroughly</h3>
                    <p className="text-zinc-600 text-sm">
                      "Don't just apply to the most popular universities. Research program content, graduate
                      employment rates, and campus culture to find the best fit for YOU."
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Apply to multiple institutions</h3>
                    <p className="text-zinc-600 text-sm">
                      "Always have backup options. Apply to 3-5 universities with varying competitiveness to
                      ensure you have choices when admission decisions come in."
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Check specific faculty requirements</h3>
                    <p className="text-zinc-600 text-sm">
                      "Beyond the general university requirements, each faculty often has specific subject
                      requirements and minimum marks. Make sure you meet these before applying."
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>During Application</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">Apply early</h3>
                    <p className="text-zinc-600 text-sm">
                      "Many programs fill up before the official deadline. Submit your application as early as
                      possible, especially for competitive programs like Medicine and Law."
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Double-check everything</h3>
                    <p className="text-zinc-600 text-sm">
                      "Small errors can delay your application. Triple-check all personal details, contact
                      information, and document uploads before submitting."
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Keep receipts and reference numbers</h3>
                    <p className="text-zinc-600 text-sm">
                      "Save all proof of payments, application reference numbers, and correspondence with
                      the university. These are essential if any issues arise."
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>After Applying</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">Follow up</h3>
                    <p className="text-zinc-600 text-sm">
                      "Don't assume no news is good news. Check your application status regularly and
                      contact the admissions office if you haven't heard back within their stated timeframe."
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Prepare for NBTs if required</h3>
                    <p className="text-zinc-600 text-sm">
                      "Some universities require National Benchmark Tests. Register early and prepare
                      thoroughly for these assessments as they can impact your admission chances."
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Have financial plans ready</h3>
                    <p className="text-zinc-600 text-sm">
                      "Research funding options like NSFAS, bursaries, and scholarships simultaneously with
                      your applications. Be ready to complete financial aid applications once accepted."
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Program-Specific Advice</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">For Health Sciences</h3>
                    <p className="text-zinc-600 text-sm">
                      "Health science programs like Medicine and Dentistry often require additional tests,
                      interviews, or voluntary work experience. Start preparing these extras a year in advance."
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">For Creative Programs</h3>
                    <p className="text-zinc-600 text-sm">
                      "Art, design, music, and film programs usually require portfolios. Start compiling your
                      best work early and consider getting feedback from professionals before submitting."
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">For Engineering & Science</h3>
                    <p className="text-zinc-600 text-sm">
                      "These programs place heavy emphasis on Mathematics and Physical Science marks. If
                      your marks are borderline, consider including a motivation letter highlighting relevant
                      projects or competitions."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-emerald-50 p-6 rounded-xl mt-4">
              <h3 className="text-xl font-bold mb-2">Need Personalized Help?</h3>
              <p className="mb-4">
                Connect with student mentors who have been through the application process for specific
                universities and programs.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link href="/mentorship?category=applications">Find Application Mentor</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/forum/applications">Join Application Discussions</Link>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-violet-50 p-8 rounded-xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Application Tracker Tool</h2>
            <p className="mb-6 text-zinc-700">
              Keeping track of multiple university applications can be challenging. Use our Application
              Tracker tool to manage deadlines, document requirements, and application statuses all in
              one place.
            </p>
            <Button asChild>
              <Link href="/applications/tracker">
                Use Application Tracker
              </Link>
            </Button>
          </div>
          <div className="w-full md:w-1/3">
            <div className="rounded-lg overflow-hidden border shadow-md bg-white">
              <div className="p-4 bg-violet-100 border-b">
                <h3 className="font-bold">University Applications 2025</h3>
                <p className="text-sm text-zinc-600">Keep track of your applications</p>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm pb-2 border-b">
                    <span>UCT Medicine</span>
                    <Badge>Submitted</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm pb-2 border-b">
                    <span>Wits Engineering</span>
                    <Badge variant="outline">In Progress</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>UJ Computer Science</span>
                    <Badge variant="secondary">Planning</Badge>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm text-zinc-500">
                  + Add new application
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
