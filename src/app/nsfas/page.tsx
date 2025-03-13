import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function NSFASPage() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4">NSFAS Support Center</h1>
        <p className="text-lg text-zinc-600 max-w-3xl">
          Get help with your National Student Financial Aid Scheme (NSFAS) application,
          track your funding status, and connect with students who can share advice.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader>
            <CardTitle>Application Process</CardTitle>
            <CardDescription>
              Guidance for first-time applicants and returning students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-zinc-700">
              <li>Step-by-step application guides</li>
              <li>Required documentation checklist</li>
              <li>Important deadlines and dates</li>
              <li>Common reasons for application rejection</li>
              <li>Tips for a successful application</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="/nsfas/application-process">
                View Application Guide
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle>Track Your Funding</CardTitle>
            <CardDescription>
              Understanding your funding status and next steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-zinc-700">
              <li>How to check your application status</li>
              <li>Understanding different status messages</li>
              <li>What to do if your application is pending</li>
              <li>Appeals process for rejected applications</li>
              <li>Contacting NSFAS support</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="/nsfas/track-funding">
                Funding Status Guide
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">NSFAS FAQ</h2>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-medium text-lg mb-2">Who qualifies for NSFAS funding?</h3>
            <p className="text-zinc-700">
              South African citizens and permanent residents who come from disadvantaged backgrounds and
              demonstrate financial need can qualify for NSFAS funding. The exact criteria may change
              year to year, but generally includes household income assessment.
            </p>
          </div>

          <div className="border-b pb-4">
            <h3 className="font-medium text-lg mb-2">What does NSFAS funding cover?</h3>
            <p className="text-zinc-700">
              NSFAS funding typically covers tuition fees, accommodation (either university residence or
              private accommodation within set allowances), books and learning materials, meals, and in
              some cases a personal care allowance.
            </p>
          </div>

          <div className="border-b pb-4">
            <h3 className="font-medium text-lg mb-2">Do I need to repay NSFAS funding?</h3>
            <p className="text-zinc-700">
              Since 2018, NSFAS funding is provided in the form of bursaries (grants) rather than loans
              for most qualifying students, which means you don't have to repay the money. However, there
              may be specific conditions attached.
            </p>
          </div>

          <div className="border-b pb-4">
            <h3 className="font-medium text-lg mb-2">When do NSFAS applications open?</h3>
            <p className="text-zinc-700">
              NSFAS applications typically open around September/October for the following academic year
              and close in January, but these dates can vary. It's always best to apply as early as possible.
            </p>
          </div>

          <div className="pb-4">
            <h3 className="font-medium text-lg mb-2">What documents do I need for my NSFAS application?</h3>
            <p className="text-zinc-700">
              You'll need your South African ID, your parents' or guardians' IDs, proof of income for your
              household, and if applicable, proof of social grant receipt. If you're a dependent of someone
              with a disability, proof of disability may also be required.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-violet-50 p-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Talk to NSFAS Mentors</h2>
        <p className="mb-6 text-zinc-700">
          Connect with senior students who have successfully navigated the NSFAS process. They can provide
          guidance based on their own experiences and help answer your specific questions.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link href="/mentorship?category=nsfas">
              Find NSFAS Mentor
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/forum/nsfas">
              Join NSFAS Discussions
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
