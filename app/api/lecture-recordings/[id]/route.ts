import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth.config';

interface RequestParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RequestParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    const lectureRecording = await prisma.lectureRecording.findUnique({
      where: { id },
    });

    if (!lectureRecording) {
      return NextResponse.json({ message: 'Lecture Recording not found' }, { status: 404 });
    }

    return NextResponse.json(lectureRecording);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RequestParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const body = await request.json();
  const { title, description, course, url } = body;

  try {
    const updatedLectureRecording = await prisma.lectureRecording.update({
      where: { id },
      data: {
        title,
        description,
        course,
        url,
      },
    });

    return NextResponse.json(updatedLectureRecording);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RequestParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    await prisma.lectureRecording.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Lecture Recording deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}