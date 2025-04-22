import { CreateMentorshipForm } from "@/components/mentorship/CreateMentorshipForm";
import { MentorshipList } from "@/components/mentorship/MentorshipList";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/auth";

export default async function MentorshipPage() {
  const session = await auth();
  const user = session?.user;

  const mentorships = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/mentorships`,
    {
      headers: {
        Authorization: `Bearer ${session?.token?.accessToken}`,
      },
    }
  ).then((res) => res.json());

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Mentorship</h1>
      {user && (
        <div className="mb-8">
          <CreateMentorshipForm />
        </div>
      )}
      <Separator className="mb-8" />
      <MentorshipList mentorships={mentorships} />
    </div>
  );
}
