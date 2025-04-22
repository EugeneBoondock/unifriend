import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mentorship as MentorshipType } from "@prisma/client";

interface MentorshipProps {
  mentorship: MentorshipType & {
    mentor: {
      name: string | null;
      image: string | null;
    };
  };
}

const Mentorship: React.FC<MentorshipProps> = ({ mentorship }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar>
          <AvatarImage src={mentorship.mentor.image || ""} />
          <AvatarFallback>
            {mentorship.mentor.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle>{mentorship.mentor.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="font-medium">
          Subject: {mentorship.subject}
        </div>
        <div className="text-sm text-muted-foreground">
          Description: {mentorship.description}
        </div>
        <div className="text-sm text-muted-foreground">
          Status: {mentorship.status}
        </div>
      </CardContent>
    </Card>
  );
};

export default Mentorship;