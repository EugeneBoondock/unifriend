import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForumPage() {
  // This would normally come from a database
  const forumCategories = [
    {
      id: "nsfas",
      title: "NSFAS Discussions",
      description: "Questions and discussions about NSFAS applications, funding, and related topics",
      posts: 243,
      lastActive: "2 hours ago"
    },
    {
      id: "academics",
      title: "Academic Help",
      description: "Study advice, course discussions, and academic resources",
      posts: 152,
      lastActive: "6 hours ago"
    },
    {
      id: "campus-life",
      title: "Campus Life",
      description: "Discussions about accommodations, campus facilities, and student life",
      posts: 127,
      lastActive: "1 day ago"
    },
    {
      id: "applications",
      title: "University Applications",
      description: "Help with applications, requirements, and admission processes",
      posts: 98,
      lastActive: "3 hours ago"
    },
    {
      id: "career",
      title: "Career Guidance",
      description: "Internships, job advice, and career development",
      posts: 76,
      lastActive: "5 hours ago"
    },
    {
      id: "general",
      title: "General Discussions",
      description: "Off-topic discussions and community chat",
      posts: 219,
      lastActive: "1 hour ago"
    }
  ];

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4">Unifriend Forum</h1>
        <p className="text-lg text-zinc-600">
          Connect with other South African university students, ask questions, and share your experiences.
        </p>
        <div className="flex mt-6">
          <Button asChild>
            <Link href="/forum/new">Start a New Discussion</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {forumCategories.map((category) => (
          <Card key={category.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">
                <Link href={`/forum/${category.id}`} className="hover:text-primary transition-colors">
                  {category.title}
                </Link>
              </CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{category.posts} posts</span>
                <span className="text-muted-foreground">Last active: {category.lastActive}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/forum/${category.id}`}>
                  View Discussions
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <div className="bg-violet-50 p-6 rounded-xl max-w-2xl text-center">
          <h2 className="text-xl font-semibold mb-2">Join the Conversation</h2>
          <p className="text-zinc-600 mb-4">
            You need to be signed in to post your own discussions and reply to existing threads.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild>
              <Link href="/signup">Create Account</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
