import { Resource, ApiResponse } from '@/lib/types';
import supabase from '@/lib/supabaseClient';

// Resource service functions
export const getResources = async (
  limit: number = 50,
  category?: string,
  searchQuery?: string
): Promise<ApiResponse<Resource[]>> => {
  try {
    let query = supabase
      .from('resources')
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
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching resources:', error);
      return { data: null, error: error.message };
    }
    
    // Transform the data to match our Resource type
    const resources: Resource[] = data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      university: item.university,
      course: item.course,
      fileUrl: item.file_url,
      authorId: item.author_id,
      author: item.profiles?.name,
      downloads: item.downloads || 0,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
    
    return { data: resources, error: null };
  } catch (err) {
    console.error('Error fetching resources:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

export const getResourceById = async (id: string): Promise<ApiResponse<Resource>> => {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select(`
        *,
        profiles:author_id (name)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching resource:', error);
      return { data: null, error: error.message };
    }
    
    const resource: Resource = {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      university: data.university,
      course: data.course,
      fileUrl: data.file_url,
      authorId: data.author_id,
      author: data.profiles?.name,
      downloads: data.downloads || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
    
    return { data: resource, error: null };
  } catch (err) {
    console.error('Error fetching resource:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

export const createResource = async (
  resource: Omit<Resource, 'id' | 'downloads' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<Resource>> => {
  try {
    const { data, error } = await supabase
      .from('resources')
      .insert([
        {
          title: resource.title,
          description: resource.description,
          category: resource.category,
          university: resource.university,
          course: resource.course,
          file_url: resource.fileUrl,
          author_id: resource.authorId,
          downloads: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating resource:', error);
      return { data: null, error: error.message };
    }
    
    const newResource: Resource = {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      university: data.university,
      course: data.course,
      fileUrl: data.file_url,
      authorId: data.author_id,
      author: resource.author,
      downloads: data.downloads || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
    
    return { data: newResource, error: null };
  } catch (err) {
    console.error('Error creating resource:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

export const updateResourceDownloads = async (id: string): Promise<ApiResponse<null>> => {
  try {
    // First get the current download count
    const { data: resource, error: fetchError } = await supabase
      .from('resources')
      .select('downloads')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      console.error('Error fetching resource downloads:', fetchError);
      return { data: null, error: fetchError.message };
    }
    
    // Increment the download count
    const { error: updateError } = await supabase
      .from('resources')
      .update({
        downloads: (resource.downloads || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (updateError) {
      console.error('Error updating resource downloads:', updateError);
      return { data: null, error: updateError.message };
    }
    
    return { data: null, error: null };
  } catch (err) {
    console.error('Error updating resource downloads:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

export const getUserResources = async (userId: string): Promise<ApiResponse<Resource[]>> => {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select(`
        *,
        profiles:author_id (name)
      `)
      .eq('author_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user resources:', error);
      return { data: null, error: error.message };
    }
    
    // Transform the data to match our Resource type
    const resources: Resource[] = data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      university: item.university,
      course: item.course,
      fileUrl: item.file_url,
      authorId: item.author_id,
      author: item.profiles?.name,
      downloads: item.downloads || 0,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
    
    return { data: resources, error: null };
  } catch (err) {
    console.error('Error fetching user resources:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};
