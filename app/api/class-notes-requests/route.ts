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
    const classNotesRequests = await prisma.classNotesRequest.findMany({
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
    return new NextResponse(JSON.stringify(classNotesRequests), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }
  try {
    const { title, description, course } = await req.json();
    const classNotesRequest = await prisma.classNotesRequest.create({
      data: {
        title,
        description,
        course,
        userId: session.user.id,
      },
    });
    return new NextResponse(JSON.stringify(classNotesRequest), {
      status: 201,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}