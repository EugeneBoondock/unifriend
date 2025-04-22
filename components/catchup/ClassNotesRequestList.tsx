import React from 'react';
import { ClassNotesRequest as ClassNotesRequestType } from '@/prisma/client';
import { ClassNotesRequest } from './ClassNotesRequest';

interface ClassNotesRequestListProps {
  classNotesRequests: ClassNotesRequestType[];
}

export const ClassNotesRequestList: React.FC<ClassNotesRequestListProps> = ({ classNotesRequests }) => {
  return (
    <div>
      {classNotesRequests.map((request) => (
        <ClassNotesRequest key={request.id} classNotesRequest={request} />
      ))}
    </div>
  );
};