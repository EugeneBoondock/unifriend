import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Post as PostType, Comment as CommentType } from "@prisma/client";
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import { useState, useEffect } from "react";
import { CommentList } from "./CommentList";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useSession } from "next-auth/react";

interface PostProps {
  post: PostType & {
    isLiked: boolean;
    likesCount: number;
    author: {
      id: string;
      name: string | null;
      image: string | null;
    };
    likes: any[];
    comments: any[];
  };
}


interface Like {
  authorId: string;
  postId: string;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [comments, setComments] = useState<
    (CommentType & { author: { name: string | null; image: string | null } })[]
  >([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const { data: session } = useSession();

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        console.error("Failed to fetch comments");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post.id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });
      if (response.ok) {
        setNewComment("");
        fetchComments();
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return session ? (
    <Card className="w-full">
      <CardHeader className="flex-row items-center space-y-0 pb-2">
        <Avatar>
          <AvatarImage src={post.author.image || ""} alt={post.author.name || "Author"} />
          <AvatarFallback>
            {post.author.name?.slice(0, 2) || "AU"}
          </AvatarFallback>
        </Avatar>
        <div className="pl-4">
          <CardTitle>{post.author.name}</CardTitle>
        </div>
      </CardHeader>
      {isEditing ? (
        <CardContent className="py-2">
          <div className="space-y-2">
            <Input
              type="text"
              value={post.title}
              className="text-lg font-semibold"
              disabled
            />
            <Input
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="text-sm text-muted-foreground"
            />
          </div>
        </CardContent>
      ) : (
        <CardContent className="py-2">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <p className="text-sm text-muted-foreground">{post.content}</p>
          </div>
        </CardContent>
      )}
      <CardFooter className="flex justify-between items-center space-x-2">
        {session.user?.id === post.author.id && (
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      const response = await fetch(`/api/posts/${post.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ content: editedContent }),
                      });
                      if (response.ok) {
                        setIsEditing(false);
                      }
                    } catch (error) {
                      console.error("Error updating post:", error);
                    }
                  }}
                >
                  Save
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      const response = await fetch(`/api/posts/${post.id}`, {
                        method: "DELETE",
                      });
                      if (response.ok) {
                        // You might want to handle post deletion in the parent component
                        console.log("Post deleted successfully");
                      }
                    } catch (error) {
                      console.error("Error deleting post:", error);
                    }
                  }}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              try {
                const response = await fetch(`/api/posts/${post.id}/like`, {
                  method: isLiked ? "DELETE" : "POST",
                });
                if (response.ok) {
                  setIsLiked(!isLiked);
                  setLikesCount(likesCount + (isLiked ? -1 : 1));
                }
              } catch (error) {
                console.error("Error liking post:", error);
              }
            }}
          >
            {isLiked ? "Unlike" : "Like"} ({likesCount})
          </Button>
          <Badge variant="outline">Comments: {comments.length}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {format(new Date(post.createdAt), "MMM dd, yyyy")}
        </p>
      </CardFooter>

      <CardContent className="py-2">
        <CommentList comments={comments} />

        <div className="mt-4">
          <Input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button
            onClick={handleAddComment}
            className="mt-2"
            disabled={!newComment.trim()}
          >
            Post Comment
          </Button>
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card className="w-full">
      <CardContent>
        <p>Please sign in to view and interact with this post.</p>
      </CardContent>
      {/* Display basic post info for non-signed-in users if needed */}
      <CardFooter>
          <p>Likes: {likesCount} Comments: {comments.length}</p>
          </div>
      </CardFooter>
    </Card>
  );
};

export default Post;