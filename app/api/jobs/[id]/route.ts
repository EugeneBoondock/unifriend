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
    const job = await prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      return new NextResponse(JSON.stringify({ error: 'Job not found' }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(job), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
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
  const body = await req.json();
  const { title, description, company, location, salary, category } = body;

  try {
    const job = await prisma.job.update({
      where: { id },
      data: {
        title,
        description,
        company,
        location,
        salary,
        category,
      },
    });

    return new NextResponse(JSON.stringify(job), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
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
    await prisma.job.delete({
      where: { id },
    });

    return new NextResponse(JSON.stringify({ message: 'Job deleted' }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}