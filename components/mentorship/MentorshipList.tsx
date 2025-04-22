import React from 'react';
import { Mentorship as MentorshipType } from '@prisma/client';
import { Mentorship } from './Mentorship';
import { Separator } from '@/components/ui/separator';

interface MentorshipListProps {
  mentorships: MentorshipType[];
}

export const MentorshipList: React.FC<MentorshipListProps> = ({ mentorships }) => {
  return (
    <div className="space-y-4">
      {mentorships.map((mentorship) => (
        <div key={mentorship.id}>
          <Mentorship mentorship={mentorship} />
          <Separator />
        </div>
      ))}
    </div>
  );
};