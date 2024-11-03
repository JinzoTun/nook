import { useEffect, useState } from "react";
import axios from "axios";
import { PostCard } from "./PostCard";
import { Button } from "./ui/button";

interface Post {
  _id: string;
  title: string;
  body: string;
  author: {
    username: string;
    avatar: string;
  };
  votes: number;
  createdAt: string;
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchPosts = async (pageNumber: number) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/posts?page=${pageNumber}&limit=10`);
      console.log("API Response:", response.data);
      if (response.data.posts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
      } else {
        setHasMore(false); // No more posts to fetch
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const loadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

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
      {hasMore && (
        <Button onClick={loadMore}  className=" w-full mt-4">
          Load More
        </Button>
      )}
    </div>
  );
}
