# UniFriend - Student Platform

UniFriend is a comprehensive platform designed for students in South Africa to connect, share resources, and collaborate on their academic journey.

## Features

- **Authentication System**: Secure email/password authentication using Supabase
- **User Profiles**: Detailed user profiles with academic information
- **Dashboard**: Personalized dashboard with activity tracking and statistics
- **Resource Sharing**: Upload and download study materials
- **Discussion Forum**: Ask questions and share advice with fellow students
- **Study Groups**: Create and join study groups for collaborative learning
- **Real-time Notifications**: Stay updated with platform activities
- **Gamification**: Achievements, badges, and leaderboards to encourage engagement

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Authentication, Database, Storage, Real-time)
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API
- **Deployment**: Vercel (recommended)

## Project Structure

```
unifriend/
├── app/                    # Next.js app directory
│   ├── achievements/       # Gamification features
│   ├── api/                # API routes
│   ├── dashboard/          # User dashboard
│   ├── forum/              # Discussion forum
│   ├── notifications/      # User notifications
│   ├── profile/            # User profile
│   ├── resources/          # Study resources
│   ├── study-groups/       # Collaborative study groups
│   └── ...                 # Other pages
├── components/             # Reusable React components
│   ├── auth/               # Authentication components
│   ├── layout/             # Layout components
│   └── ui/                 # UI components
├── lib/                    # Utility functions and services
│   ├── authService.ts      # Authentication service
│   ├── forumService.ts     # Forum service
│   ├── gamificationService.ts # Gamification service
│   ├── notificationService.ts # Notification service
│   ├── resourceService.ts  # Resource service
│   ├── studyGroupService.ts # Study group service
│   ├── supabaseClient.ts   # Supabase client
│   └── types.ts            # TypeScript type definitions
├── public/                 # Static assets
└── ...                     # Configuration files
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Environment Setup

1. Clone the repository:
   ```
   git clone https://github.com/EugeneBoondock/unifriend.git
   cd unifriend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel Deployment

1. Push your code to GitHub.
2. Connect your GitHub repository to Vercel.
3. Configure the environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy the application.

## Supabase Setup

### Database Tables

The application requires the following tables in your Supabase database:

1. **profiles** - User profile information
2. **resources** - Study materials shared by users
3. **posts** - Forum discussion posts
4. **comments** - Comments on forum posts
5. **study_groups** - Study groups information
6. **study_group_members** - Members of study groups
7. **notifications** - User notifications
8. **achievements** - Available achievements
9. **user_achievements** - User's progress on achievements
10. **badges** - Available badges
11. **user_badges** - Badges earned by users
12. **user_points** - User points and levels for gamification

### Authentication Setup

1. Enable Email/Password authentication in Supabase Authentication settings.
2. Configure email templates for verification and password reset.
3. Set up redirect URLs for authentication flows.

## Features Documentation

### Authentication

The platform uses Supabase Authentication for user management. Features include:
- Email/password sign up and sign in
- Email verification
- Password reset functionality
- Protected routes for authenticated users

### User Profiles

Users can create and manage their profiles with:
- Personal information
- University and course details
- Profile picture
- Bio and interests

### Resource Sharing

Students can share and access study materials:
- Upload documents (PDF, DOC, PPT, etc.)
- Browse resources by category
- Search functionality
- Download tracking

### Discussion Forum

A community space for academic discussions:
- Create discussion threads
- Reply to posts
- Filter by categories
- Mark discussions as resolved

### Study Groups

Collaborative learning through study groups:
- Create study groups for specific courses
- Join existing groups
- Group member management
- Recommended groups based on user's courses

### Notifications

Real-time notification system for:
- Forum replies and mentions
- Resource updates
- Study group invitations
- Achievement unlocks

### Gamification

Engagement features to motivate users:
- Points system for platform activities
- Achievements for completing specific actions
- Badges for special accomplishments
- Leaderboard to showcase top contributors

## Maintenance and Future Development

### Recommended Improvements

1. **Mobile Application**: Develop a mobile app version using React Native
2. **Advanced Search**: Implement full-text search for resources and forum posts
3. **Video Conferencing**: Integrate video chat for study groups
4. **AI Recommendations**: Add AI-powered content recommendations
5. **Calendar Integration**: Add event scheduling and calendar integration

### Performance Optimization

- Implement server-side caching for frequently accessed data
- Optimize image loading with next/image
- Use incremental static regeneration for semi-static pages

## Support

For any questions or issues, please contact the development team or open an issue on GitHub.

---

Built with ❤️ for South African students
