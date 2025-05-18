import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AssignmentTemplate as AssignmentTemplateType } from "@prisma/client";

interface AssignmentTemplateProps {
  assignmentTemplate: AssignmentTemplateType & {
    author: {
      name: string | null;
      image: string | null;
    };
  };
}

const AssignmentTemplate: React.FC<AssignmentTemplateProps> = ({ assignmentTemplate }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={assignmentTemplate.author.image || ""} alt={assignmentTemplate.author.name || "Author"} />
            <AvatarFallback>{assignmentTemplate.author.name?.charAt(0) || "A"}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{assignmentTemplate.name}</CardTitle>
            <CardDescription>by {assignmentTemplate.author.name || "Unknown Author"}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-gray-500">Course: {assignmentTemplate.course}</p>
        <p className="text-sm">{assignmentTemplate.description}</p>
        <a href={assignmentTemplate.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          Download Template
        </a>
      </CardContent>
      <CardFooter>
      </CardFooter>
    </Card>
  );
};

export default AssignmentTemplate;