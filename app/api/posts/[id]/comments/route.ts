import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/auth.config';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: 'Post ID is required' }, { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        likes: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: 'Post ID is required' }, { status: 400 });
  }

  const { content } = await req.json();

  if (!content) {
    return NextResponse.json({ message: 'Content is required' }, { status: 400 });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId: id,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Could not create comment' },
      { status: 500 }
    );
  }
}