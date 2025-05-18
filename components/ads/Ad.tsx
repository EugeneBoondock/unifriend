import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Ad as AdType } from "@prisma/client";
import Image from "next/image";

interface AdProps {
  ad: AdType;
}

export const Ad: React.FC<AdProps> = ({ ad }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{ad.title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
          {ad.imageUrl && (
            <Image
                src={ad.imageUrl}
                alt={ad.title}
                width={400}
                height={200}
                className="w-full h-auto object-cover"
              />
          )}
          <CardDescription>
            {ad.description}
          </CardDescription>
          <p>University: {ad.university}</p>
          <p>Course: {ad.course}</p>
      </CardContent>
      <CardFooter>

      </CardFooter>
    </Card>
  );
};