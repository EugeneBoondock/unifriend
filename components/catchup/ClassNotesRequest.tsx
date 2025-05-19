import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ClassNotesRequestProps {
  title: string;
  description: string;
  course: string;
  userName?: string | null;
  userImage?: string | null;
}

const ClassNotesRequest: React.FC<ClassNotesRequestProps> = ({
  title,
  description,
  course,
  userName,
  userImage,
}) => {
  const userInitials = userName 
    ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <Card>
      <CardHeader className="flex-row items-center space-x-4">
        <Avatar>
          {userImage ? (
            <AvatarImage src={userImage} alt={userName || 'User'} />
          ) : (
            <AvatarFallback>{userInitials}</AvatarFallback>
          )}
        </Avatar>
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium leading-none">
            {userName || 'Unknown User'}
          </CardTitle>
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