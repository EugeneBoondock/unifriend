import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@prisma/client";

interface ResumeProps {
  content: string;
  user: Pick<User, "name" | "image">;
}

const Resume: React.FC<ResumeProps> = ({ content, user }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4">
          <Avatar>
            <AvatarImage src={user.image || ""} />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap">{content}</div>
      </CardContent>
    </Card>
  );
};

export default Resume;