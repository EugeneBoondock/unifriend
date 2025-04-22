'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import Greeting from '@/components/profile/Greeting';

export default function ProfilePage() {
  const { user, loading, updateProfile } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    university: '',
    studentId: '',
    course: '',
    yearOfStudy: '',
    bio: '',
    image: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }

    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        university: user.university || '',
        studentId: user.studentId || '',
        course: user.course || '',
        yearOfStudy: user.yearOfStudy?.toString() || '',
        bio: user.bio || '',
        image: user.image || ''
      });
    }
  }, [user, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const yearOfStudy = profileData.yearOfStudy ? parseInt(profileData.yearOfStudy) : undefined;
      
      const { error } = await updateProfile({
        name: profileData.name,
        university: profileData.university,
        studentId: profileData.studentId,
        course: profileData.course,
        yearOfStudy,
        bio: profileData.bio,
        image: profileData.image
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <Tabs defaultValue="profile">
              <TabsList className="mb-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="space-y-4">
                <Skeleton className="h-4 w-[300px]" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-20 w-full" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to signin
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="space-y-6">
        <Greeting />
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
                  <AvatarFallback>{user.name?.charAt(0) || user.email?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                
                
                <CardTitle>{user.name || 'User'}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <Tabs defaultValue="profile">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        value={profileData.email}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="university">University</Label>
                      <Input
                        id="university"
                        name="university"
                        value={profileData.university}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId"
                        name="studentId"
                        value={profileData.studentId}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="course">Course/Program</Label>
                      <Input
                        id="course"
                        name="course"
                        value={profileData.course}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearOfStudy">Year of Study</Label>
                      <Input
                        id="yearOfStudy"
                        name="yearOfStudy"
                        type="number"
                        min="1"
                        max="7"
                        value={profileData.yearOfStudy}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Profile Image URL</Label>
                    <Input
                      id="image"
                      name="image"
                      value={profileData.image}
                      onChange={handleChange}
                      placeholder="https://example.com/your-image.jpg"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">University</h3>
                      <p className="text-sm text-muted-foreground">{user.university || 'Not specified'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Student ID</h3>
                      <p className="text-sm text-muted-foreground">{user.studentId || 'Not specified'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Course/Program</h3>
                      <p className="text-sm text-muted-foreground">{user.course || 'Not specified'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Year of Study</h3>
                      <p className="text-sm text-muted-foreground">{user.yearOfStudy || 'Not specified'}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Bio</h3>
                    <p className="text-sm text-muted-foreground">{user.bio || 'No bio provided'}</p>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="activity">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Recent Activity</h3>
                <p className="text-sm text-muted-foreground">Your recent activity will appear here.</p>
                {/* Activity content will be implemented in future iterations */}
                <div className="rounded-md border p-4 text-center text-sm text-muted-foreground">
                  No recent activity to display
                </div>
              </div>
            </TabsContent>
            <TabsContent value="settings">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Account Settings</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-md border p-4">
                    <div>
                      <h4 className="text-sm font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-4">
                    <div>
                      <h4 className="text-sm font-medium">Change Password</h4>
                      <p className="text-sm text-muted-foreground">Update your account password</p>
                    </div>
                    <Button variant="outline" onClick={() => router.push('/reset-password')}>Change</Button>
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-4">
                    <div>
                      <h4 className="text-sm font-medium">Privacy Settings</h4>
                      <p className="text-sm text-muted-foreground">Manage your privacy preferences</p>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>    
    </div>
  );
}
