import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import PostComment from "@/api/PostComment";
import { Comment , NewComment } from "@/interfaces/interfaces";
import { formatDate } from "@/utils/formatDate"; 







export default function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState<string>("");

  // Fetch comments when the component mounts or when postId changes
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/comments/${postId}`, {
        headers: { token: localStorage.getItem("token") || "" }
      })
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => console.error("Error fetching comments:", error));
  }, [postId]);

  const handleCommentSubmit = async () => {
    if (!content) return; // Prevent empty comments

    const newComment: NewComment = {
      userId: localStorage.getItem("token") || "",
      postId: postId,
      content: content,
    };



    try {
      await PostComment(newComment);
      setContent(""); // Clear input field

      // Re-fetch comments to get the updated list with author details
      const response = await axios.get(`http://localhost:3000/api/comments/${postId}`, {
        headers: { token: localStorage.getItem("token") || "" }
      });
      setComments(response.data);
      
    } catch (error) {
      console.error("Error posting comment:", error);
    }
};


  const handleDeleteComment = async (commentId: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/comments/${commentId}`, {
        headers: { token: localStorage.getItem("token")  }
      });

      // Remove the deleted comment from the list
      setComments(comments.filter((comment) => comment._id !== commentId));
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
        <Button variant="secondary"  type="submit">
          Comment
        </Button>
      </form>

      {/* Render comments if there are any */}

      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} className="m-4 flex gap-2 items-center">
            <img
              src={comment.author.avatar}
              alt="avatar"
              className="w-7 h-7 rounded-full"
            />
            <div>
              <p className="text-sm">{comment.author.username}     <span className="text-xs opacity-50">
                {formatDate(comment.createdAt)}
              </span></p>

         
              <p className="text-xs italic">{comment.content}</p>
            </div>
            <Button className="p-2 flex " variant={"destructive"} onClick={() => handleDeleteComment(comment._id)}> delete</Button>


          </div>

        ))
      ) : (
        <p className="m-4 opacity-50 text-xs">No comments yet</p>
      )}
    </div>
  );
}
