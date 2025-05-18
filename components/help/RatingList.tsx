import React from 'react';
import { Rating as RatingType } from '@/prisma/client';
import Rating from './Rating';

interface RatingListProps {
  ratings: RatingType[];
}

const RatingList: React.FC<RatingListProps> = ({ ratings }) => {
  return (
    <div>
      {ratings.map((rating) => (
        <Rating key={rating.id} rating={rating} />
      ))}
    </div>
  );
};

export default RatingList;