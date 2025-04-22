import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CreatePracticeTestFormProps {}

const CreatePracticeTestForm: React.FC<CreatePracticeTestFormProps> = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [duration, setDuration] = useState<number | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/practice-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          course,
          duration,
        }),
      });

      if (response.ok) {
        router.refresh();
        setName('');
        setDescription('');
        setCourse('');
        setDuration(null);
      } else {
        console.error('Failed to create practice test');
      }
    } catch (error) {
      console.error('Error creating practice test:', error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Practice Test</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="course" className="text-right">
              Course
            </Label>
            <Input
              id="course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Duration
            </Label>
            <Input
              id="duration"
              type="number"
              value={duration !== null ? duration.toString() : ''}
              onChange={(e) => setDuration(e.target.value === '' ? null : parseInt(e.target.value))}
              className="col-span-3"
            />
          </div>
          <Button type="submit" className="ml-auto">
            Create
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePracticeTestForm;