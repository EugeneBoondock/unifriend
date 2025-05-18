import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().optional(),
  course: z.string().min(2).max(50),
});
interface CreateCollaborativeWorkspaceFormProps {
  
}
const CreateCollaborativeWorkspaceForm: React.FC<CreateCollaborativeWorkspaceFormProps> = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
      description: "",
      course: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/collaborative-workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Collaborative workspace created.",
        });
        window.location.reload();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create collaborative workspace.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <Input placeholder="Workspace Name" {...form.register("name")} />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <Input placeholder="Description" {...form.register("description")} />
      </div>
      <div>
        <label htmlFor="course">Course</label>
        <Input placeholder="Course" {...form.register("course")} />
      </div>
      <Button type="submit">Create Workspace</Button>
    </form>
  );
};
export default CreateCollaborativeWorkspaceForm;