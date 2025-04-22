import { CreateEmployerForm } from "@/components/employment/CreateEmployerForm";
import { CreateInterviewPreparationResourceForm } from "@/components/employment/CreateInterviewPreparationResourceForm";
import { CreateJobForm } from "@/components/employment/CreateJobForm";
import { CreateResumeForm } from "@/components/employment/CreateResumeForm";
import { EmployerList } from "@/components/employment/EmployerList";
import { InterviewPreparationResourceList } from "@/components/employment/InterviewPreparationResourceList";
import { JobList } from "@/components/employment/JobList";
import { ResumeList } from "@/components/employment/ResumeList";

async function getData() {
  const jobsResponse = await fetch(process.env.NEXT_PUBLIC_URL + "/api/jobs", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  const resumesResponse = await fetch(process.env.NEXT_PUBLIC_URL + "/api/resumes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  const interviewPreparationResourcesResponse = await fetch(process.env.NEXT_PUBLIC_URL + "/api/interview-preparation-resources", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  const employersResponse = await fetch(process.env.NEXT_PUBLIC_URL + "/api/employers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!jobsResponse.ok || !resumesResponse.ok || !interviewPreparationResourcesResponse.ok || !employersResponse.ok) {
    throw new Error("Failed to fetch data");
  }
  const jobs = await jobsResponse.json();
  const resumes = await resumesResponse.json();
  const interviewPreparationResources = await interviewPreparationResourcesResponse.json();
  const employers = await employersResponse.json();
  return {
    jobs,
    resumes,
    interviewPreparationResources,
    employers,
  };
}

export default async function EmploymentRecommendationsPage() {
  const { jobs, resumes, interviewPreparationResources, employers } = await getData();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Employment Recommendations</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Jobs</h2>
        <CreateJobForm />
        <JobList jobs={jobs} />
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Resumes</h2>
        <CreateResumeForm />
        <ResumeList resumes={resumes} />
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Interview Preparation Resources</h2>
        <CreateInterviewPreparationResourceForm />
        <InterviewPreparationResourceList interviewPreparationResources={interviewPreparationResources} />
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Employers</h2>
        <CreateEmployerForm />
        <EmployerList employers={employers} />
      </div>
    </div>
  );
}