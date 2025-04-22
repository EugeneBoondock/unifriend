import PostList from '@/components/unicircle/PostList';
import CreatePostForm from '@/components/unicircle/CreatePostForm';

export default async function UniCirclePage() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/posts`);
  const posts = await response.json();

  return (
    <div className="container py-8 md:py-12 pattern-container">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">UniCircle Community</h1>
          <CreatePostForm />
        </div>
        <PostList posts={posts} />
      </div>
    </div>
  );
}
