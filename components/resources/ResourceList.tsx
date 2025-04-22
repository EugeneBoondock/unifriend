import React from 'react';
import { Resource as ResourceType } from '@prisma/client';
import Resource from './Resource';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface ResourceListProps {
  resources: ResourceType[];
}

const ResourceList: React.FC<ResourceListProps> = ({ resources }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resources</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
          {resources.map((resource) => (
              <Resource key={resource.id} resource={resource} />
          ))}
      </CardContent>
    </Card>
  );
};

export default ResourceList;