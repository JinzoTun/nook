import { useState, useEffect } from 'react';
import { User } from '../interfaces/interfaces';
import { fetchUser } from '../api/User';
import { Button } from './ui/button';
import axios from 'axios';
import { API } from '../config/server';

const FollowButton = ({ targetUserId, currentUsertoken }: { targetUserId: string, currentUsertoken: string }) => {
    // State to track whether the current user is following the target user
    const [isFollowing, setIsFollowing] = useState(false);

    // Fetch the current user's data
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const user = await fetchUser(currentUsertoken);
                setCurrentUser(user);
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };
        fetchCurrentUser();
    }, [currentUsertoken]);

    // Check if the current user is already following the target user
    useEffect(() => {
        if (currentUser && currentUser.following) {
            setIsFollowing(currentUser.following.includes(targetUserId));
        }
    }, [currentUser, targetUserId]);

    const handleFollowClick = async () => {
        try {
            const response = await axios.put(`${API}/api/users/follow/${targetUserId}`, {}, {
                headers: {
                    token: localStorage.getItem('token') // Include token for authentication
                }
            });
            if (response.status === 200) {
                // Update the state to reflect that the user is now following
                setIsFollowing(true);
                console.log(response.data.message); // Optionally show success message
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error following user:', error);
        }
    }

    const handleUnfollowClick = async () => {
        try {
            const response = await axios.put(`${API}/api/users/unfollow/${targetUserId}`, {}, {
                headers: {
                    token: localStorage.getItem('token') // Include token for authentication
                }
            });
            if (response.status === 200) {
                // Update the state to reflect that the user is no longer following
                setIsFollowing(false);
                console.log(response.data.message); // Optionally show success message
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    }

    return (
        <Button
            onClick={isFollowing ? handleUnfollowClick : handleFollowClick}
            className={isFollowing ? 'unfollow-btn' : 'follow-btn'}
        >
            {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
    );
};

export default FollowButton;
