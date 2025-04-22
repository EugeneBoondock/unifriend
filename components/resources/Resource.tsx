import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Resource as ResourceType } from "@prisma/client"; // Assuming you have a Resource type from Prisma

interface ResourceProps {
  resource: ResourceType & {
    author: {
      name: string | null;
      image: string | null;
    };
  };
}

export const Resource: React.FC<ResourceProps> = ({ resource }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={resource.author.image || ""} alt={resource.author.name || "User"} />
            <AvatarFallback>{resource.author.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{resource.title}</CardTitle>
            <CardDescription>{resource.author.name}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{resource.description}</p>
        <div className="mt-4 space-y-2">
          <p className="text-sm">
            <span className="font-medium">Category:</span> {resource.category}
          </p>
          <p className="text-sm">
            <span className="font-medium">University:</span> {resource.university}
          </p>
          <p className="text-sm">
            <span className="font-medium">Course:</span> {resource.course}
          </p>
          {resource.fileUrl && (
            <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 underline">
              View Resource
            </a>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">Created at: {resource.createdAt.toLocaleDateString()}</CardFooter>
    </Card>
  );
};