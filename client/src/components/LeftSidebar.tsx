import { useRecentPosts } from "@/hooks/useRecentPosts";
import { Button } from "@/components/ui/button";
import { fetchPostById } from "@/api/Post";
import { useEffect, useState } from "react";
import { Post } from "@/interfaces/interfaces";
import { ArrowBigUp } from "lucide-react";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@/components/ui/scroll-area";

const LeftSidebar = () => {
  const { recentPosts, clearRecentPosts } = useRecentPosts();
  const [postDetails, setPostDetails] = useState<Post[]>([]); // Array to store post data

  // Fetch post details for each recent post
  useEffect(() => {
    const fetchPosts = async () => {
      const postPromises = recentPosts.map(async (postId) => {
        const post = await fetchPostById(postId);
        return post;
      });
      const posts = await Promise.all(postPromises);
      setPostDetails(posts);
    };

    if (recentPosts.length > 0) {
      fetchPosts();
    }
  }, [recentPosts]);

  // If no recent posts, return an empty sidebar
  if (recentPosts.length === 0) {
    return <div className="h-screen shadow-md py-6"></div>; // Empty sidebar when no posts
  }

  return (
    <ScrollArea className=" h-auto py-6">
      {/* Sidebar content when there are recent posts */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold">Recent Posts</h2>
        <Button className="border" variant={"ghost"} onClick={clearRecentPosts}>
          Clear All
        </Button>
      </div>

      {/* Recent Posts List */}
      <ul className="space-y-2">
        {postDetails.map((post) => (
          <li
            onClick={() => window.open(`/p/${post._id}`, '_blank')}
            key={post._id}
            className="flex items-center bg-card  space-x-4 p-2 border rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <img
              src={post.author.avatar || '/default-avatar.jpg'} // Fallback for missing avatar
              alt={post.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold ">u/{post.author.username}</h3>
              <h4 className="font-light ">{post.title}</h4>

              <div className="flex items-center justify-start text-xs text-gray-500 space-x-4 mt-2">
                <p className="flex items-center space-x-1">
                  <ArrowBigUp size={18} className="text-gray-500" />
                  <span>{post.votes}</span>
                </p>
                <p className="flex items-center space-x-1">
                  <ChatBubbleIcon className="text-gray-500" />
                  <span>{post.comments.length}</span>
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
};

export default LeftSidebar;
