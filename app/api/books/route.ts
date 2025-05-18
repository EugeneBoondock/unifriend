import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const books = await prisma.book.findMany();
    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching books' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, author, description, coverUrl, category } = body;

    if (!title || !author) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        description,
        coverUrl,
        category,
      },
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating book' }, { status: 500 });
  }
}