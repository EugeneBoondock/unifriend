import React from 'react';
import { PracticeTest as PracticeTestType } from '@/prisma/client';
import PracticeTest from './PracticeTest';

interface PracticeTestListProps {
  practiceTests: PracticeTestType[];
}

const PracticeTestList: React.FC<PracticeTestListProps> = ({ practiceTests }) => {
  return (
    <div className="space-y-4">
      {practiceTests.map((practiceTest) => (
        <PracticeTest key={practiceTest.id} practiceTest={practiceTest} />
      ))}
    </div>
  );
};

export default PracticeTestList;