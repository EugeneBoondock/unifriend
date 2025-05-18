import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LectureRecording as LectureRecordingType } from '@prisma/client';

interface LectureRecordingProps {
  lectureRecording: LectureRecordingType & { user: { name: string | null; image: string | null } };
}

const LectureRecording: React.FC<LectureRecordingProps> = ({ lectureRecording }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar>
          <AvatarImage src={lectureRecording.user.image || ''} alt={lectureRecording.user.name || 'User'} />
          <AvatarFallback>{lectureRecording.user.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{lectureRecording.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{lectureRecording.user.name}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm">
          <span className="font-medium">Description:</span> {lectureRecording.description}
        </p>
        <p className="text-sm">
          <span className="font-medium">Course:</span> {lectureRecording.course}
        </p>
        <p className="text-sm">
          <span className="font-medium">URL:</span> <a href={lectureRecording.url} target="_blank" rel="noopener noreferrer" className="underline">{lectureRecording.url}</a>
        </p>
      </CardContent>
    </Card>
  );
};

export default LectureRecording;