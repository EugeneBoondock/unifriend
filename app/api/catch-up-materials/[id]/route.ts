import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { prisma } from '@/lib/prisma';

interface Params {
  id: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    const catchUpMaterial = await prisma.catchUpMaterial.findUnique({
      where: { id },
    });

    if (!catchUpMaterial) {
      return NextResponse.json({ message: 'Catch up material not found' }, { status: 404 });
    }

    return NextResponse.json(catchUpMaterial);
  } catch (error) {
    console.error('Error fetching catch up material:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const body = await req.json();

  const { title, description, course, url } = body;

  try {
    const updatedCatchUpMaterial = await prisma.catchUpMaterial.update({
      where: { id },
      data: {
        title,
        description,
        course,
        url,
      },
    });

    return NextResponse.json(updatedCatchUpMaterial);
  } catch (error) {
    console.error('Error updating catch up material:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    await prisma.catchUpMaterial.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Catch up material deleted' });
  } catch (error) {
    console.error('Error deleting catch up material:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}