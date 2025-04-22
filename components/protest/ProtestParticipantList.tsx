import React from 'react';
import ProtestParticipant from './ProtestParticipant';
import { ProtestParticipant as ProtestParticipantType } from '@prisma/client';

interface ProtestParticipantListProps {
  participants: ProtestParticipantType[] & {user: {name: string | null, image: string | null}}[];
}

const ProtestParticipantList: React.FC<ProtestParticipantListProps> = ({ participants }) => {
  return (
    <div className="space-y-2">
      {participants.map((participant) => (
        <ProtestParticipant key={participant.id} participant={participant} />
      ))}
    </div>
  );
};

export default ProtestParticipantList;