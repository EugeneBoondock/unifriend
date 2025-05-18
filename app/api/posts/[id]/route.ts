import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth.config';
import { prisma } from '@/lib/prisma';

type Params = {
  params: {
    id: string;
  };
};

export async function GET(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: 'Post ID is required' }, { status: 400 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
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
    });

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const postWithAdditionalInfo = {
      ...post,
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      isLiked: post.likes.some(like => like.authorId === session.user.id),
      isAuthor: post.authorId === session.user.id,
    };

    return NextResponse.json(postWithAdditionalInfo, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const { title, content } = await req.json();

  if (!id) {
    return NextResponse.json({ message: 'Post ID is required' }, { status: 400 });
  }

  if (!title || !content) {
    return NextResponse.json(
      { message: 'Title and content are required' },
      { status: 400 }
    );
  }

  try {
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    if (existingPost.authorId !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { title, content },
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Could not update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: 'Post ID is required' }, { status: 400 });
  }

  try {
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    if (existingPost.authorId !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Post deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Could not delete post' },
      { status: 500 }
    );
  }
}