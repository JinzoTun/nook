import { useState, useEffect } from "react";

// Custom hook to manage recent posts in localStorage
export const useRecentPosts = () => {
  const [recentPosts, setRecentPosts] = useState<string[]>([]);

  // Load recent posts from localStorage when the component mounts
  useEffect(() => {
    const storedPosts = localStorage.getItem("recentPosts");
    if (storedPosts) {
      setRecentPosts(JSON.parse(storedPosts));
    }
  }, []);

  // Add a post to the recent posts
  const addRecentPost = (postId: string) => {
    const updatedPosts = [postId, ...recentPosts.filter(id => id !== postId)]; // Prevent duplicates
    setRecentPosts(updatedPosts);
    localStorage.setItem("recentPosts", JSON.stringify(updatedPosts));
  };

  // Clear recent posts from localStorage
  const clearRecentPosts = () => {
    setRecentPosts([]);
    localStorage.removeItem("recentPosts");
  };

  return { recentPosts, addRecentPost, clearRecentPosts };
};
