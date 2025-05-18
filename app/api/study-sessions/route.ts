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
    const studySessions = await prisma.studySession.findMany();
    return NextResponse.json(studySessions);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching study sessions' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { name, description, course, location, date, duration } =
    await req.json();
  const organizerId = session.user.id;

  try {
    const studySession = await prisma.studySession.create({
      data: {
        name,
        description,
        course,
        location,
        date,
        duration,
        organizerId,
      },
    });
    return NextResponse.json(studySession, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating study session' },
      { status: 500 }
    );
  }
}