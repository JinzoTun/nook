import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { fetchUserById, followUser, unfollowUser } from "@/api/User";

const FollowButton = ({
  targetUserId,
  currentUserId,
  currentUserToken,
}: {
  targetUserId: string;
  currentUserId: string;
  currentUserToken: string;
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFollowingStatus = async () => {
      try {
        const currentUser = await fetchUserById(currentUserId);
        setIsFollowing(currentUser.following.includes(targetUserId));
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    };

    checkFollowingStatus();
  }, [currentUserId, targetUserId, currentUserToken]);

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(targetUserId, currentUserToken);
      } else {
        await followUser(targetUserId, currentUserToken);
      }
      setIsFollowing(!isFollowing); // Toggle follow status
    } catch (err) {
      console.error(`Error ${isFollowing ? "unfollowing" : "following"} user:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleFollowToggle} disabled={loading}>
      {loading ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;
