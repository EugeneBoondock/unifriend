import React from 'react';
import { Card } from '@/components/ui/card';
import { ReadingList as ReadingListType } from '@prisma/client';
import ReadingList from './ReadingList';

interface ReadingListListProps {
  readingLists: ReadingListType[];
}

const ReadingListList: React.FC<ReadingListListProps> = ({ readingLists }) => {
  return (
    <div className="grid gap-4">
      {readingLists.map((readingList) => (
        <Card key={readingList.id} className="p-4">
          <ReadingList readingList={readingList} />
        </Card>
      ))}
    </div>
  );
};

export default ReadingListList;