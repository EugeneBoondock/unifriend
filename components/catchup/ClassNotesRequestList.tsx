import React from 'react';
import { ClassNotesRequestType } from '@/types';
import ClassNotesRequest from './ClassNotesRequest';

interface ClassNotesRequestListProps {
  classNotesRequests: ClassNotesRequestType[];
}

const ClassNotesRequestList: React.FC<ClassNotesRequestListProps> = ({ classNotesRequests }) => {
  if (!classNotesRequests || classNotesRequests.length === 0) {
    return <div className="text-gray-500 text-center py-4">No class notes requests found.</div>;
  }

  return (
    <div className="space-y-4">
      {classNotesRequests.map((request) => (
        <div key={request.id} className="border rounded-lg overflow-hidden">
          <ClassNotesRequest 
            title={request.title || 'Untitled Request'}
            description={request.description || 'No description provided.'}
            course={request.course || 'No course specified'}
            userName={request.user?.name}
            userImage={request.user?.image}
          />
        </div>
      ))}
    </div>
  );
};

export default ClassNotesRequestList;