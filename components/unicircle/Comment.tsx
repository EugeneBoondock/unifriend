import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Comment as CommentType } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface CommentProps {
  comment: CommentType & {
    author: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    };
  };
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  return (
    <CommentContent comment={comment} />
  );
};

const CommentContent: React.FC<CommentProps> = ({ comment }) => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);

  const handleEdit = async () => {
    if (content.trim() === "") return;

    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        setIsEditing(false);
        // Update the comment content in the UI or refresh comments
      } else {
        console.error("Failed to update comment");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the comment from the UI or refresh comments
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="w-full">
      <CardHeader className="flex-row items-start space-x-4 pb-2">
        <Avatar>
          <AvatarImage
            src={comment.author.image || ""}
            alt={comment.author.name || "Author"}
          />
          <AvatarFallback>
            {comment.author.name?.slice(0, 2) || "AU"}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium">{comment.author.name}</CardTitle>
          {isEditing ? (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-20 text-sm"
            />
          ) : (
            <CardContent className="py-2 px-0">
              <p className="text-sm text-muted-foreground">{comment.content}</p>
            </CardContent>
          )}
        </div>
      </CardHeader>
      {session?.user?.email === comment.author.email && (
        <CardFooter className="flex justify-end gap-2">
          {isEditing ? (
            <Button size="sm" onClick={handleEdit}>Save</Button>
          ) : (
            <>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={handleDelete}>Delete</Button>
            </>
          )}
        </CardFooter>
      )}
    </div>
  );
};

export default Comment;