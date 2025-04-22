import { VerificationRequestList } from "@/components/protest-planner/VerificationRequestList";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

async function getVerificationRequests() {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/verification