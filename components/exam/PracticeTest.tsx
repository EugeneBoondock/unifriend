import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PracticeTest as PracticeTestType } from '@prisma/client';
interface PracticeTestProps {
  practiceTest: PracticeTestType & {
    user: {
      name: string | null;
      image: string | null;
    }
  };
}

const PracticeTest: React.FC<PracticeTestProps> = ({ practiceTest }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar>
          <AvatarImage src={practiceTest.user.image || ""} alt={practiceTest.user.name || ""} />
          <AvatarFallback>{practiceTest.user.name?.charAt(0) || "PT"}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle>{practiceTest.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{practiceTest.user.name}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <CardDescription>
          <p><b>Description:</b> {practiceTest.description || "No description provided."}</p>
          <p><b>Course:</b> {practiceTest.course}</p>
          <p><b>Duration:</b> {practiceTest.duration || "Not specified"} minutes</p>
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default PracticeTest;