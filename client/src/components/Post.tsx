import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PostCard } from '@/components/PostCard';
import Comments from '@/components/Comments';
import { Post } from '@/interfaces/interfaces';
import { fetchPostById } from '@/api/Post';

export default function PostPage() {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if( id) 
        fetchPostById(id)
            .then((post) => {
                setPost(post);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!post) {
        return <div>Post not found</div>;
    }

    return (

         <>
           {/* go back arrow */}
              <div className="flex items-center mb-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 cursor-pointer"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  onClick={() => window.history.back()}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="text-lg font-bold">Post</span>
                </div>
           
           <PostCard post={post}  />
           <Comments postId={post._id} />
       
      

    
         </>
    );
};

