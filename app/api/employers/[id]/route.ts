import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  const { id } = params;

  try {
    const employer = await prisma.employer.findUnique({
      where: { id },
    });

    if (!employer) {
      return new NextResponse(JSON.stringify({ error: 'Employer not found' }), {
        status: 404,
      });
    }

    return NextResponse.json(employer);
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  const { id } = params;
  const { name, description } = await req.json();

  try {
    const employer = await prisma.employer.update({
      where: { id },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(employer);
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  const { id } = params;

  try {
    await prisma.employer.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Employer deleted' });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}