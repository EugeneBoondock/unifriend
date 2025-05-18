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
    const protestEvents = await prisma.protestEvent.findMany({
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        participants: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const updatedProtestEvents = protestEvents.map(event => ({
      ...event,
      organizer: {
        ...event.organizer,
        verified: event.organizer.verified ?? false,
      }
    }));
    return NextResponse.json(updatedProtestEvents, { status: 200 });
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

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    }
  })

  if (!user?.verified) {
    return NextResponse.json({ message: 'Only verified users can create protest events' }, { status: 403 });
  }

  const { title, description, location, startDate, endDate, safetyGuidelines, phoneNumber, bankAccountDetails } = await req.json();

  if (!user?.verified) {
    return NextResponse.json(
      { message: 'Only verified users can create protest events' },
      { status: 403 })
  }

  if (!title || !startDate) {
    return NextResponse.json(
      { message: 'Title and startDate are required' },
      { status: 400 }
    );
  }

  try {
    const protestEvent = await prisma.protestEvent.create({
      data: {
        title,
        description,
        location,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        safetyGuidelines,
        phoneNumber,
        bankAccountDetails,
        organizerId: session.user.id,
      },
    });

    return NextResponse.json(protestEvent, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Could not create protest event' },
      { status: 500 }
    );
  }
}