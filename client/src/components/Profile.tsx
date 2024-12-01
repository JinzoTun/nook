import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PostCard } from './PostCard';
import { Post, User } from '../interfaces/interfaces';
import { fetchUser, fetchUserById } from '../api/User';
import { Loading } from './ui/Loading';
import  FollowButton  from './FollowButton';

function Profile() {
  const [avatar, setAvatar] = useState<string>('');
  const [banner, setBanner] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams<{ id: string }>();

  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const targetUserId = id;

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const currentUser = await fetchUser(token!);
        setCurrentUser(currentUser._id);
      } catch (err) {
        console.error('Error fetching current user:', err
        );
      }
      console.log(currentUser);
      console.log(targetUserId);
      if (!token) {
        setError('User is not authenticated.');
        setLoading(false);
        return;
      }

      try {

        const data: User = await fetchUserById(id!);

        setAvatar(data.avatar || '/default-avatar.png');
        setBanner(data.banner || '/default-banner.png');
        setUsername(data.username || 'Unknown User');
        setBio(data.bio || 'No bio available.');
        setPosts(data.posts || []);

        setError(null);
      } catch (err) {
        setError('Failed to fetch user profile. Please try again later.');
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [currentUser, targetUserId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          {/* Banner */}
          <div
            className="relative w-full h-48 bg-gray-200 rounded-md border-2 shadow-lg"
            style={{
              backgroundImage: `url(${banner})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            
            {/* Avatar */}
            <div className="absolute bottom-[-50px] left-8">
              <img
                src={avatar}
                alt={username || 'User Avatar'}
                className="w-24 h-24 rounded-full border-2 border-white shadow-lg"
              />
            </div>
          </div>
          

          {/* User Info */}
          <div className="mt-16 px-8">
            <h1 className="text-2xl font-bold">u/{username}</h1>
            <p className="text-gray-500 mt-2">{bio}</p>
          </div>
          {/* Follow Button */}
          <div className="mt-4 px-8">
                        
          {currentUser && currentUser !== targetUserId && (
              <FollowButton 
                  targetUserId={targetUserId!} 
                  currentUsertoken={localStorage.getItem("token")!} 
              />
          )}
          </div>




          {/* Posts */}
          <div className="mt-6 ">
            <h2 className="text-lg font-bold mb-4">Posts</h2>
            <div className="posts-list space-y-4">
              {posts.length > 0 ? (
                posts.map((post) => <PostCard post={post} key={post._id} />)
              ) : (
                <p className="text-gray-500">No posts available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
