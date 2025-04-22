import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

const formSchema = z.object({\n  comment: z.string().min(2, { message: 'Comment must be at least 2 characters.' }),\n  rating: z.number().min(1).max(5),\n});

export function CreatePeerReviewForm() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
      rating: 1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await fetch("/api/peer-reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      toast({
        title: "Success",
        description: "Peer review created.",
      });

      form.reset();
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong.",
      });
    }
  }

  return (\n    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">\n      <div>\n        <label htmlFor="comment">Comment</label>\n        <Textarea id="comment" placeholder="Write a comment" {...register('comment')} />\n        {errors.comment && <span>{errors.comment.message}</span>}\n      </div>\n      <div>\n        <label htmlFor="rating">Rating</label>\n        <Input\n          type="number"\n          id="rating"\n          defaultValue={1}\n          min={1}\n          max={5}\n          {...register('rating', { valueAsNumber: true })}\n        />\n        {errors.rating && <span>{errors.rating.message}</span>}\n      </div>\n      <Button type="submit">Submit</Button>\n    </form>\n  );\n}
}