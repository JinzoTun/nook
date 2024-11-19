import { useEffect, useState } from "react";
import axios from "axios";
import { PostCard } from "./PostCard";
import { Button } from "./ui/button";

interface Post {
  _id: string;
  title: string;
  body: string;
  author: {
    _id: string;
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
  const loadedPages = new Set<number>(); // Set to track loaded pages

  const fetchPosts = async (pageNumber: number) => {
    if (loadedPages.has(pageNumber) || !hasMore) return; // Skip if page already loaded or no more posts

    try {
      const response = await axios.get(`http://localhost:3000/api/posts?page=${pageNumber}&limit=10`);
      loadedPages.add(pageNumber); // Mark this page as loaded

      if (response.data.posts.length > 0) {
        setPosts((prevPosts) => [
          ...prevPosts,
          ...response.data.posts.filter(
            (newPost: Post) => !prevPosts.some((existingPost) => existingPost._id === newPost._id)
          )
        ]);
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

  const loadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled to the bottom of the page
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const bottomPosition = document.documentElement.scrollHeight;

      if (scrollPosition >= bottomPosition - 100 && hasMore) {
        loadMore(); // Trigger load more when close to bottom
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup event listener on unmount
    };
  }, [hasMore]);

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
        <Button onClick={loadMore} className="w-full mt-4">
          Load More
        </Button>
      )}
    </div>
  );
}
