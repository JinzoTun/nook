import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PostCard } from './PostCard';
import {Post } from '../interfaces/interfaces';



function Profile() {

  const [avatar, setAvatar] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User is not authenticated.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/users/profile/${id}`, {
          headers: { token : token },
        });

        const data = response.data;
        console.log(data);

        if (!data) {
          setError('Invalid API response.');
          setLoading(false);
          return;
        }

        setAvatar(data.avatar || '/default-avatar.png');
        setUsername(data.username || 'Unknown User');
        setBio(data.bio || 'No bio available.');
        setPosts(data.posts || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to fetch user profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

    if (loading) {
        return <div>Loading
        </div>;
    }


  return (
    <div className="profile-container">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
  
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="profile-details">
          {/* Avatar */}
          <img
            src={avatar && typeof avatar === 'string' ? avatar : '/default-avatar.png'}
            alt={username || 'User Avatar'}
            className="w-32 h-32 rounded-full"
          />
  
          {/* Username */}
          <h2 className="text-xl font-semibold mt-4">{username || 'Unknown User'}</h2>
  
          {/* Bio */}
          <p className="text-gray-600 mt-2">{bio || 'No bio available.'}</p>
  
          {/* Posts */}
          <h3 className="text-lg font-bold mt-6">Posts</h3>
          <div className="posts-list mt-4 space-y-4">
            {posts.length > 0 ? (
              posts.map((post) => <PostCard post={post} key={post._id} />)
            ) : (
              <p className="text-gray-500">No posts available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
  
}

export default Profile;
