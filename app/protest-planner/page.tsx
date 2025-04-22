import ProtestEventList from '@/components/protest/ProtestEventList';
import CreateProtestEventForm from '@/components/protest/CreateProtestEventForm';

export default async function ProtestPlannerPage() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/protest-events`);
  const protestEvents = await response.json();

  return (
    <div className="container py-8 md:py-12 pattern-container">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Protest Planner</h1>
          <CreateProtestEventForm />
        </div>
        <ProtestEventList protestEvents={protestEvents} />
      </div>
    </div>
  );
}