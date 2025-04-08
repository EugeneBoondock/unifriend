import { ForumPost, Comment, ApiResponse } from '@/lib/types';
import supabase from '@/lib/supabaseClient';

// Forum service functions
export const getForumPosts = async (
  limit: number = 50,
  category?: string,
  searchQuery?: string
): Promise<ApiResponse<ForumPost[]>> => {
  try {
    let query = supabase
      .from('posts')
      .select(`
        *,
        profiles:author_id (name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (category && category.toLowerCase() !== 'all') {
      query = query.eq('category', category);
    }
    
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching forum posts:', error);
      return { data: null, error: error.message };
    }
    
    // Transform the data to match our ForumPost type
    const posts: ForumPost[] = data.map(item => ({
      id: item.id,
      title: item.title,
      content: item.content,
      category: item.category,
      author: item.profiles?.name || 'Anonymous',
      authorId: item.author_id,
      replies: item.replies || 0,
      views: item.views || 0,
      createdAt: item.created_at,
      isResolved: item.is_resolved
    }));
    
    return { data: posts, error: null };
  } catch (err) {
    console.error('Error fetching forum posts:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

export const getForumPostById = async (id: string): Promise<ApiResponse<ForumPost>> => {
  try {
    // First, increment the view count
    const { error: updateError } = await supabase
      .from('posts')
      .update({
        views: supabase.rpc('increment', { x: 1 })
      })
      .eq('id', id);
    
    if (updateError) {
      console.error('Error updating post views:', updateError);
    }
    
    // Then fetch the post
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:author_id (name)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching forum post:', error);
      return { data: null, error: error.message };
    }
    
    const post: ForumPost = {
      id: data.id,
      title: data.title,
      content: data.content,
      category: data.category,
      author: data.profiles?.name || 'Anonymous',
      authorId: data.author_id,
      replies: data.replies || 0,
      views: data.views || 0,
      createdAt: data.created_at,
      isResolved: data.is_resolved
    };
    
    return { data: post, error: null };
  } catch (err) {
    console.error('Error fetching forum post:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

export const createForumPost = async (
  post: Omit<ForumPost, 'id' | 'replies' | 'views' | 'createdAt'>
): Promise<ApiResponse<ForumPost>> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          title: post.title,
          content: post.content,
          category: post.category,
          author_id: post.authorId,
          replies: 0,
          views: 0,
          created_at: new Date().toISOString(),
          is_resolved: post.isResolved || false
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating forum post:', error);
      return { data: null, error: error.message };
    }
    
    const newPost: ForumPost = {
      id: data.id,
      title: data.title,
      content: data.content,
      category: data.category,
      author: post.author,
      authorId: data.author_id,
      replies: data.replies || 0,
      views: data.views || 0,
      createdAt: data.created_at,
      isResolved: data.is_resolved
    };
    
    return { data: newPost, error: null };
  } catch (err) {
    console.error('Error creating forum post:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

export const getCommentsByPostId = async (postId: string): Promise<ApiResponse<Comment[]>> => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles:author_id (name)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching comments:', error);
      return { data: null, error: error.message };
    }
    
    // Transform the data to match our Comment type
    const comments: Comment[] = data.map(item => ({
      id: item.id,
      content: item.content,
      authorId: item.author_id,
      author: item.profiles?.name || 'Anonymous',
      postId: item.post_id,
      createdAt: item.created_at
    }));
    
    return { data: comments, error: null };
  } catch (err) {
    console.error('Error fetching comments:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

export const createComment = async (
  comment: Omit<Comment, 'id' | 'author' | 'createdAt'>
): Promise<ApiResponse<Comment>> => {
  try {
    // Start a transaction to add the comment and update the post's reply count
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', comment.authorId)
      .single();
    
    if (userError) {
      console.error('Error fetching user data:', userError);
      return { data: null, error: 'Failed to fetch user data' };
    }
    
    // Add the comment
    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          content: comment.content,
          author_id: comment.authorId,
          post_id: comment.postId,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating comment:', error);
      return { data: null, error: error.message };
    }
    
    // Update the post's reply count
    const { error: updateError } = await supabase
      .from('posts')
      .update({
        replies: supabase.rpc('increment', { x: 1 })
      })
      .eq('id', comment.postId);
    
    if (updateError) {
      console.error('Error updating post reply count:', updateError);
      // We don't return an error here as the comment was still created
    }
    
    const newComment: Comment = {
      id: data.id,
      content: data.content,
      authorId: data.author_id,
      author: userData.name || 'Anonymous',
      postId: data.post_id,
      createdAt: data.created_at
    };
    
    return { data: newComment, error: null };
  } catch (err) {
    console.error('Error creating comment:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

export const getUserForumPosts = async (userId: string): Promise<ApiResponse<ForumPost[]>> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:author_id (name)
      `)
      .eq('author_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user forum posts:', error);
      return { data: null, error: error.message };
    }
    
    // Transform the data to match our ForumPost type
    const posts: ForumPost[] = data.map(item => ({
      id: item.id,
      title: item.title,
      content: item.content,
      category: item.category,
      author: item.profiles?.name || 'Anonymous',
      authorId: item.author_id,
      replies: item.replies || 0,
      views: item.views || 0,
      createdAt: item.created_at,
      isResolved: item.is_resolved
    }));
    
    return { data: posts, error: null };
  } catch (err) {
    console.error('Error fetching user forum posts:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};
