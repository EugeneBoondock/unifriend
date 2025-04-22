import React from 'react';
import { StudyPlan as StudyPlanType } from '@/prisma/client';
import StudyPlan from './StudyPlan';

interface StudyPlanListProps {
  studyPlans: StudyPlanType[];
}

const StudyPlanList: React.FC<StudyPlanListProps> = ({ studyPlans }) => {
  return (
    <div className="space-y-4">
      {studyPlans.map((studyPlan) => (
        <StudyPlan key={studyPlan.id} studyPlan={studyPlan} />
      ))}
    </div>
  );
};

export default StudyPlanList;