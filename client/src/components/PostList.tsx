import { useEffect, useState } from "react";
import axios from "axios";
import { PostCard } from "./PostCard";

// types/Post.ts (or wherever you prefer)
interface Post {
  _id: string; // Assuming you have an id for each post
  title: string;
  body: string;
  author: {
    username: string;
    avatar: string;
  };
  votes: number; // Assuming you have a votes count
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]); // Initialize as an empty array
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/posts"); // Ensure this is your endpoint
        console.log("API Response:", response.data); // Log the response for debugging
        setPosts(response.data.posts); // Adjust based on your response structure
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
