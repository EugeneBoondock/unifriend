import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const reservations = await prisma.reservation.findMany( {
        where: {
            userId: session.user.id,
            returned: false
        },
        include: {
            book: true,
        }

    });
    return new NextResponse(JSON.stringify(reservations), { status: 200 });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const body = await req.json();
    const { userId, bookId } = body;

    if (!userId || !bookId) {
      return new NextResponse(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
    }

    const reservation = await prisma.reservation.create({
      data: {
        userId,
        bookId,
      },
      include: {
        user: true,
        book: true,
      },
    });
    return new NextResponse(JSON.stringify(reservation), { status: 201 });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}