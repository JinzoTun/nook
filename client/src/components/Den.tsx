import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";

interface Den {
  _id: string;
  name: string;
  description: string;
  categories: string;
  avatar?: string;
  banner?: string;
  members: string[];
  posts: Post[];
}

interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
}

function Den() {
  const { id } = useParams<{ id: string }>();
  const [den, setDen] = useState<Den | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDenAndPosts = async () => {
      try {
        setLoading(true);

        // Fetch the Den details
        const denResponse = await axios.get(`http://localhost:3000/api/dens/${id}`);
        setDen(denResponse.data);


      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to fetch Den or posts.";
        setError(`Error: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDenAndPosts();
  }, [id]);

  // check if user is joined in the den den in local storage 
  // if not joined, show join button

  // if joined, show leave button
  // on click of leave button, call leave den api
  // on click of join button, call join den api
  
  

  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen ">
      {/* Header Section */}
      {den && (
        <div className="relative shadow-md">
          {/* Banner */}
          {den.banner ? (
            <img
              src={den.banner}
              alt={`${den.name} Banner`}
              className="w-full  h-36 rounded-md border border-opacity-50 border-gray-50 object-cover"
            />
          ) : (
            <div className="w-full h-40  flex items-center justify-center">
              <span className="">No banner available</span>
            </div>
          )}
          {/* Avatar and Details */}
          <div className="p-4 flex justify-between items-center space-x-4">
            <div className="flex  justify-center items-center gap-3">
            {den.avatar ? (
              <img
                src={den.avatar}
                alt={`${den.name} Avatar`}
                className="w-12 h-12 rounded-full object-cover border-2 border-white"
              />
            ) : (
                <img
                src="https://via.placeholder.com/80"
                className="w-12 h-12 rounded-full object-cover border-2 border-white"
              />
              
            )}
            <div>
              <h1 className="text-2xl font-bold">d/{den.name}</h1>
              <p className="text-sm text-gray-600">{den.description || "No description available."}</p>
            </div>
            </div> 
            <div> 
            <Button>
              Join
            </Button>

            </ div>
          </div>
          
        </div>
      )}

      {/* Posts Section */}
      <div className="p-4 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        {den?.posts.length ? (
          <div className="space-y-4">
            {den.posts.map((post) => (
              <div key={post._id} className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-gray-600">{post.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No posts available in this Den.</p>
        )}
      </div>
    </div>
  );
}

export default Den;
