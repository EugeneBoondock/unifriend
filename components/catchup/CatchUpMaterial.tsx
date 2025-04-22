import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CatchUpMaterialProps {
  title: string;
  description?: string;
  course: string;
  url: string;
  userName: string;
  userImage?: string;
}

const CatchUpMaterial: React.FC<CatchUpMaterialProps> = ({
  title,
  description,
  course,
  url,
  userName,
  userImage,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={userImage || "/placeholder.svg"} alt={userName} />
            <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>By {userName}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Course: {course}</p>
        {description && <p className="text-sm mt-2">{description}</p>}
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 mt-2 block">
          View Material
        </a>
      </CardContent>
    </Card>
  );
};

export default CatchUpMaterial;