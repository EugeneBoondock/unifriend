import React from 'react';
import { CollaborativeWorkspace as CollaborativeWorkspaceType } from '@prisma/client';
import CollaborativeWorkspace from './CollaborativeWorkspace';
import { Card } from '@/components/ui/card';

interface CollaborativeWorkspaceListProps {
  collaborativeWorkspaces: CollaborativeWorkspaceType[];
}

const CollaborativeWorkspaceList: React.FC<CollaborativeWorkspaceListProps> = ({
  collaborativeWorkspaces,
}) => {
  return (
    <div className="grid gap-4">
      {collaborativeWorkspaces.map((workspace) => (
        <Card key={workspace.id} className="p-4">
          <CollaborativeWorkspace collaborativeWorkspace={workspace} />
        </Card>
      ))}
    </div>
  );
};

export default CollaborativeWorkspaceList;