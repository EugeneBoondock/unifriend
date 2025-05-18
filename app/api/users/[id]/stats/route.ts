import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = params.id;

  if (!session || session.user.id !== userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userStats = await prisma.$transaction([
      prisma.protestParticipant.count({
        where: {
          userId: userId,
        },
      }),
      prisma.reservation.count({
        where: {
          userId: userId,
        },
      }),
      prisma.ads.count({
        where: {
          authorId: userId,
        },
      }),
      prisma.helpRequest.count({
        where: {
          authorId: userId,
        },
      }),
      prisma.resource.count({
        where: {
          authorId: userId,
        },
      }),
      prisma.studyPlan.count({
        where: {
          userId: userId,
        },
      }),
      prisma.classNotesRequest.count({
        where: {
          userId: userId,
        },
      }),
      prisma.collaborativeWorkspace.count({
        where: {
          ownerId: userId,
        },
      }),
      prisma.assignmentTemplate.count({
        where: {
          authorId: userId,
        },
      }),
      prisma.peerReview.count({
        where: {
          reviewerId: userId,
        },
      }),
      prisma.job.count({
          where: {

          }
      }),
      prisma.resume.count({
        where: {
          userId: userId
        }
      }),
      prisma.interviewPreparationResource.count({
          where: {

          }
      }),
      prisma.employer.count({
          where: {

          }
      }),
    ]);

    const [
      protestsAttended,
      booksBorrowed,
      adsPosted,
      helpRequestsMade,
      resourcesShared,
      studyPlansMade,
      classesMissed,
      collaborativeWorkspacesMade,
      assignmentTemplatesMade,
      peerReviewsMade,
      jobsPosted,
      resumesMade,
      interviewPreparationResourcesPosted,
      employersPosted,
    ] = userStats;

    return NextResponse.json({
      protestsAttended,
      booksBorrowed,
      adsPosted,
      helpRequestsMade,
      resourcesShared,
      studyPlansMade,
      classesMissed,
      collaborativeWorkspacesMade,
      assignmentTemplatesMade,
      peerReviewsMade,
      jobsPosted,
      resumesMade,
      interviewPreparationResourcesPosted,
      employersPosted
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}