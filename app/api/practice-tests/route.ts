import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const practiceTests = await prisma.practiceTest.findMany();
    return NextResponse.json(practiceTests);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching practice tests' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { name, description, course, duration } = await req.json();
    const newPracticeTest = await prisma.practiceTest.create({
      data: {
        name,
        description,
        course,
        duration,
        userId: session.user.id,
      },
    });
    return NextResponse.json(newPracticeTest, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating practice test' },
      { status: 500 }
    );
  }
}