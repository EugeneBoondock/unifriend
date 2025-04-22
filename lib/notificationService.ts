import { Notification, ApiResponse } from '@/lib/types';
import supabase from '@/lib/supabaseClient';

// Notification service functions
export const getNotifications = async (
  userId: string,
  limit: number = 50
): Promise<ApiResponse<Notification[]>> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching notifications:', error);
      return { data: null, error: error.message };
    }
    
    // Transform the data to match our Notification type
    const notifications: Notification[] = data.map(item => ({
      id: item.id,
      userId: item.user_id,
      title: item.title,
      message: item.message,
      type: item.type,
      relatedId: item.related_id,
      relatedType: item.related_type,
      isRead: item.is_read,
      createdAt: item.created_at
    }));
    
    return { data: notifications, error: null };
  } catch (err) {
    console.error('Error fetching notifications:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

export const getUnreadCount = async (userId: string): Promise<ApiResponse<number>> => {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    
    if (error) {
      console.error('Error fetching unread count:', error);
      return { data: null, error: error.message };
    }
    
    return { data: count || 0, error: null };
  } catch (err) {
    console.error('Error fetching unread count:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

export const markAsRead = async (notificationId: string): Promise<ApiResponse<null>> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    
    if (error) {
      console.error('Error marking notification as read:', error);
      return { data: null, error: error.message };
    }
    
    return { data: null, error: null };
  } catch (err) {
    console.error('Error marking notification as read:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

export const markAllAsRead = async (userId: string): Promise<ApiResponse<null>> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    
    if (error) {
      console.error('Error marking all notifications as read:', error);
      return { data: null, error: error.message };
    }
    
    return { data: null, error: null };
  } catch (err) {
    console.error('Error marking all notifications as read:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

export const createNotification = async (
  notification: Omit<Notification, 'id' | 'createdAt'>
): Promise<ApiResponse<Notification>> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: notification.userId,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          related_id: notification.relatedId,
          related_type: notification.relatedType,
          is_read: notification.isRead || false,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating notification:', error);
      return { data: null, error: error.message };
    }
    
    const newNotification: Notification = {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      message: data.message,
      type: data.type,
      relatedId: data.related_id,
      relatedType: data.related_type,
      isRead: data.is_read,
      createdAt: data.created_at
    };
    
    return { data: newNotification, error: null };
  } catch (err) {
    console.error('Error creating notification:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
};

// Set up real-time subscription for notifications
export const subscribeToNotifications = (
  userId: string,
  callback: (notification: Notification) => void
) => {
  return supabase
    .channel('notifications-channel')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        // Transform the data to match our Notification type
        const notification: Notification = {
          id: payload.new.id,
          userId: payload.new.user_id,
          title: payload.new.title,
          message: payload.new.message,
          type: payload.new.type,
          relatedId: payload.new.related_id,
          relatedType: payload.new.related_type,
          isRead: payload.new.is_read,
          createdAt: payload.new.created_at
        };
        
        callback(notification);
      }
    )
    .subscribe();
};
