import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

interface Context {
  params: { id: string };
}

export async function GET(req: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = context.params;
  try {
    const resume = await prisma.resume.findUnique({
      where: { id },
    });

    if (!resume) {
      return NextResponse.json({ message: 'Resume not found' }, { status: 404 });
    }

    return NextResponse.json(resume);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching resume' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = context.params;
  const body = await req.json();
  const { content } = body;

  try {
    const resume = await prisma.resume.update({
      where: { id },
      data: { content },
    });

    return NextResponse.json(resume);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating resume' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = context.params;
  try {
    await prisma.resume.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Resume deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting resume' }, { status: 500 });
  }
}