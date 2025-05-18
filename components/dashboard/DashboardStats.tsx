"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Stats {
  protestsAttended: number;
  booksBorrowed: number;
  adsPosted: number;
  helpRequestsMade: number;
  resourcesShared: number;
  studyPlansMade: number;
  classesMissed: number;
  collaborativeWorkspacesMade: number;
  assignmentTemplatesMade: number;
  peerReviewsMade: number;
  jobsPosted: number;
  resumesMade: number;
  interviewPreparationResourcesPosted: number;
  employersPosted: number;
}

const DashboardStats = () => {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!session?.user?.id) {
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/users/${session.user.id}/stats`);
        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.statusText}`);
        }
        const data = await response.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [session?.user?.id]);

  if (loading) {
    return <div>Loading stats...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!stats) {
    return <div>No stats available.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Protests Attended</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="w-full justify-center">{stats.protestsAttended}</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Books Borrowed</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="w-full justify-center">{stats.booksBorrowed}</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ads Posted</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="w-full justify-center">{stats.adsPosted}</Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Help Requests Made</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="w-full justify-center">{stats.helpRequestsMade}</Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Resources Shared</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="w-full justify-center">{stats.resourcesShared}</Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Study Plans Made</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="w-full justify-center">{stats.studyPlansMade}</Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Classes Missed</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="w-full justify-center">{stats.classesMissed}</Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Collaborative Workspaces Made</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="w-full justify-center">{stats.collaborativeWorkspacesMade}</Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Assignment Templates Made</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="w-full justify-center">{stats.assignmentTemplatesMade}</Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Peer Reviews Made</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="w-full justify-center">{stats.peerReviewsMade}</Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Jobs Posted</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="w-full justify-center">{stats.jobsPosted}</Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Resumes Made</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="w-full justify-center">{stats.resumesMade}</Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Interview Preparation Resources Posted</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="w-full justify-center">{stats.interviewPreparationResourcesPosted}</Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Employers Posted</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="w-full justify-center">{stats.employersPosted}</Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;