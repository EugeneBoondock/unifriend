# Deployment Guide for UniFriend

This document provides detailed instructions for deploying the UniFriend platform to a production environment.

## Prerequisites

- Node.js 18+ and npm
- Supabase account
- Vercel account (recommended) or another hosting provider
- GitHub account

## Supabase Setup

### 1. Create a Supabase Project

1. Sign up or log in to [Supabase](https://supabase.com/)
2. Create a new project
3. Note your project URL and anon key (found in Project Settings > API)

### 2. Database Setup

Execute the following SQL in the Supabase SQL Editor to create the necessary tables:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  university TEXT,
  student_id TEXT,
  course TEXT,
  year_of_study INTEGER,
  bio TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create resources table
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  university TEXT,
  course TEXT,
  file_url TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  replies INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  post_id UUID REFERENCES posts(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create study_groups table
CREATE TABLE study_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  course TEXT NOT NULL,
  university TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  member_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create study_group_members table
CREATE TABLE study_group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES study_groups(id) NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(group_id, user_id)
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  related_id TEXT,
  related_type TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create achievements table
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  points INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_achievements table
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  achievement_id UUID REFERENCES achievements(id) NOT NULL,
  unlocked BOOLEAN DEFAULT FALSE,
  progress INTEGER DEFAULT 0,
  max_progress INTEGER NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, achievement_id)
);

-- Create badges table
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  rarity TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_badges table
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  badge_id UUID REFERENCES badges(id) NOT NULL,
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, badge_id)
);

-- Create user_points table
CREATE TABLE user_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Create points_history table
CREATE TABLE points_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create helper functions
CREATE OR REPLACE FUNCTION increment(x integer)
RETURNS integer AS $$
  BEGIN
    RETURN x + 1;
  END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement(x integer)
RETURNS integer AS $$
  BEGIN
    RETURN GREATEST(0, x - 1);
  END;
$$ LANGUAGE plpgsql;
```

### 3. Storage Setup

1. Create the following storage buckets in Supabase:
   - `profile-images` - For user profile pictures
   - `resources` - For uploaded study materials

2. Configure bucket permissions:
   - `profile-images`: Authenticated users can upload and read
   - `resources`: Authenticated users can upload, everyone can read

### 4. Authentication Setup

1. Go to Authentication > Settings
2. Enable Email/Password provider
3. Configure Site URL and Redirect URLs:
   - Site URL: Your production URL (e.g., `https://your-domain.com`)
   - Redirect URLs: Add your production URL and localhost for development
4. Customize email templates for:
   - Confirmation emails
   - Password reset emails

## Vercel Deployment

### 1. Prepare Your Repository

1. Ensure your code is pushed to GitHub
2. Make sure you have a `.env.example` file showing required environment variables

### 2. Connect to Vercel

1. Sign up or log in to [Vercel](https://vercel.com/)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

### 3. Environment Variables

Add the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your site will be available at a Vercel-generated URL
4. (Optional) Configure a custom domain in the Vercel project settings

## Alternative Deployment Options

### Self-Hosting

1. Build the application:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   npm start
   ```

3. Use a process manager like PM2:
   ```
   npm install -g pm2
   pm2 start npm --name "unifriend" -- start
   ```

4. Set up a reverse proxy with Nginx or Apache

### Docker Deployment

1. Create a Dockerfile in the project root:
   ```dockerfile
   FROM node:18-alpine AS base

   # Install dependencies only when needed
   FROM base AS deps
   WORKDIR /app
   COPY package.json package-lock.json ./
   RUN npm ci

   # Rebuild the source code only when needed
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build

   # Production image, copy all the files and run next
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV production
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next ./.next
   COPY --from=builder /app/node_modules ./node_modules
   COPY --from=builder /app/package.json ./package.json

   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. Build and run the Docker container:
   ```
   docker build -t unifriend .
   docker run -p 3000:3000 -e NEXT_PUBLIC_SUPABASE_URL=your_url -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key unifriend
   ```

## Post-Deployment Tasks

### 1. Test the Deployed Application

- Test user registration and login
- Verify all features are working correctly
- Check responsive design on different devices

### 2. Set Up Monitoring

- Configure error tracking with a service like Sentry
- Set up performance monitoring
- Implement logging for critical operations

### 3. Regular Maintenance

- Keep dependencies updated
- Monitor Supabase usage and quotas
- Regularly backup your database

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify Supabase URL and anon key are correct
   - Check that redirect URLs are properly configured in Supabase

2. **Database Connection Issues**
   - Ensure database tables are created correctly
   - Check for any missing columns or constraints

3. **Build Failures**
   - Review build logs for specific errors
   - Ensure all dependencies are installed

4. **Missing Environment Variables**
   - Double-check that all required environment variables are set

## Support

For additional help, contact the development team or refer to the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

This deployment guide was prepared for UniFriend platform version 1.0.0.
