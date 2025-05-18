import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/auth.config';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string, participantId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id, participantId } = params;

  if (!id || !participantId) {
    return NextResponse.json(
      { message: 'Event ID and participant ID are required' },
      { status: 400 }
    );
  }

  try {
    const protestEvent = await prisma.protestEvent.findUnique({
      where: { id },
      include: { participants: true },
    });

    if (!protestEvent) {
      return NextResponse.json(
        { message: 'Protest event not found' },
        { status: 404 }
      );
    }

        const participantToDelete = await prisma.protestParticipant.findUnique({
      where: { id: participantId },
    });

    if (!participantToDelete) {
        return NextResponse.json({ message: 'Participant not found' }, { status: 404 });
    }

    if (participantToDelete.eventId !== id) {
      return NextResponse.json(
        { message: 'Participant not found in this event' },
        { status: 404 }
      );
    }

    const deletedParticipant = await prisma.protestParticipant.delete({
        where: { id: participantId },
    });

    return NextResponse.json(deletedParticipant, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Could not delete participant' },
      { status: 500 }
    );
  }
}