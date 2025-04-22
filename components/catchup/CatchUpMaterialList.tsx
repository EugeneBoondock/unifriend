import React from 'react';
import { CatchUpMaterial as CatchUpMaterialType } from '@/prisma/generated/client';
import CatchUpMaterial from './CatchUpMaterial';

interface CatchUpMaterialListProps {
  catchUpMaterials: CatchUpMaterialType[];
}

const CatchUpMaterialList: React.FC<CatchUpMaterialListProps> = ({ catchUpMaterials }) => {
  return (
    <div>
      {catchUpMaterials.map((catchUpMaterial) => (
        <CatchUpMaterial key={catchUpMaterial.id} catchUpMaterial={catchUpMaterial} />
      ))}
    </div>
  );
};

export default CatchUpMaterialList;