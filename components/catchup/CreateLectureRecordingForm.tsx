import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CreateLectureRecordingFormProps {}

const CreateLectureRecordingForm: React.FC<CreateLectureRecordingFormProps> = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [url, setUrl] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/lecture-recordings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, course, url }),
      });

      if (response.ok) {
        setTitle('');
        setDescription('');
        setCourse('');
        setUrl('');
        router.refresh();
      } else {
        console.error('Failed to create lecture recording');
      }
    } catch (error) {
      console.error('Error creating lecture recording:', error);
    }
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle>Create Lecture Recording</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                    <Input
                    id="course"
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="url">URL</Label>
                    <Input
                    id="url"
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    />
                </div>
                <Button type="submit">Create</Button>
            </form>
        </CardContent>
    </Card>
  );
};

export default CreateLectureRecordingForm;