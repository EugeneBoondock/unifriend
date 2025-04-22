import { Achievement, Badge, LeaderboardUser, ApiResponse } from '@/lib/types';
import supabase from '@/lib/supabaseClient';

// Gamification service functions
export const getUserAchievements = async (userId: string): Promise<ApiResponse<Achievement[]>> => {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select(`
        *,
        user_achievements!inner (
          user_id,
          unlocked,
          progress,
          max_progress
        )
      `)
      .eq('user_achievements.user_id', userId)
      .order('points', { ascending: false });
    
    if (error) {
      console.error('Error fetching user achievements:', error);
      return { data: null, error: error.message };
    }
    
    // Transform the data to match our Achievement type
    const achievements: Achievement[] = data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      icon: item.icon,
      points: item.points,
      unlocked: item.user_achievements.unlocked,
      progress: item.user_achievements.progress,
      maxProgress: item.user_achievements.max_progress
    }));
    
    return { data: achievements, error: null };
  } catch (err) {
    console.error('Error fetching user achievements:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

export const getUserBadges = async (userId: string): Promise<ApiResponse<Badge[]>> => {
  try {
    const { data, error } = await supabase
      .from('badges')
      .select(`
        *,
        user_badges!left (
          user_id,
          unlocked
        )
      `)
      .eq('user_badges.user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user badges:', error);
      return { data: null, error: error.message };
    }
    
    // Transform the data to match our Badge type
    const badges: Badge[] = data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      image: item.image,
      rarity: item.rarity,
      unlocked: item.user_badges?.unlocked || false
    }));
    
    return { data: badges, error: null };
  } catch (err) {
    console.error('Error fetching user badges:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

export const getLeaderboard = async (limit: number = 10): Promise<ApiResponse<LeaderboardUser[]>> => {
  try {
    const { data, error } = await supabase
      .from('user_points')
      .select(`
        user_id,
        points,
        level,
        rank,
        profiles:user_id (
          name,
          image
        )
      `)
      .order('rank', { ascending: true })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching leaderboard:', error);
      return { data: null, error: error.message };
    }
    
    // Transform the data to match our LeaderboardUser type
    const leaderboard: LeaderboardUser[] = data.map(item => ({
      id: item.user_id,
      name: item.profiles?.name || 'Anonymous',
      image: item.profiles?.image,
      points: item.points,
      level: item.level,
      rank: item.rank
    }));
    
    return { data: leaderboard, error: null };
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

export const getUserStats = async (userId: string): Promise<ApiResponse<{
  points: number;
  level: number;
  rank: number;
  nextLevelPoints: number;
  progress: number;
}>> => {
  try {
    const { data, error } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user stats:', error);
      return { data: null, error: error.message };
    }
    
    // Calculate next level points and progress
    const nextLevelPoints = data.level * 200;
    const progress = Math.min(100, Math.floor((data.points / nextLevelPoints) * 100));
    
    return { 
      data: {
        points: data.points,
        level: data.level,
        rank: data.rank,
        nextLevelPoints,
        progress
      }, 
      error: null 
    };
  } catch (err) {
    console.error('Error fetching user stats:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

export const awardPoints = async (
  userId: string, 
  points: number, 
  reason: string
): Promise<ApiResponse<null>> => {
  try {
    // First get current user points
    const { data: userData, error: fetchError } = await supabase
      .from('user_points')
      .select('points, level')
      .eq('user_id', userId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching user points:', fetchError);
      return { data: null, error: fetchError.message };
    }
    
    const newPoints = userData.points + points;
    
    // Calculate new level based on points
    // Simple formula: level = 1 + floor(points / 200)
    const newLevel = 1 + Math.floor(newPoints / 200);
    const leveledUp = newLevel > userData.level;
    
    // Update user points
    const { error: updateError } = await supabase
      .from('user_points')
      .update({
        points: newPoints,
        level: newLevel,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
    
    if (updateError) {
      console.error('Error updating user points:', updateError);
      return { data: null, error: updateError.message };
    }
    
    // Create points history entry
    const { error: historyError } = await supabase
      .from('points_history')
      .insert([
        {
          user_id: userId,
          points: points,
          reason: reason,
          created_at: new Date().toISOString()
        }
      ]);
    
    if (historyError) {
      console.error('Error creating points history:', historyError);
      // We don't return an error here as the points were still awarded
    }
    
    // If user leveled up, create a notification
    if (leveledUp) {
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: userId,
            title: 'Level Up!',
            message: `Congratulations! You've reached level ${newLevel}.`,
            type: 'system',
            is_read: false,
            created_at: new Date().toISOString()
          }
        ]);
      
      if (notificationError) {
        console.error('Error creating level up notification:', notificationError);
        // We don't return an error here as the points were still awarded
      }
    }
    
    return { data: null, error: null };
  } catch (err) {
    console.error('Error awarding points:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

export const unlockAchievement = async (
  userId: string, 
  achievementId: string
): Promise<ApiResponse<null>> => {
  try {
    // Update user achievement
    const { error: updateError } = await supabase
      .from('user_achievements')
      .update({
        unlocked: true,
        unlocked_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('achievement_id', achievementId);
    
    if (updateError) {
      console.error('Error unlocking achievement:', updateError);
      return { data: null, error: updateError.message };
    }
    
    // Get achievement details
    const { data: achievement, error: fetchError } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', achievementId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching achievement:', fetchError);
      return { data: null, error: fetchError.message };
    }
    
    // Award points for the achievement
    await awardPoints(
      userId, 
      achievement.points, 
      `Unlocked achievement: ${achievement.title}`
    );
    
    // Create notification
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          title: 'Achievement Unlocked!',
          message: `You've unlocked the "${achievement.title}" achievement and earned ${achievement.points} points.`,
          type: 'system',
          is_read: false,
          created_at: new Date().toISOString()
        }
      ]);
    
    if (notificationError) {
      console.error('Error creating achievement notification:', notificationError);
      // We don't return an error here as the achievement was still unlocked
    }
    
    return { data: null, error: null };
  } catch (err) {
    console.error('Error unlocking achievement:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

export const updateAchievementProgress = async (
  userId: string, 
  achievementId: string, 
  progress: number
): Promise<ApiResponse<null>> => {
  try {
    // Get current achievement progress
    const { data: userAchievement, error: fetchError } = await supabase
      .from('user_achievements')
      .select('progress, max_progress, unlocked')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching achievement progress:', fetchError);
      return { data: null, error: fetchError.message };
    }
    
    // If already unlocked, no need to update
    if (userAchievement.unlocked) {
      return { data: null, error: null };
    }
    
    const newProgress = userAchievement.progress + progress;
    const shouldUnlock = newProgress >= userAchievement.max_progress;
    
    // Update progress
    const { error: updateError } = await supabase
      .from('user_achievements')
      .update({
        progress: Math.min(newProgress, userAchievement.max_progress),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('achievement_id', achievementId);
    
    if (updateError) {
      console.error('Error updating achievement progress:', updateError);
      return { data: null, error: updateError.message };
    }
    
    // If progress meets or exceeds max_progress, unlock the achievement
    if (shouldUnlock) {
      await unlockAchievement(userId, achievementId);
    }
    
    return { data: null, error: null };
  } catch (err) {
    console.error('Error updating achievement progress:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};
