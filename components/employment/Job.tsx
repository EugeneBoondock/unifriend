import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface JobProps {
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  category: string;
}

const Job: React.FC<JobProps> = ({ title, description, company, location, salary, category }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{company}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          <strong>Location:</strong> {location}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Salary:</strong> {salary}
        </p>
         <p className="text-sm text-gray-500">
          <strong>Category:</strong> {category}
        </p>
        <p className="mt-4">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Job;