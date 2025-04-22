import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().optional(),
  course: z.string().min(2).max(50),
  fileUrl: z.string().url(),
});

type FormSchema = z.infer<typeof formSchema>;

export function CreateAssignmentTemplateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      course: '',
      fileUrl: '',
    },
  });

  async function onSubmit(values: FormSchema) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/assignment-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        // toast({
        //   title: 'Success',
        //   description: 'Assignment template created successfully.',
        // });
        router.refresh();
        form.reset();
      } else {
        // toast({
        //   variant: 'destructive',
        //   title: 'Error',
        //   description: 'Failed to create assignment template.',
        // });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create assignment template.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <label htmlFor="name">Name</label>
        <Input id="name" placeholder="Template name" {...form.register('name')} />
        {form.formState.errors.name && <span>{form.formState.errors.name.message}</span>}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <Textarea
          id="description"
          placeholder="Template description"
          {...form.register('description')}
        />
        {form.formState.errors.description && <span>{form.formState.errors.description.message}</span>}
      </div>

      <div>
        <label htmlFor="course">Course</label>
        <Input
          id="course"
          placeholder="Related course"
          {...form.register('course')}
        />
        {form.formState.errors.course && <span>{form.formState.errors.course.message}</span>}
      </div>

      <div>
        <label htmlFor="fileUrl">File URL</label>
        <Input
          id="fileUrl"
          placeholder="File URL"
          {...form.register('fileUrl')}
        />
        {form.formState.errors.fileUrl && <span>{form.formState.errors.fileUrl.message}</span>}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Create'}
      </Button>
    </form>
  );
}