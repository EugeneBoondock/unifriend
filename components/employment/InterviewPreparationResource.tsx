import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface InterviewPreparationResourceProps {
  title: string;
  description?: string;
  fileUrl?: string;
  category?: string;
}

const InterviewPreparationResource: React.FC<InterviewPreparationResourceProps> = ({
  title,
  description,
  fileUrl,
  category,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {category && <CardDescription>{category}</CardDescription>}
      </CardHeader>
      <Separator />
      <CardContent>
        {description && <p>{description}</p>}
        {fileUrl && (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            View Resource
          </a>
        )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default InterviewPreparationResource;