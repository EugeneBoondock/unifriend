import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
  const { image } = await req.json();

  if (!image) {
    return new NextResponse(JSON.stringify({ message: "Image is required" }), {
      status: 400,
    });
  }

  try {
    const verificationRequest = await prisma.verificationRequest.create({
      data: {
        image,
        userId: session.user.id,
      },
    });
    return new NextResponse(JSON.stringify(verificationRequest), {
      status: 201,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error creating verification request" }),
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  if (session.user.email !== process.env.ADMIN_EMAIL) {
    return new NextResponse(JSON.stringify({ message: "Forbidden" }), {
      status: 403,
    });
  }

  try {
    const verificationRequests = await prisma.verificationRequest.findMany();
    return new NextResponse(JSON.stringify(verificationRequests), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error getting verification requests" }),
      { status: 500 }
    );
  }
}