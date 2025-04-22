// Types for user-related data
export type User = {
  id: string;
  email: string;
  name?: string;
  university?: string;
  studentId?: string;
  course?: string;
  yearOfStudy?: number;
  bio?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
};

// Types for authentication-related data
export type AuthError = {
  message: string;
};

export type UserCredentials = {
  email: string;
  password: string;
};

export type UserRegistration = UserCredentials & {
  name?: string;
  university?: string;
  studentId?: string;
  course?: string;
  yearOfStudy?: number;
};

// Types for resource-related data
export type Resource = {
  id: string;
  title: string;
  description: string;
  category: string;
  university?: string;
  course?: string;
  fileUrl: string;
  authorId: string;
  author?: string;
  downloads: number;
  createdAt: string;
  updatedAt: string;
};

// Types for forum-related data
export type ForumPost = {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  authorId: string;
  replies: number;
  views: number;
  createdAt: string;
  isResolved: boolean;
};

export type Comment = {
  id: string;
  content: string;
  authorId: string;
  author: string;
  postId: string;
  createdAt: string;
};

// Types for study group-related data
export type StudyGroup = {
  id: string;
  name: string;
  description: string;
  course: string;
  university: string;
  createdBy: string;
  createdAt: string;
  memberCount: number;
  isMember?: boolean;
};

// Types for notification-related data
export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'system' | 'message' | 'mention' | 'like' | 'comment' | 'follow' | 'resource' | 'event';
  relatedId?: string;
  relatedType?: string;
  isRead: boolean;
  createdAt: string;
};

// Types for gamification-related data
export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
};

export type LeaderboardUser = {
  id: string;
  name: string;
  image?: string;
  points: number;
  level: number;
  rank: number;
};

// Types for API responses
export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};
