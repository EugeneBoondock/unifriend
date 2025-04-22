import React from 'react';
import Post from './Post';
import { Post as PostType } from '@/lib/types';

interface PostListProps {
  posts: PostType[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostList;