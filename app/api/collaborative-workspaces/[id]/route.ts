import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

type Params = {
  params: { id: string };
};

export async function GET(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  try {
    const collaborativeWorkspace = await prisma.collaborativeWorkspace.findUnique({
      where: { id },
    });

    if (!collaborativeWorkspace) {
      return NextResponse.json({ message: 'Collaborative workspace not found' }, { status: 404 });
    }

    return NextResponse.json(collaborativeWorkspace, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const { name, description, course } = await req.json();

  try {
    const updatedCollaborativeWorkspace = await prisma.collaborativeWorkspace.update({
      where: { id },
      data: {
        name,
        description,
        course,
      },
    });

    return NextResponse.json(updatedCollaborativeWorkspace, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  try {
    const deletedCollaborativeWorkspace = await prisma.collaborativeWorkspace.delete({
      where: { id },
    });

    return NextResponse.json(deletedCollaborativeWorkspace, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}