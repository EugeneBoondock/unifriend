import React from 'react';
import { StudySession as StudySessionType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate, formatTime } from '@/lib/utils';

interface StudySessionProps {
  studySession: StudySessionType & { organizer: { name: string | null; image: string | null } };
}

const StudySession: React.FC<StudySessionProps> = ({ studySession }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar>
          <AvatarImage src={studySession.organizer.image || ''} alt={studySession.organizer.name || 'Study Session Organizer'} />
          <AvatarFallback>{studySession.organizer.name?.charAt(0) || 'SS'}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
            <CardTitle className='capitalize'>{studySession.organizer.name}</CardTitle>
            <p className="text-sm text-muted-foreground">Organized a Study Session</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <h3 className="text-lg font-semibold">{studySession.name}</h3>
        <p className="text-sm text-muted-foreground">{studySession.description}</p>
        <div className="text-sm">
          <p>
            <span className="font-medium">Course:</span> {studySession.course}
          </p>
          <p>
            <span className="font-medium">Location:</span> {studySession.location || 'Not specified'}
          </p>
          <p>
            <span className="font-medium">Date:</span> {formatDate(studySession.date)}
          </p>
          <p>
            <span className="font-medium">Time:</span> {formatTime(studySession.date)}
          </p>
          <p>
            <span className="font-medium">Duration:</span> {studySession.duration || 'Not specified'} minutes
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudySession;