'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  progress?: number;
  max_progress?: number;
};

type Badge = {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
};

type LeaderboardUser = {
  id: string;
  name: string;
  image?: string;
  points: number;
  level: number;
  rank: number;
};

export default function GamificationPage() {
  const { user, loading: authLoading } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [userStats, setUserStats] = useState({
    points: 0,
    level: 1,
    rank: 0,
    nextLevelPoints: 100,
    progress: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchGamificationData = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, this would fetch from Supabase
        // Mock data for demonstration
        const mockAchievements: Achievement[] = [
          {
            id: '1',
            title: 'Profile Perfectionist',
            description: 'Complete your profile with all information',
            icon: '👤',
            points: 50,
            unlocked: true
          },
          {
            id: '2',
            title: 'Resource Contributor',
            description: 'Upload your first study resource',
            icon: '📚',
            points: 100,
            unlocked: true
          },
          {
            id: '3',
            title: 'Discussion Starter',
            description: 'Create your first forum post',
            icon: '💬',
            points: 75,
            unlocked: false,
            progress: 0,
            max_progress: 1
          },
          {
            id: '4',
            title: 'Helpful Responder',
            description: 'Reply to 5 forum posts',
            icon: '🤝',
            points: 150,
            unlocked: false,
            progress: 2,
            max_progress: 5
          },
          {
            id: '5',
            title: 'Study Group Leader',
            description: 'Create a study group with at least 5 members',
            icon: '👥',
            points: 200,
            unlocked: false,
            progress: 0,
            max_progress: 5
          },
          {
            id: '6',
            title: 'Resource Explorer',
            description: 'Download 10 different study resources',
            icon: '🔍',
            points: 125,
            unlocked: false,
            progress: 3,
            max_progress: 10
          }
        ];
        
        const mockBadges: Badge[] = [
          {
            id: '1',
            name: 'Early Adopter',
            description: 'One of the first users to join UniFriend',
            image: '🌟',
            rarity: 'rare',
            unlocked: true
          },
          {
            id: '2',
            name: 'Knowledge Sharer',
            description: 'Shared high-quality resources that helped many students',
            image: '📖',
            rarity: 'uncommon',
            unlocked: true
          },
          {
            id: '3',
            name: 'Community Builder',
            description: 'Actively participated in building the UniFriend community',
            image: '🏗️',
            rarity: 'epic',
            unlocked: false
          },
          {
            id: '4',
            name: 'Top Contributor',
            description: 'Among the top 10 contributors on the platform',
            image: '🏆',
            rarity: 'legendary',
            unlocked: false
          }
        ];
        
        const mockLeaderboard: LeaderboardUser[] = [
          {
            id: '1',
            name: 'Sarah Johnson',
            points: 1250,
            level: 8,
            rank: 1
          },
          {
            id: '2',
            name: 'Michael Chen',
            points: 1120,
            level: 7,
            rank: 2
          },
          {
            id: '3',
            name: 'Thabo Mbeki',
            points: 980,
            level: 6,
            rank: 3
          },
          {
            id: '4',
            name: 'Lerato Ndlovu',
            points: 875,
            level: 6,
            rank: 4
          },
          {
            id: '5',
            name: 'James Wilson',
            points: 820,
            level: 5,
            rank: 5
          },
          {
            id: user.id,
            name: user.name || 'You',
            image: user.image,
            points: 650,
            level: 4,
            rank: 8
          }
        ];
        
        const mockUserStats = {
          points: 650,
          level: 4,
          rank: 8,
          nextLevelPoints: 800,
          progress: 65 // percentage to next level
        };
        
        setAchievements(mockAchievements);
        setBadges(mockBadges);
        setLeaderboard(mockLeaderboard);
        setUserStats(mockUserStats);
      } catch (err) {
        console.error('Error fetching gamification data:', err);
        toast.error('Failed to load gamification data');
      } finally {
        setLoading(false);
      }
    };

    fetchGamificationData();
  }, [user]);

  if (authLoading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Sign in Required</CardTitle>
            <CardDescription>
              Please sign in to view your achievements and progress
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Progress</h1>
        <p className="text-muted-foreground">
          Track your achievements, badges, and ranking on UniFriend
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-primary">
                      <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
                      <AvatarFallback className="text-2xl">{user.name?.charAt(0) || user.email?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full px-2 py-1 text-sm font-bold">
                      Lvl {userStats.level}
                    </div>
                  </div>
                  <h2 className="mt-4 text-xl font-bold">{user.name || 'User'}</h2>
                  <p className="text-sm text-muted-foreground">Rank #{userStats.rank} on the leaderboard</p>
                </div>
                
                <div className="flex-1 w-full">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Level {userStats.level}</span>
                      <span className="text-sm text-muted-foreground">{userStats.points} / {userStats.nextLevelPoints} XP</span>
                    </div>
                    <Progress value={userStats.progress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard title="Total XP" value={userStats.points.toString()} icon="✨" />
                    <StatCard title="Level" value={userStats.level.toString()} icon="📊" />
                    <StatCard title="Achievements" value={achievements.filter(a => a.unlocked).length + "/" + achievements.length} icon="🏆" />
                    <StatCard title="Badges" value={badges.filter(b => b.unlocked).length + "/" + badges.length} icon="🥇" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="achievements">
            <TabsList className="mb-6">
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            </TabsList>
            
            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map(achievement => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="badges" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {badges.map(badge => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="leaderboard" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Students</CardTitle>
                  <CardDescription>
                    Students with the highest contribution and engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboard
                      .sort((a, b) => a.rank - b.rank)
                      .map(leaderboardUser => (
                        <LeaderboardRow 
                          key={leaderboardUser.id} 
                          user={leaderboardUser} 
                          isCurrentUser={leaderboardUser.id === user.id} 
                        />
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="bg-muted/50 rounded-lg p-4 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <Card className={`h-full ${achievement.unlocked ? 'bg-primary/5' : 'opacity-70'}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`text-4xl ${achievement.unlocked ? 'text-primary' : 'text-muted-foreground'}`}>
            {achievement.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{achievement.title}</h3>
              <Badge variant={achievement.unlocked ? "default" : "outline"}>
                {achievement.unlocked ? "Unlocked" : "Locked"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
            {achievement.unlocked ? (
              <p className="text-sm font-medium text-primary mt-2">+{achievement.points} XP</p>
            ) : achievement.progress !== undefined && achievement.max_progress !== undefined ? (
              <div className="mt-2">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span>Progress</span>
                  <span>{achievement.progress} / {achievement.max_progress}</span>
                </div>
                <Progress value={(achievement.progress / achievement.max_progress) * 100} className="h-1" />
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BadgeCard({ badge }: { badge: Badge }) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-slate-500';
      case 'uncommon': return 'text-green-500';
      case 'rare': return 'text-blue-500';
      case 'epic': return 'text-purple-500';
      case 'legendary': return 'text-amber-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <Card className={`h-full ${badge.unlocked ? '' : 'opacity-70'}`}>
      <CardContent className="p-6 text-center">
        <div className="text-5xl mb-3">{badge.image}</div>
        <h3 className="font-medium">{badge.name}</h3>
        <p className={`text-xs font-medium uppercase mt-1 ${getRarityColor(badge.rarity)}`}>
          {badge.rarity}
        </p>
        <p className="text-sm text-muted-foreground mt-2">{badge.description}</p>
        {!badge.unlocked && (
          <Badge variant="outline" className="mt-3">Locked</Badge>
        )}
      </CardContent>
    </Card>
  );
}

function LeaderboardRow({ user, isCurrentUser }: { user: LeaderboardUser; isCurrentUser: boolean }) {
  return (
    <div className={`flex items-center p-3 rounded-lg ${isCurrentUser ? 'bg-primary/10' : ''}`}>
      <div className="w-8 text-center font-bold">#{user.rank}</div>
      <Avatar className="h-10 w-10 mx-3">
        <AvatarImage src={user.image || ''} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="font-medium">{user.name} {isCurrentUser && "(You)"}</div>
        <div className="text-xs text-muted-foreground">Level {user.level}</div>
      </div>
      <div className="font-bold">{user.points} XP</div>
    </div>
  );
}
