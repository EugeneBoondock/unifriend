"use client";
import React, { useEffect, useState } from "react";
import ClassNotesRequestList from "@/components/catchup/ClassNotesRequestList";
import CreateClassNotesRequestForm from "@/components/catchup/CreateClassNotesRequestForm";
import LectureRecordingList from "@/components/catchup/LectureRecordingList";
import CreateLectureRecordingForm from "@/components/catchup/CreateLectureRecordingForm";
import CatchUpMaterialList from "@/components/catchup/CatchUpMaterialList";
import CreateCatchUpMaterialForm from "@/components/catchup/CreateCatchUpMaterialForm";

export interface ClassNotesRequest {
  id: string;
  title: string;
  description: string | null;
  course: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface LectureRecording {
  id: string;
  title: string;
  description: string | null;
  course: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CatchUpMaterial {
  id: string;
  title: string;
  description: string | null;
  course: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

const ISkippedClassPage: React.FC = () => {
  const [classNotesRequests, setClassNotesRequests] = useState<
    ClassNotesRequest[]
  >([]);
  const [lectureRecordings, setLectureRecordings] = useState<
    LectureRecording[]
  >([]);
  const [catchUpMaterials, setCatchUpMaterials] = useState<
    CatchUpMaterial[]
  >([]);

  useEffect(() => {
    const fetchClassNotesRequests = async () => {
      const response = await fetch("/api/class-notes-requests");
      const data = await response.json();
      setClassNotesRequests(data);
    };

    const fetchLectureRecordings = async () => {
      const response = await fetch("/api/lecture-recordings");
      const data = await response.json();
      setLectureRecordings(data);
    };

    const fetchCatchUpMaterials = async () => {
      const response = await fetch("/api/catch-up-materials");
      const data = await response.json();
      setCatchUpMaterials(data);
    };

    fetchClassNotesRequests();
    fetchLectureRecordings();
    fetchCatchUpMaterials();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">I Skipped Class</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Class Notes Requests</h2>
        <CreateClassNotesRequestForm />
        <ClassNotesRequestList classNotesRequests={classNotesRequests} />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Lecture Recordings</h2>
        <CreateLectureRecordingForm />
        <LectureRecordingList lectureRecordings={lectureRecordings} />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Catch Up Materials</h2>
        <CreateCatchUpMaterialForm />
        <CatchUpMaterialList catchUpMaterials={catchUpMaterials} />
      </section>
    </div>
  );
};

export default ISkippedClassPage;