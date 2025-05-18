import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CreateCatchUpMaterialFormProps {}

const CreateCatchUpMaterialForm: React.FC<CreateCatchUpMaterialFormProps> = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/catch-up-materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, course, url }),
      });

      if (response.ok) {
        router.refresh();
        setTitle('');
        setDescription('');
        setCourse('');
        setUrl('');
      } else {
        console.error('Failed to create catch up material');
      }
    } catch (error) {
      console.error('Error creating catch up material:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle>Create Catch Up Material</CardTitle>
        </CardHeader>
        <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                />
            </div>
            <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="course">Course</Label>
                <Input
                id="course"
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
                />
            </div>
            <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="url">URL</Label>
                <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                />
            </div>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create'}
            </Button>
        </form>
        </CardContent>
    </Card>
  );
};

export default CreateCatchUpMaterialForm;