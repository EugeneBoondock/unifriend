import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EmployerProps {
  name: string;
  description: string;
  verified: boolean;
}

const Employer: React.FC<EmployerProps> = ({ name, description, verified }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
        {verified && <p>Verified</p>}
      </CardContent>
    </Card>
  );
};

export default Employer;