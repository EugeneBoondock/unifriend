import React from "react";
import { Resume as ResumeType } from "@/types";
import { Resume } from "./Resume";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResumeListProps {
  resumes: ResumeType[];
}

export const ResumeList: React.FC<ResumeListProps> = ({ resumes }) => {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Resumes</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid gap-4">
            {resumes.map((resume) => (
                <Resume key={resume.id} resume={resume} />
            ))}
            </div>
        </CardContent>
    </Card>
  );
};