import React from 'react';
import { Ad as AdType } from '@/prisma/client';
import Ad from './Ad';

interface AdListProps {
  ads: AdType[];
}

const AdList: React.FC<AdListProps> = ({ ads }) => {
  return (
    <div>
      {ads.map((ad) => (
        <Ad key={ad.id} ad={ad} />
      ))}
    </div>
  );
};

export default AdList;