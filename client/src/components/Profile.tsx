import { useParams } from 'react-router-dom';
import { useFetchUser } from '../hooks/useFetchUser';
import { useAuth } from '../hooks/useAuth';
import { Loading } from './ui/Loading';
import FollowButton from './FollowButton';
import { PostCard } from './PostCard';

const Profile = () => {
  const { id: targetUserId } = useParams<{ id: string }>();
  const { user, loading, error } = useFetchUser(targetUserId);
  const { token, currentUserId } = useAuth();

  if (loading) return <Loading />;
  if (error || !user) return <p className="text-red-500">{error || 'User not found.'}</p>;

  return (
    <div>
      {/* Banner */}
      <div
        className="relative w-full h-48 bg-gray-200 rounded-md border-2 shadow-lg"
        style={{
          backgroundImage: `url(${user.banner || '/default-banner.png'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Avatar */}
        <div className="absolute bottom-[-50px] left-8">

          
          <img
            src={user.avatar || '/default-avatar.png'}
            alt={user.username || 'User Avatar'}
            className="w-24 h-24 rounded-full border-2 border-white shadow-lg"
          />
          
        </div>
      </div>

   {/* User Info */}
<div className="mt-16 px-8 flex items-center justify-between">
  <div>
    <h1 className="text-2xl font-bold">u/{user.username}</h1>
    <p className="text-gray-500 mt-2">{user.bio}</p>
  </div>

  {/* Follow Button */}
  {currentUserId && currentUserId !== targetUserId && (
      <FollowButton
      targetUserId={targetUserId!}
      currentUserId={currentUserId}
      currentUserToken={token!}
    />

  )}

       {/* edit button */}
       {currentUserId === targetUserId && (
            <a href='/settings' className=" border-2 hover:bg-teal-500 px-4 py-2 rounded-md shadow-md">
              Edit Profile
            </a>
          )}
</div>


      {/* Posts */}
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-4">Posts</h2>
        <div className="posts-list space-y-4">
          {user.posts?.length > 0 ? (
            user.posts.map((post) => <PostCard post={post} key={post._id} />)
          ) : (
            <p className="text-gray-500">No posts available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
