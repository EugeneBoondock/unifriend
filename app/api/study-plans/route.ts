import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth.config';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const studyPlans = await prisma.studyPlan.findMany();
    return NextResponse.json(studyPlans);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching study plans' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { name, description, course, startDate, endDate } = await req.json();

  if (!name || !course || !startDate || !endDate) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const studyPlan = await prisma.studyPlan.create({
      data: {
        name,
        description,
        course,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId: session.user.id,
      },
    });
    return NextResponse.json(studyPlan, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating study plan' }, { status: 500 });
  }
}