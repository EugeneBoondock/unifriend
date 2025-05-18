import React from "react";
import { Employer as EmployerType } from "@prisma/client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Employer } from "./Employer";

interface EmployerListProps {
  employers: EmployerType[];
}

export const EmployerList: React.FC<EmployerListProps> = ({
  employers,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {employers.map((employer) => (
        <Employer key={employer.id} employer={employer} />
      ))}
    </div>
  );
};