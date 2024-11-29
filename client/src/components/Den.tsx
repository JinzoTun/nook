import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { PostCard } from "./PostCard";
import { Den, Post } from "../interfaces/interfaces";
import { getDenById, JoinDen, LeaveDen } from "@/api/Den";
import { getJoinedDens } from "@/api/User";
import { useNavigate, useParams } from "react-router-dom";

function DenPage() {
  const { id } = useParams<{ id: string }>();
  const [den, setDen] = useState<Den | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDenAndPosts = async () => {
      try {
        setLoading(true);
        const denData = await getDenById(id!);
        setDen(denData);
        setPosts(denData.posts);

        const token = localStorage.getItem('token');
        if (token) {
            getJoinedDens(token).then((dens) => {
                setIsJoined(dens.some((den) => den._id === id))
            });
        }


     
        
      } catch (err) {
        setError("Failed to fetch Den or posts.");
        console.error("Error fetching Den or posts:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDenAndPosts();
  }, [id]);

  const handleCreateButton = () => {
    navigate("/create");
  };

  const handleJoinOrLeaveDen = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User not authenticated");
      return;
    }

    try {
      if (isJoined) {
        await LeaveDen(id!, token);
        setIsJoined(false);
      } else {
        await JoinDen(id!, token);
        setIsJoined(true);
      }
    } catch (err) {
      console.error("Error joining/leaving Den:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen">
      {den && (
        <>
          
        <div>
          {/* Banner */}
          <div
            className="relative w-full h-48 bg-gray-200 rounded-md border-2 shadow-lg"
            style={{
              backgroundImage: `url(${den.banner || "https://via.placeholder.com/800x200"})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Avatar */}
            <div className="absolute bottom-[-50px] left-8">
              <img
                src={den.avatar || "https://via.placeholder.com/100"}
                alt={den.name || 'User Avatar'}
                className="w-24 h-24 rounded-full border-2 border-white shadow-lg"
              />
            </div>
            </div>
          </div>

          {/* User Info */}
          <div className=" pl-2">
                        {/* Join/Leave Button */}
          <div className="p-4 flex  self-end justify-end">
            <Button onClick={handleJoinOrLeaveDen}>
              {isJoined ? "Leave" : "Join"}
            </Button>
          </div>
            <div>
              
            <h1 className="text-2xl font-bold">d/{den.name}</h1>
            <p className="text-gray-500 mt-2">{den.description}</p>
            </div >

     
          </div>

          {/* den author */}
          <div className="flex gap-4 items-center py-4">
            <h2 className="text-xl font-semibold">Created by:</h2>
            <img
              src={den.createdBy.avatar || "https://via.placeholder.com/40"}
              alt={den.createdBy.username}
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <p>{den.createdBy.username}</p>
          </div>
         
     

          {/* moderator Section render if length > 0 */}
          <div className="py-4">
            {den.moderators.length > 0 && (
              <div className="flex gap-4">
                <h2 className="text-xl font-semibold">Moderators:</h2>
                <div className="flex gap-2">
                  {den.moderators.map((moderator) => (
                    <img
                      key={moderator._id}
                      src={moderator.avatar || "https://via.placeholder.com/40"}
                      alt={moderator.username}
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
              </div>
            )}
        
          </div>

          {/* Filters and Posts Section */}
          <div className="">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <Button variant="secondary">New</Button>
                <Button variant="secondary">Top</Button>
                <Button variant="secondary">Hot</Button>
              </div>
              <Button onClick={handleCreateButton} variant="secondary">
                Create Post
              </Button>
            </div>

            {/* Posts */}
            <div className="mt-4">
              {posts.length > 0 ? (
                posts.map((post) => <PostCard key={post._id} post={post} />)
              ) : (
                <p className="text-gray-500">No posts available.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DenPage;
