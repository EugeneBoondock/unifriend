"use client";
import React, { useState, useEffect } from 'react';
import { CollaborativeWorkspaceList } from '@/components/assignment/CollaborativeWorkspaceList';
import { AssignmentTemplateList } from '@/components/assignment/AssignmentTemplateList';
import { PeerReviewList } from '@/components/assignment/PeerReviewList';
import { CreateCollaborativeWorkspaceForm } from '@/components/assignment/CreateCollaborativeWorkspaceForm';
import { CreateAssignmentTemplateForm } from '@/components/assignment/CreateAssignmentTemplateForm';
import { CreatePeerReviewForm } from '@/components/assignment/CreatePeerReviewForm';

interface CollaborativeWorkspace {
  id: string;
  name: string;
  description: string;
  course: string;
  ownerId:string;
  createdAt: Date;
  updatedAt:Date;
}

interface AssignmentTemplate {
  id: string;
  name: string;
  description: string;
  course: string;
  fileUrl: string;
  authorId:string;
  createdAt: Date;
  updatedAt:Date;
}

interface PeerReview {
  id: string;
  comment: string;
  rating: number;
  reviewerId:string;
  createdAt: Date;
  updatedAt:Date;
}

const AssignmentPlaygroundPage = () => {
  const [collaborativeWorkspaces, setCollaborativeWorkspaces] = useState<CollaborativeWorkspace[]>([]);
  const [assignmentTemplates, setAssignmentTemplates] = useState<AssignmentTemplate[]>([]);
  const [peerReviews, setPeerReviews] = useState<PeerReview[]>([]);

  useEffect(() => {
    const fetchCollaborativeWorkspaces = async () => {
      const response = await fetch('/api/collaborative-workspaces');
      const data = await response.json();
      setCollaborativeWorkspaces(data);
    };

    const fetchAssignmentTemplates = async () => {
      const response = await fetch('/api/assignment-templates');
      const data = await response.json();
      setAssignmentTemplates(data);
    };

    const fetchPeerReviews = async () => {
      const response = await fetch('/api/peer-reviews');
      const data = await response.json();
      setPeerReviews(data);
    };

    fetchCollaborativeWorkspaces();
    fetchAssignmentTemplates();
    fetchPeerReviews();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Assignment Playground</h1>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Collaborative Workspaces</h2>
        <CreateCollaborativeWorkspaceForm />
        <CollaborativeWorkspaceList collaborativeWorkspaces={collaborativeWorkspaces} />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Assignment Templates</h2>
        <CreateAssignmentTemplateForm />
        <AssignmentTemplateList assignmentTemplates={assignmentTemplates} />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Peer Reviews</h2>
        <CreatePeerReviewForm />
        <PeerReviewList peerReviews={peerReviews} />
      </section>
    </div>
  );
};

export default AssignmentPlaygroundPage;