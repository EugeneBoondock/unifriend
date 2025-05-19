// Type definitions for the application

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface ClassNotesRequestType {
  id: string;
  title: string;
  description: string | null;
  course: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: User;
}

export interface LectureRecordingType {
  id: string;
  title: string;
  description: string | null;
  course: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: User;
}

export interface CatchUpMaterialType {
  id: string;
  title: string;
  description: string | null;
  course: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: User;
}
