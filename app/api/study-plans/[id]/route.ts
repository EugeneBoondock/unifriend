import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  try {
    const studyPlan = await prisma.studyPlan.findUnique({
      where: { id },
    });
    if (!studyPlan) {
      return NextResponse.json({ message: 'Study plan not found' }, { status: 404 });
    }
    return NextResponse.json(studyPlan);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching study plan' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  const body = await req.json();
  const { name, description, course, startDate, endDate } = body;
  try {
    const studyPlan = await prisma.studyPlan.update({
      where: { id },
      data: {
        name,
        description,
        course,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });
    return NextResponse.json(studyPlan);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating study plan' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  try {
    await prisma.studyPlan.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Study plan deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting study plan' }, { status: 500 });
  }
}