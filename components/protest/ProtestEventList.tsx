import React from 'react';
import ProtestEvent from './ProtestEvent';
import { ProtestEvent as ProtestEventType } from '@prisma/client';

interface ProtestEventListProps {
  protestEvents: (ProtestEventType & {
    organizer: {
      id: string;
      name: string | null;
      image: string | null;
    };
    participants: any[];
  })[];
}

const ProtestEventList: React.FC<ProtestEventListProps> = ({ protestEvents }) => {
  return (
    <div>
      {protestEvents.map((protestEvent) => (
        <ProtestEvent key={protestEvent.id} protestEvent={protestEvent} />
      ))}
    </div>
  );
};

export default ProtestEventList;