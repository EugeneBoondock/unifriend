import React from 'react';
import Comment from './Comment';
import { Comment as CommentType } from '@prisma/client';

interface CommentListProps {
  comments: (CommentType & { author: { name: string | null; image: string | null; }; })[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  return (
    <div>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;