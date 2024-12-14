import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Comment } from "@/interfaces/interfaces";
import { formatDate } from "@/utils/formatDate";
import { createComment, fetchComments, deleteComment } from "@/api/Comment";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState<string>("");

  // Fetch comments when the component mounts or when postId changes
  useEffect(() => {
    const fetchCommentsData = async () => {
      try {
        const response = await fetchComments(postId);
        setComments(response.data); // Use response.data as your API returns it
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchCommentsData();
  }, [postId]);

  // Handle comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    const newComment = { userId: token, postId, content };

    try {
      await createComment(newComment);
      const response = await fetchComments(postId); // Refresh comments after submission
      setComments(response.data);
      setContent(""); // Clear input field
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (commentId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    try {
      await deleteComment(commentId, postId, token);
      const response = await fetchComments(postId); // Refresh comments after deletion
      setComments(response.data);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleCommentSubmit} className="m-4 flex gap-2 justify-center items-center">
        <Input
          placeholder="Comment..."
          className="flex justify-center items-center w-full m-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button variant="secondary" type="submit">
          Comment
        </Button>
      </form>

      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} className="m-4 flex gap-2 items-center justify-between">
        
        <div className="flex gap-2 items-center">
            <img
              src={comment.author.avatar}
              alt="avatar"
              className="w-7 h-7 rounded-full"
            />
            <div>
              <p className="text-sm">
                {comment.author.username}{" "}
                <span className="text-xs opacity-50">{formatDate(comment.createdAt)}</span>
              </p>
              <p className="text-xs italic">{comment.content}</p>
            </div>
            </div>
    

            <DropdownMenu>
              <DropdownMenuTrigger>
                <BsThreeDotsVertical className="w-5 h-5 cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                {comment.author._id === localStorage.getItem("userId") && (
                  <DropdownMenuItem onClick={() => handleDeleteComment(comment._id)}>
                    Delete
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem>Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        ))
      ) : (
        <p className="m-4 opacity-50 text-xs">No comments yet</p>
      )}
    </div>
  );
}
