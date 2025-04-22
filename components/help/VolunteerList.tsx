import React from 'react';
import { Volunteer as VolunteerType } from '@prisma/client';
import Volunteer from './Volunteer';
import { cn } from '@/lib/utils';

interface VolunteerListProps {
  volunteers: VolunteerType[];
  className?: string;
}

const VolunteerList: React.FC<VolunteerListProps> = ({ volunteers, className }) => {
  return (
    <div className={cn("space-y-4", className)}>
      {volunteers.map((volunteer) => (
        <Volunteer key={volunteer.id} volunteer={volunteer} />
      ))}
    </div>
  );
};

export default VolunteerList;