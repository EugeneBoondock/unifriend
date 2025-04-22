"use client";

import React from 'react';

import StudyPlanList from '@/components/exam/StudyPlanList';
import PracticeTestList from '@/components/exam/PracticeTestList';
import StudySessionList from '@/components/exam/StudySessionList';
import CreateStudyPlanForm from '@/components/exam/CreateStudyPlanForm';
import CreatePracticeTestForm from '@/components/exam/CreatePracticeTestForm';
import CreateStudySessionForm from '@/components/exam/CreateStudySessionForm';

interface StudyPlan {
  id: string;
  name: string;
  description: string;
  course: string;
  startDate: Date;
  endDate: Date;
}

interface PracticeTest {
  id: string;
  name: string;
  description: string;
  course: string;
  duration: number;
}

interface StudySession {
  id: string;
  name: string;
  description: string;
  course: string;
  location: string;
  date: Date;
  duration: number;
}

const ExamPreparationPage = () => {
  const [studyPlans, setStudyPlans] = React.useState<StudyPlan[]>([]);
  const [practiceTests, setPracticeTests] = React.useState<PracticeTest[]>([]);
  const [studySessions, setStudySessions] = React.useState<StudySession[]>([]);

  React.useEffect(() => {
    const fetchStudyPlans = async () => {
      const response = await fetch('/api/study-plans');
      const data = await response.json();
      setStudyPlans(data);
    };

    const fetchPracticeTests = async () => {
      const response = await fetch('/api/practice-tests');
      const data = await response.json();
      setPracticeTests(data);
    };

    const fetchStudySessions = async () => {
      const response = await fetch('/api/study-sessions');
      const data = await response.json();
      setStudySessions(data);
    };

    fetchStudyPlans();
    fetchPracticeTests();
    fetchStudySessions();
  }, []);

  return (
    
    <h1>Exam Preparation</h1>
    
      
        <h2>Study Plans</h2>
        <CreateStudyPlanForm />
        <StudyPlanList studyPlans={studyPlans} />
      
      
        <h2>Practice Tests</h2>
        <CreatePracticeTestForm />
        <PracticeTestList practiceTests={practiceTests} />
      
      
        <h2>Study Sessions</h2>
        <CreateStudySessionForm />
        <StudySessionList studySessions={studySessions} />
      
    
  );
};

export default ExamPreparationPage;