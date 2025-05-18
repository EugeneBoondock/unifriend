import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth.config';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const postId = params.id;
  const userId = session.user.id;

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        authorId_postId: {
          authorId: userId,
          postId: postId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return NextResponse.json({ message: 'Post unliked' }, { status: 200 });
    } else {
      await prisma.like.create({
        data: {
          authorId: userId,
          postId: postId,
        },
      });
      return NextResponse.json({ message: 'Post liked' }, { status: 201 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}