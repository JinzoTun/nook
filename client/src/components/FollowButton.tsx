import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { API } from '../config/server';

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
    const fetchCurrentUser = async () => {
      try {
        // Fetch the current user's data, including the following list
        const response = await axios.get(`${API}/api/users/profile/${currentUserId}`, {
          headers: { token: currentUserToken },
        });
        const currentUser = response.data;

        // Check if the currentUser is following the targetUserId
        setIsFollowing(currentUser.following.includes(targetUserId));
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    };

    fetchCurrentUser();
  }, [currentUserId, targetUserId, currentUserToken]);

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      const endpoint = isFollowing
        ? `${API}/api/users/unfollow/${targetUserId}`
        : `${API}/api/users/follow/${targetUserId}`;

      await axios.put(endpoint, {}, {
        headers: { token: currentUserToken },
      });

      setIsFollowing(!isFollowing); // Toggle follow status
    } catch (err) {
      console.error(`Error ${isFollowing ? 'unfollowing' : 'following'} user:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleFollowToggle} disabled={loading}>
      {loading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
};

export default FollowButton;
