import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    const practiceTest = await prisma.practiceTest.findUnique({
      where: { id },
    });

    if (!practiceTest) {
      return NextResponse.json({ message: 'Practice test not found' }, { status: 404 });
    }

    return NextResponse.json(practiceTest);
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const body = await request.json();
  const { name, description, course, duration } = body;

  try {
    const practiceTest = await prisma.practiceTest.update({
      where: { id },
      data: {
        name,
        description,
        course,
        duration,
      },
    });

    return NextResponse.json(practiceTest);
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    await prisma.practiceTest.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Practice test deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}