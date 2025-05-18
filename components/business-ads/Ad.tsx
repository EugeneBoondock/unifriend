// components/business-ads/Ad.tsx
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Ads } from '@prisma/client';
import { Badge } from '@/components/ui/badge';

interface AdProps extends Ads {
  targetedCourses?: string[];
  targetedUniversities?: string[];
  targetedYearOfStudies?: number[];
}

const Ad: React.FC<AdProps> = ({
  title,
  description,
  imageUrl,
  targetedCourses,
  targetedUniversities,
  targetedYearOfStudies,
}) => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {imageUrl && <img src={imageUrl} alt={title} />}
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {targetedCourses?.map((course) => (
          <Badge key={course} variant="secondary">
            {course}
          </Badge>
        ))}
        {targetedUniversities?.map((university) => (
          <Badge key={university} variant="secondary">
            {university}
          </Badge>
        ))}
        {targetedYearOfStudies?.map((year) => (
          <Badge key={year} variant="secondary">
            Year {year}
          </Badge>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
};

export default Ad;