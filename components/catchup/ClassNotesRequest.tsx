import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ClassNotesRequestProps {
  title: string;
  description: string;
  course: string;
  userName: string;
  userImage?: string;
}

const ClassNotesRequest: React.FC<ClassNotesRequestProps> = ({
  title,
  description,
  course,
  userName,
  userImage,
}) => {
  return (
    <Card>
      <CardHeader className="flex-row items-center space-x-4">
        <Avatar>
          {userImage ? (
            <AvatarImage src={userImage} alt={userName} />
          ) : (
            <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
          )}
        </Avatar>
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium leading-none">{userName}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
      <div className="text-sm text-gray-500">
          {course}
        </div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </CardContent>
    </Card>
  );
};

export default ClassNotesRequest;