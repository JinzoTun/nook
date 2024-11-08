import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PostCard } from '@/components/PostCard';
import Comments from '@/components/Comments';
import Header from '@/components/Header';
import SideBar from '@/components/SideBar';
import DescriptionCard from '@/components/DescriptionCard';

interface Post {
    _id: string;
    title: string;
    body: string;
    votes: number;
    author: {
        username: string;
        avatar: string;
    };
    createdAt: string;
}

const PostPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/posts/${id}`);
                setPost(response.data);
            } catch (err) {
                setError(`error ${err}` );
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
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
         <Header />
   
         <div className="flex">
           {/* Sidebar fixed to the left */}
           <div className="hidden lg:flex fixed lg:w-1/5 w-0 ">
             <SideBar />
           </div>
   
           {/* Main Content */}
           <div className="lg:w-3/5  w-full p-5 lg:ml-[20%] h-[calc(100vh-64px)] overflow-auto">

           
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
       
           </div>
   
           {/* CardDescription fixed to the right */}
           <div className="hidden lg:block fixed top-16 right-0 lg:w-1/5 w-0 border-l-2 h-[calc(100vh-64px)] p-5">
             <DescriptionCard />
           </div>
         </div>
         </>
    );
};

export default PostPage;