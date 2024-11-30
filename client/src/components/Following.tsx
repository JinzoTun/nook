import { useEffect, useState } from "react";
import { PostCard } from "./PostCard";
import { Post } from "../interfaces/interfaces";
import { fetchFollowingPosts } from "../api/Post";
import { Loading } from "./ui/Loading"; // Import the new Loading component

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    console.log(localStorage.getItem("token"));
    fetchFollowingPosts(localStorage.getItem("token") as string )
      .then((posts) => {
        setPosts(posts);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  

  if (error) {
    return <div>{error}</div>;
  }

  if (!posts || posts.length === 0) {
    return <div>No posts</div>;
  }


  return (
    <div>

      {loading && <Loading />}
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
   
    </div>
  );

}
