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
    const interviewPreparationResource = await prisma.interviewPreparationResource.findUnique({
      where: { id },
    });

    if (!interviewPreparationResource) {
      return NextResponse.json({ message: 'Interview preparation resource not found' }, { status: 404 });
    }

    return NextResponse.json(interviewPreparationResource);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching interview preparation resource' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const body = await req.json();
  const { title, description, fileUrl, category } = body;
  try {
    const updatedInterviewPreparationResource = await prisma.interviewPreparationResource.update({
      where: { id },
      data: {
        title,
        description,
        fileUrl,
        category,
      },
    });

    return NextResponse.json(updatedInterviewPreparationResource);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating interview preparation resource' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  try {
    const deletedInterviewPreparationResource = await prisma.interviewPreparationResource.delete({
      where: { id },
    });

    return NextResponse.json(deletedInterviewPreparationResource);
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting interview preparation resource' }, { status: 500 });
  }
}