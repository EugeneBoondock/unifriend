import React from "react";
import { Job as JobType } from "@prisma/client";

import { Job } from "@/components/employment/Job";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface JobListProps {
  jobs: JobType[];
}

export const JobList: React.FC<JobListProps> = ({ jobs }) => {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Jobs</CardTitle>
            <CardDescription>List of available jobs</CardDescription>
        </CardHeader>
      <CardContent className="grid gap-4">
        {jobs.map((job) => (
          <Job key={job.id} {...job} />
        ))}
      </CardContent>
      <CardFooter>
        
      </CardFooter>
    </Card>
  );
};