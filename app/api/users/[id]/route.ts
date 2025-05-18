import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    });
  }

  const { id } = params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ message: 'User not found' }), {
        status: 404,
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
    });
  }
}