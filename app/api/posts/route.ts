import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth.config';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    let posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        likes: true,
        comments: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    posts = posts.map(post => ({
      ...post,
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      isLiked: post.likes.some(like => like.authorId === session.user.id),
      isAuthor: post.authorId === session.user.id,
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { title, content } = await req.json();

  if (!title || !content) {
    return NextResponse.json(
      { message: 'Title and content are required' },
      { status: 400 }
    );
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Could not create post' },
      { status: 500 }
    );
  }
}