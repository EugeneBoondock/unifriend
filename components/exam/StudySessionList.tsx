import React from 'react';
import { StudySession as StudySessionType } from '@/lib/types';
import StudySession from './StudySession';

interface StudySessionListProps {
  studySessions: StudySessionType[];
}

const StudySessionList: React.FC<StudySessionListProps> = ({ studySessions }) => {
  return (
    <div>
      {studySessions.map((studySession) => (
        <StudySession key={studySession.id} studySession={studySession} />
      ))}
    </div>
  );
};

export default StudySessionList;