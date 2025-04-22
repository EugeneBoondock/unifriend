import { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface CollaborativeWorkspaceProps {
  collaborativeWorkspace: {
    id: string;
    name: string;
    description: string | null;
    course: string;
    owner: User;
  };
}

export const CollaborativeWorkspace: React.FC<CollaborativeWorkspaceProps> = ({
  collaborativeWorkspace,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{collaborativeWorkspace.name}</CardTitle>
        <CardDescription>{collaborativeWorkspace.course}</CardDescription>
      </CardHeader>
      <CardContent>
        {collaborativeWorkspace.description && <p>{collaborativeWorkspace.description}</p>}
      </CardContent>
      <CardFooter className="flex items-center">
            <Avatar>
              <AvatarImage src={collaborativeWorkspace.owner.image || ""} alt={`Avatar of ${collaborativeWorkspace.owner.name}`} />
              <AvatarFallback>{collaborativeWorkspace.owner.name?.slice(0,2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <p className="ml-2">{collaborativeWorkspace.owner.name}</p>
      </CardFooter>
    </Card>
  );
};