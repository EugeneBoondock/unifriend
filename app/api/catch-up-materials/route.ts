import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth.config';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const catchUpMaterials = await prisma.catchUpMaterial.findMany();
    return NextResponse.json(catchUpMaterials);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching catch up materials', error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { title, description, course, url } = await req.json();

  if (!title || !description || !course || !url) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const newCatchUpMaterial = await prisma.catchUpMaterial.create({
      data: {
        title,
        description,
        course,
        url,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
    return NextResponse.json(newCatchUpMaterial, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating catch up material', error }, { status: 500 });
  }
}