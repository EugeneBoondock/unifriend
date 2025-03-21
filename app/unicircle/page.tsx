import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UniCirclePage() {
  return (
    <div className="container py-8 md:py-12 pattern-container">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">UniCircle Community</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with students who share your interests, join study groups, and build your university network.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <Card className="pattern-card">
            <CardHeader>
              <CardTitle>Study Groups</CardTitle>
              <CardDescription>
                Join or create subject-specific study groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Connect with other students taking the same courses. Share notes, practice together, and improve your academic performance.</p>
              <Button className="w-full">Browse Study Groups</Button>
            </CardContent>
          </Card>

          <Card className="pattern-card">
            <CardHeader>
              <CardTitle>Interest Circles</CardTitle>
              <CardDescription>
                Find students who share your hobbies and interests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">From photography to debate clubs, gaming to hiking - discover communities based on shared passions.</p>
              <Button className="w-full">Explore Interests</Button>
            </CardContent>
          </Card>

          <Card className="pattern-card">
            <CardHeader>
              <CardTitle>Campus Events</CardTitle>
              <CardDescription>
                Never miss important events on your campus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Stay updated on workshops, seminars, social gatherings and academic events at your university.</p>
              <Button className="w-full">View Calendar</Button>
            </CardContent>
          </Card>

          <Card className="pattern-card">
            <CardHeader>
              <CardTitle>Mentorship Connections</CardTitle>
              <CardDescription>
                Connect with senior students for guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Get advice on courses, career paths, and university life from experienced students who've been in your shoes.</p>
              <Button className="w-full">Find a Mentor</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 text-center">
          <Card className="pattern-card p-6 max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Ready to join UniCircle?</CardTitle>
              <CardDescription>
                Create your profile to personalize your experience and start connecting with other students.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                <Button size="lg" asChild>
                  <Link href="/signup">Create Account</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/signin">Sign In</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
