import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth.config';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }
  try {
    const lectureRecordings = await prisma.lectureRecording.findMany();
    return NextResponse.json(lectureRecordings);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  const body = await req.json();
  const { title, description, course, url } = body;

  if (!title || !description || !course || !url) {
    return new NextResponse(
      JSON.stringify({ error: 'Missing required fields' }),
      { status: 400 }
    );
  }

  try {
    const lectureRecording = await prisma.lectureRecording.create({
      data: {
        title,
        description,
        course,
        url,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return NextResponse.json(lectureRecording, { status: 201 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}