"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import Image from "next/image";

const Sidebar = () => {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-100 border-r border-gray-200 flex flex-col">
      <div className="p-4 flex justify-center">
        <Link href="/" className="inline-block">
          <Image
            src="/images/unifriend.png"
            alt="UniFriend Logo"
            width={150}
            height={50}
            className="object-contain"
          />
        </Link>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link href="/" className="block p-2 hover:bg-gray-200 rounded-md">
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className="block p-2 hover:bg-gray-200 rounded-md"
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard"
              className="block p-2 hover:bg-gray-200 rounded-md"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/protest-planner"
              className="block p-2 hover:bg-gray-200 rounded-md"
            >
              Protest Planner
            </Link>
          </li>
          <li>
            <Link
              href="/library"
              className="block p-2 hover:bg-gray-200 rounded-md"
            >
              Library
            </Link>
          </li>
          <li>
            <Link
              href="/business-ads"
              className="block p-2 hover:bg-gray-200 rounded-md"
            >
              Business Ads
            </Link>
          </li>
          <li>
            <Link
              href="/help-a-student"
              className="block p-2 hover:bg-gray-200 rounded-md"
            >
              Help A Student
            </Link>
          </li>
          <li>
            <Link
              href="/resources"
              className="block p-2 hover:bg-gray-200 rounded-md"
            >
              Resource Sharing
            </Link>
          </li>
          <li>
            <Link
              href="/exam-preparation"
              className="block p-2 hover:bg-gray-200 rounded-md"
            >
              Exam Preparation
            </Link>
          </li>
          <li>
            <Link
              href="/i-skipped-class"
              className="block p-2 hover:bg-gray-200 rounded-md"
            >
              I Skipped Class
            </Link>
          </li>
          <li>
            <Link
              href="/assignment-playground"
              className="block p-2 hover:bg-gray-200 rounded-md"
            >
              Assignment Playground
            </Link>
          </li>
          <li>
            <Link
              href="/employment-recommendations"
              className="block p-2 hover:bg-gray-200 rounded-md"
            >
              Employment Recommendations
            </Link>
          </li>
          <li>
            <Link
              href="/univendors"
              className="block p-2 hover:bg-gray-200 rounded-md"
            >
              UniVendors
            </Link>
          </li>
          <li>
            <Link
              href="/unicircle"
              className="block p-2 hover:bg-gray-200 rounded-md"
            >
              UniCircle
            </Link>
          </li>
          <li>
            <Link
              href="/unishare"
              className="block p-2 hover:bg-gray-200 rounded-md"
            >
              UniShare
            </Link>
          </li>
          <li>
            <Link
              href="/events"
              className="block p-2 hover:bg-gray-200 rounded-md"
            >
              Events
            </Link>
          </li>
          <li>
            <Link
              href="/verification-requests"
              className="block p-2 hover:bg-gray-200 rounded-md"
            >
              Verification Requests
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;