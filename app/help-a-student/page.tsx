import React from 'react';
import HelpRequestList from '@/components/help/HelpRequestList';
import VolunteerList from '@/components/help/VolunteerList';
import CreateHelpRequestForm from '@/components/help/CreateHelpRequestForm';
import RegisterVolunteerForm from '@/components/help/RegisterVolunteerForm';

const HelpAStudentPage: React.FC = async () => {
  const helpRequestsResponse = await fetch('/api/help-requests');
  const helpRequests = await helpRequestsResponse.json();

  const volunteersResponse = await fetch('/api/volunteers');
  const volunteers = await volunteersResponse.json();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Help A Student</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
          <h2 className="text-xl font-semibold mb-2">Help Requests</h2>
          <HelpRequestList helpRequests={helpRequests} />
          <CreateHelpRequestForm />
        </div>
        <div className="col-span-1">
          <h2 className="text-xl font-semibold mb-2">Volunteers</h2>
          <VolunteerList volunteers={volunteers} />
          <RegisterVolunteerForm />
        </div>
      </div>
    </div>
  );
};

export default HelpAStudentPage;