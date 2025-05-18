import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const id = params.id;
  const { status } = await req.json();

  try {
    const verificationRequest = await prisma.verificationRequest.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });

    if (status === "approved") {
        await prisma.user.update({
            where: {
                id: verificationRequest.userId,
            },
            data: {
                verified: true,
            }
        })
    }

    return NextResponse.json(verificationRequest, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Could not update verification request" },
      { status: 500 }
    );
  }
}