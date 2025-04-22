import { StudyGroup, ApiResponse } from '@/lib/types';
import supabase from '@/lib/supabaseClient';

// Study Group service functions
export const getStudyGroups = async (
  limit: number = 50,
  searchQuery?: string
): Promise<ApiResponse<StudyGroup[]>> => {
  try {
    let query = supabase
      .from('study_groups')
      .select(`
        *,
        profiles:created_by (name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,course.ilike.%${searchQuery}%,university.ilike.%${searchQuery}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching study groups:', error);
      return { data: null, error: error.message };
    }
    
    // Transform the data to match our StudyGroup type
    const studyGroups: StudyGroup[] = data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      course: item.course,
      university: item.university,
      createdBy: item.created_by,
      createdAt: item.created_at,
      memberCount: item.member_count || 0
    }));
    
    return { data: studyGroups, error: null };
  } catch (err) {
    console.error('Error fetching study groups:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

export const getStudyGroupById = async (id: string): Promise<ApiResponse<StudyGroup>> => {
  try {
    const { data, error } = await supabase
      .from('study_groups')
      .select(`
        *,
        profiles:created_by (name)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching study group:', error);
      return { data: null, error: error.message };
    }
    
    const studyGroup: StudyGroup = {
      id: data.id,
      name: data.name,
      description: data.description,
      course: data.course,
      university: data.university,
      createdBy: data.created_by,
      createdAt: data.created_at,
      memberCount: data.member_count || 0
    };
    
    return { data: studyGroup, error: null };
  } catch (err) {
    console.error('Error fetching study group:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

export const createStudyGroup = async (
  studyGroup: Omit<StudyGroup, 'id' | 'memberCount' | 'createdAt'>
): Promise<ApiResponse<StudyGroup>> => {
  try {
    const { data, error } = await supabase
      .from('study_groups')
      .insert([
        {
          name: studyGroup.name,
          description: studyGroup.description,
          course: studyGroup.course,
          university: studyGroup.university,
          created_by: studyGroup.createdBy,
          member_count: 1, // Creator is the first member
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating study group:', error);
      return { data: null, error: error.message };
    }
    
    // Add creator as a member
    const { error: memberError } = await supabase
      .from('study_group_members')
      .insert([
        {
          group_id: data.id,
          user_id: studyGroup.createdBy,
          joined_at: new Date().toISOString(),
          is_admin: true
        }
      ]);
    
    if (memberError) {
      console.error('Error adding creator as member:', memberError);
      // We don't return an error here as the group was still created
    }
    
    const newStudyGroup: StudyGroup = {
      id: data.id,
      name: data.name,
      description: data.description,
      course: data.course,
      university: data.university,
      createdBy: data.created_by,
      createdAt: data.created_at,
      memberCount: data.member_count || 1
    };
    
    return { data: newStudyGroup, error: null };
  } catch (err) {
    console.error('Error creating study group:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

export const joinStudyGroup = async (groupId: string, userId: string): Promise<ApiResponse<null>> => {
  try {
    // Check if user is already a member
    const { data: existingMember, error: checkError } = await supabase
      .from('study_group_members')
      .select('*')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking membership:', checkError);
      return { data: null, error: checkError.message };
    }
    
    if (existingMember) {
      return { data: null, error: 'User is already a member of this group' };
    }
    
    // Add user as a member
    const { error: memberError } = await supabase
      .from('study_group_members')
      .insert([
        {
          group_id: groupId,
          user_id: userId,
          joined_at: new Date().toISOString(),
          is_admin: false
        }
      ]);
    
    if (memberError) {
      console.error('Error joining study group:', memberError);
      return { data: null, error: memberError.message };
    }
    
    // Increment member count
    const { error: updateError } = await supabase
      .from('study_groups')
      .update({
        member_count: supabase.rpc('increment', { x: 1 })
      })
      .eq('id', groupId);
    
    if (updateError) {
      console.error('Error updating member count:', updateError);
      // We don't return an error here as the user was still added as a member
    }
    
    return { data: null, error: null };
  } catch (err) {
    console.error('Error joining study group:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

export const leaveStudyGroup = async (groupId: string, userId: string): Promise<ApiResponse<null>> => {
  try {
    // Remove user from members
    const { error: memberError } = await supabase
      .from('study_group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);
    
    if (memberError) {
      console.error('Error leaving study group:', memberError);
      return { data: null, error: memberError.message };
    }
    
    // Decrement member count
    const { error: updateError } = await supabase
      .from('study_groups')
      .update({
        member_count: supabase.rpc('decrement', { x: 1 })
      })
      .eq('id', groupId);
    
    if (updateError) {
      console.error('Error updating member count:', updateError);
      // We don't return an error here as the user was still removed as a member
    }
    
    return { data: null, error: null };
  } catch (err) {
    console.error('Error leaving study group:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

export const getUserStudyGroups = async (userId: string): Promise<ApiResponse<StudyGroup[]>> => {
  try {
    const { data, error } = await supabase
      .from('study_group_members')
      .select(`
        group_id,
        study_groups:group_id (
          id,
          name,
          description,
          course,
          university,
          created_by,
          created_at,
          member_count,
          profiles:created_by (name)
        )
      `)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user study groups:', error);
      return { data: null, error: error.message };
    }
    
    // Transform the data to match our StudyGroup type
    const studyGroups: StudyGroup[] = data.map(item => ({
      id: item.study_groups.id,
      name: item.study_groups.name,
      description: item.study_groups.description,
      course: item.study_groups.course,
      university: item.study_groups.university,
      createdBy: item.study_groups.created_by,
      createdAt: item.study_groups.created_at,
      memberCount: item.study_groups.member_count || 0,
      isMember: true
    }));
    
    return { data: studyGroups, error: null };
  } catch (err) {
    console.error('Error fetching user study groups:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

export const getRecommendedStudyGroups = async (
  userId: string,
  university?: string,
  course?: string,
  limit: number = 3
): Promise<ApiResponse<StudyGroup[]>> => {
  try {
    // Get user's groups to exclude them
    const { data: userGroups, error: userGroupsError } = await supabase
      .from('study_group_members')
      .select('group_id')
      .eq('user_id', userId);
    
    if (userGroupsError) {
      console.error('Error fetching user groups:', userGroupsError);
      return { data: null, error: userGroupsError.message };
    }
    
    const userGroupIds = userGroups.map(item => item.group_id);
    
    // Build query for recommended groups
    let query = supabase
      .from('study_groups')
      .select(`
        *,
        profiles:created_by (name)
      `)
      .order('member_count', { ascending: false });
    
    // Exclude groups the user is already a member of
    if (userGroupIds.length > 0) {
      query = query.not('id', 'in', `(${userGroupIds.join(',')})`);
    }
    
    // Filter by university or course if provided
    if (university) {
      query = query.eq('university', university);
    }
    
    if (course) {
      query = query.eq('course', course);
    }
    
    // Limit results
    query = query.limit(limit);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching recommended study groups:', error);
      return { data: null, error: error.message };
    }
    
    // Transform the data to match our StudyGroup type
    const studyGroups: StudyGroup[] = data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      course: item.course,
      university: item.university,
      createdBy: item.created_by,
      createdAt: item.created_at,
      memberCount: item.member_count || 0,
      isMember: false
    }));
    
    return { data: studyGroups, error: null };
  } catch (err) {
    console.error('Error fetching recommended study groups:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};
