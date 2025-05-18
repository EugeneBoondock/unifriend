import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { prisma } from '@/lib/prisma';

interface Params {
  id: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    const studySession = await prisma.studySession.findUnique({
      where: { id },
    });

    if (!studySession) {
      return NextResponse.json({ message: 'Study session not found' }, { status: 404 });
    }

    return NextResponse.json(studySession);
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const body = await req.json();
  const { name, description, course, location, date, duration } = body;

  try {
    const studySession = await prisma.studySession.update({
      where: { id },
      data: {
        name,
        description,
        course,
        location,
        date,
        duration,
      },
    });

    return NextResponse.json(studySession);
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    await prisma.studySession.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Study session deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}