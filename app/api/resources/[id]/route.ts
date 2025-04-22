import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  const { id } = params;

  try {
    const resource = await prisma.resource.findUnique({
      where: { id },
    });

    if (!resource) {
      return new NextResponse(JSON.stringify({ error: 'Resource not found' }), {
        status: 404,
      });
    }

    return NextResponse.json(resource);
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
  
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  const { id } = params;
  const body = await req.json();
  const { title, description, fileUrl, category, university, course } = body;

  try {
    const resource = await prisma.resource.update({
      where: { id },
      data: {
        title,
        description,
        fileUrl,
        category,
        university,
        course,
      },
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  const { id } = params;

  try {
    await prisma.resource.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}