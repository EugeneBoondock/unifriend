"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (status === "unauthenticated") {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Welcome, {session?.user?.name || "Student"}!</h2>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-md font-medium text-gray-700 mb-3">Your Account</h3>
            <p className="text-gray-600">Email: {session?.user?.email}</p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DashboardCard
              title="Community"
              description="Join discussions with other students"
              link="/community"
            />
            <DashboardCard
              title="Resources"
              description="Access study materials and guides"
              link="/resources"
            />
            <DashboardCard
              title="Mentorship"
              description="Connect with mentors or become one"
              link="/mentorship"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ title, description, link }: { title: string; description: string; link: string }) {
  return (
    <Link href={link} className="block">
      <div className="bg-white overflow-hidden shadow rounded-lg border hover:border-primary-300 transition-colors">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </Link>
  );
}
