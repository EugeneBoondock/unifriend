import { User } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface StudyPlanProps {
  studyPlan: {
    id: string;
    name: string;
    description: string | null;
    course: string;
    startDate: Date;
    endDate: Date;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    user: User
  };
}

const StudyPlan: React.FC<StudyPlanProps> = ({ studyPlan }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={studyPlan.user.image || ""} alt={studyPlan.user.name || "User"} />
            <AvatarFallback>{studyPlan.user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{studyPlan.name}</CardTitle>
            <p className="text-sm text-muted-foreground">Created by: {studyPlan.user.name}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm">
          <strong>Course:</strong> {studyPlan.course}
        </p>
        {studyPlan.description && (
          <p className="text-sm">
            <strong>Description:</strong> {studyPlan.description}
          </p>
        )}
        <p className="text-sm">
          <strong>Start Date:</strong> {format(studyPlan.startDate, "dd/MM/yyyy")}
        </p>
        <p className="text-sm">
          <strong>End Date:</strong> {format(studyPlan.endDate, "dd/MM/yyyy")}
        </p>
      </CardContent>
    </Card>
  );
};

export default StudyPlan;