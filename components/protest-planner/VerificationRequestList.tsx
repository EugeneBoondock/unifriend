import React from 'react';
import { VerificationRequest as VerificationRequestType } from '@prisma/client';
import VerificationRequest from './VerificationRequest';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VerificationRequestListProps {
  verificationRequests: VerificationRequestType[];
}

const VerificationRequestList: React.FC<VerificationRequestListProps> = ({
  verificationRequests,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification Requests</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {verificationRequests.map((verificationRequest) => (
          <VerificationRequest
            key={verificationRequest.id}
            verificationRequest={verificationRequest}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default VerificationRequestList;