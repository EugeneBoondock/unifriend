import React from "react";
import { InterviewPreparationResource as InterviewPreparationResourceType } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InterviewPreparationResource } from "./InterviewPreparationResource";

interface InterviewPreparationResourceListProps {
  interviewPreparationResources: InterviewPreparationResourceType[];
}

export const InterviewPreparationResourceList: React.FC<
  InterviewPreparationResourceListProps
> = ({ interviewPreparationResources }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {interviewPreparationResources.map((resource) => (
        <InterviewPreparationResource
          key={resource.id}
          resource={resource}
        />
      ))}
    </div>
  );
};