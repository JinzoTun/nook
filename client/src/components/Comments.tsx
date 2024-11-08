import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import PostComment from "@/api/PostComment";

interface Comment {
  _id: string;
  author: {
    username: string;
    avatar: string;
  };
  content: string;
}

interface NewComment {
  userId : string;
  postId: string;
  content: string;
}

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


  return (
    <div className="w-full">
      <div className="m-4 flex gap-2 justify-center items-center">
        <Input
          placeholder="Comment..."
          className="flex justify-center items-center w-full m-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button variant="secondary" onClick={handleCommentSubmit}>
          Comment
        </Button>
      </div>

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
              <p className="text-sm">{comment.author.username}</p>
              <p className="text-xs italic">{comment.content}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="m-4 opacity-50 text-xs">No comments yet</p>
      )}
    </div>
  );
}
