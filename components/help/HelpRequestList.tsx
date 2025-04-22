import React from 'react';
import { HelpRequest as HelpRequestType } from '@/types';
import HelpRequest from './HelpRequest';
import { Card, CardContent } from '@/components/ui/card';

interface HelpRequestListProps {
  helpRequests: HelpRequestType[];
}

const HelpRequestList: React.FC<HelpRequestListProps> = ({ helpRequests }) => {
  return (
    <Card>
        <CardContent className="p-0">
            <div className="space-y-4">
                {helpRequests.map((helpRequest) => (
                    <HelpRequest key={helpRequest.id} helpRequest={helpRequest} />
                ))}
            </div>
        </CardContent>
    </Card>
  );
};

export default HelpRequestList;