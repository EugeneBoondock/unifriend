import React from "react";
import { AssignmentTemplate as AssignmentTemplateType } from "@prisma/client";
import AssignmentTemplate from "./AssignmentTemplate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AssignmentTemplateListProps {
  assignmentTemplates: AssignmentTemplateType[];
}

const AssignmentTemplateList: React.FC<AssignmentTemplateListProps> = ({
  assignmentTemplates,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment Templates</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {assignmentTemplates.map((template) => (
          <AssignmentTemplate key={template.id} {...template} />
        ))}
      </CardContent>
    </Card>
  );
};

export default AssignmentTemplateList;