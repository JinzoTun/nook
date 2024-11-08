import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PostCard } from '@/components/PostCard';
import Comments from '@/components/Comments';
import Header from '@/components/Header';

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
        <   >
            <Header />
            <div className='flex'>
                <div></div>
            <PostCard post={post}  />
            <Comments postId={post._id} />
                
            </div>
      
        </>
    );
};

export default PostPage;