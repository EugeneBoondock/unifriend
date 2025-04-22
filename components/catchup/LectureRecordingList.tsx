import React from 'react';
import { LectureRecording as LectureRecordingType } from '@/prisma/generated/client';
import LectureRecording from './LectureRecording';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LectureRecordingListProps {
  lectureRecordings: LectureRecordingType[];
}

const LectureRecordingList: React.FC<LectureRecordingListProps> = ({ lectureRecordings }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lecture Recordings</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
      {lectureRecordings.map((lectureRecording) => (
        <LectureRecording key={lectureRecording.id} lectureRecording={lectureRecording} />
      ))}
      </CardContent>
    </Card>
  );
};

export default LectureRecordingList;