import React from 'react';
import { PeerReview as PeerReviewType } from '@/prisma/client';
import PeerReview from './PeerReview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PeerReviewListProps {
  peerReviews: PeerReviewType[];
}

const PeerReviewList: React.FC<PeerReviewListProps> = ({ peerReviews }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Peer Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {peerReviews.map((peerReview) => (
          <PeerReview key={peerReview.id} peerReview={peerReview} />
        ))}
      </CardContent>
    </Card>
  );
};

export default PeerReviewList;