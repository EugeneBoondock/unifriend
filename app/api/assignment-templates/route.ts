import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const assignmentTemplates = await prisma.assignmentTemplate.findMany();
    return NextResponse.json(assignmentTemplates);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching assignment templates' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { name, description, course, fileUrl } = body;
    const newAssignmentTemplate = await prisma.assignmentTemplate.create({
      data: {
        name,
        description,
        course,
        fileUrl,
        authorId: session.user.id,
      },
    });
    return NextResponse.json(newAssignmentTemplate, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating assignment template' }, { status: 500 });
  }
}