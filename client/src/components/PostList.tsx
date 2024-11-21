import { useEffect, useState, useRef } from "react";
import { PostCard } from "./PostCard";
import { Post } from "../interfaces/interfaces";
import { fetchAllPosts } from "../api/Post";
import { Loading } from "./ui/Loading"; // Import the new Loading component

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomElementRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = async (currentPage: number) => {
    setLoading(true);
    try {
      const newPosts = await fetchAllPosts(currentPage, 10);
      if (newPosts.length > 0) {
        setPosts((prevPosts) => [
          ...prevPosts,
          ...newPosts.filter(
            (newPost) => !prevPosts.some((existingPost) => existingPost._id === newPost._id)
          ),
        ]);
      } else {
        setHasMore(false); // No more posts to fetch
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!bottomElementRef.current || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    observerRef.current.observe(bottomElementRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [bottomElementRef, hasMore]);

  useEffect(() => {
    if (hasMore) {
      fetchPosts(page);
    }
  }, [page, hasMore]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
      {loading && <Loading />}
      <div ref={bottomElementRef} style={{ height: 1 }} />
    </div>
  );
}
