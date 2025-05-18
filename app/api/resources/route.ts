import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resources = await prisma.resource.findMany({
      include: {
        author: true,
      },
    });

    return NextResponse.json(resources, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { title, description, fileUrl, category, university, course } = await req.json();

  if (!title || !fileUrl || !category) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const newResource = await prisma.resource.create({
      data: {
        title,
        description,
        fileUrl,
        category,
        university,
        course,
        authorId: session.user.id,
      },
    });
    return NextResponse.json(newResource, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}