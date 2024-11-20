import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { PostCard } from "./PostCard";
import { Den,Post } from "../interfaces/interfaces";


function DenPage() {
  const { id } = useParams<{ id: string }>();
  const [den, setDen] = useState<Den>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState<boolean>(false);

  useEffect(() => {
    const fetchDenAndPosts = async () => {
      try {
        setLoading(true);

        // Fetch the Den details
        const denResponse = await axios.get(`http://localhost:3000/api/dens/${id}`);
        setDen(denResponse.data);
        setPosts(denResponse.data.posts);
        setLoading(false);


        // Check if the user is a member of the Den
        const joinedDens = JSON.parse(localStorage.getItem("joinedDens") || "[]");
        setIsJoined(joinedDens.includes(id));
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

  const handleJoinLeave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to join or leave a Den.");
      return;
    }

    try {
      if (isJoined) {
        await axios.post(`http://localhost:3000/api/dens/${id}/leave`, {}, {
          headers: { token },
        });
        setIsJoined(false);

        // Update local storage
        const joinedDens = JSON.parse(localStorage.getItem("joinedDens") || "[]");
        localStorage.setItem(
          "joinedDens",
          JSON.stringify(joinedDens.filter((denId: string) => denId !== id))
        );
      } else {
        await axios.post(`http://localhost:3000/api/dens/${id}/join`, {}, {
          headers: { token },
        });
        setIsJoined(true);

        // Update local storage
        const joinedDens = JSON.parse(localStorage.getItem("joinedDens") || "[]");
        joinedDens.push(id);
        localStorage.setItem("joinedDens", JSON.stringify(joinedDens));
      }
    } catch (err) {
      console.error("Error joining or leaving the Den:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      {den && (
        <div className="relative shadow-md">
          {/* Banner */}
          {den.banner ? (
            <img
              src={den.banner}
              alt={`${den.name} Banner`}
              className="w-full h-36 rounded-md border border-opacity-50 border-gray-50 object-cover"
            />
          ) : (
            <div className="w-full h-40 flex items-center justify-center">
              <span className="">No banner available</span>
            </div>
          )}
          {/* Avatar and Details */}
          <div className="p-4 flex justify-between items-center space-x-4">
            <div className="flex justify-center items-center gap-3">
              {den.avatar ? (
                <img
                  src={den.avatar}
                  alt={`${den.name} Avatar`}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <img

                  src="https://via.placeholder.com/80"
                  alt={`${den.name} Avatar`}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold">d/{den.name}</h1>
                <p className="text-sm text-gray-600">
                  {den.description || "No description available."}
                </p>
              </div>
            </div>
            <div>
              <Button onClick={handleJoinLeave}>
                {isJoined ? "Leave" : "Join"}
              </Button>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-2">Members:</h3>
            <div className="flex gap-2 items-center">
              {den.members.map((member) => (
                <div key={member._id} className="flex flex-col items-center">
                  <img
                    src={member.avatar}
                    alt={member.username}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white"
                  />
                  <span className="text-sm">{member.username}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Posts Section */}
      <div className="mt-4">
        <div className="flex justify-between items-center p-4">
         {/* filters*/}

          <div className="flex gap-4">
            <Button variant="secondary">New</Button>
            <Button variant="secondary">Top</Button>
            <Button variant="secondary">Hot</Button>
          </div>
          <Button variant="secondary">Create Post</Button>
        </div>
        {
          loading ? (
              <div className="flex justify-center items-center gap-3">
                <span>Loading...</span>
              </div>
          ) : (
              <div className="flex flex-col justify-center items-center gap-3">
                {posts && posts.length > 0 ? (
                    posts.map((post) => (
                        <PostCard key={post._id} post={post}>

                        </PostCard>
                    ))
                ) : (
                    <div>No posts available.</div>
                )}
              </div>
          )
        }




   
      </div>
    </div>
  );
}

export default DenPage;
