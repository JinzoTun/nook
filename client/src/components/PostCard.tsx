import { useState, useEffect } from "react";
import { debounce } from 'lodash';
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import ReactPlayer from 'react-player';
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/utils/formatDate"; 
import { PiShareFatBold } from "react-icons/pi";
import { FaRegComment } from "react-icons/fa";
import { TbArrowBigUp, TbArrowBigDown } from "react-icons/tb";
import { Post } from "@/interfaces/interfaces";
import { API } from "@/config/server";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRecentPosts } from "@/hooks/useRecentPosts";
interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [votes, setVotes] = useState(post.votes);
  const [votedType, setVotedType] = useState<'upvote' | 'downvote' | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const { addRecentPost } = useRecentPosts();
  
  const commentsCount = post.comments.length;
  
  const handlePostClick = () => {
    addRecentPost(post._id); // Add to recent posts on click
    // Navigate to post detail page or perform other actions
  };

  // Fetch all user votes for initial load and store them in session storage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API}/api/votes`, {
        headers: { token },
      })
      .then((response) => {
        const votes = response.data.votes;
        Object.entries(votes).forEach(([postId, voteType]) => {
          sessionStorage.setItem(`vote_${postId}`, voteType as string);
          if (postId === post._id) setVotedType(voteType as 'upvote' | 'downvote');
        });
      })
      .catch((error) => console.error("Error fetching votes:", error));
    }
  }, [post._id]);

  // Handle voting on the post
  const handleVote = debounce(async (voteType: 'upvote' | 'downvote') => {
    if (isVoting) return;

    setIsVoting(true);
    const token = localStorage.getItem('token');
    let updatedVotes = votes;

    if (votedType === voteType) {
      updatedVotes = voteType === 'upvote' ? votes - 1 : votes + 1;
      setVotedType(null);
      sessionStorage.removeItem(`vote_${post._id}`);
    } else {
      if (votedType === 'upvote') updatedVotes = votes - 1;
      if (votedType === 'downvote') updatedVotes = votes + 1;
      updatedVotes = voteType === 'upvote' ? updatedVotes + 1 : updatedVotes - 1;
      setVotedType(voteType);
      sessionStorage.setItem(`vote_${post._id}`, voteType);
    }

    setVotes(updatedVotes);

    try {
      const response = await axios.put(
        `${API}/api/posts/${post._id}/vote`,
        { voteType },
        {
          headers: { token },
        }
      );

      if (!response.data.success) {
        console.error("Vote failed:", response.data.message);
        setVotes(votes);
        setVotedType(null);
        sessionStorage.removeItem(`vote_${post._id}`);
      }
    } catch (error) {
      console.error("Error voting:", error);
      setVotes(votes);
      setVotedType(null);
      sessionStorage.removeItem(`vote_${post._id}`);
    } finally {
      setIsVoting(false);
    }
  }, 150);



  return (
    <Card onClick={handlePostClick} className="w-full mt-4">
      <a href={`/p/${post._id}`} >
      <CardHeader className="flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={post.author.avatar || "https://placeholder.com/300x300"} alt="avatar" />
            <AvatarFallback>{post.author.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <a href={`/u/${post.author._id}`} className="text-sm font-semibold">u/{post.author.username}</a>
            <span className="text-xs text-gray-500">{formatDate(post.createdAt)}</span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <BsThreeDotsVertical className="w-5 h-5 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            {post.author._id === localStorage.getItem('userId') && <DropdownMenuItem>Edit</DropdownMenuItem>}
            <DropdownMenuSeparator />
            <DropdownMenuItem>Save</DropdownMenuItem>
            <DropdownMenuItem>Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardDescription className="px-6">{post.title}</CardDescription>

      <CardContent>
        <p>{post.body}</p>
        {post.image && <img src={post.image} alt="post" className="m-auto max-w-full max-h-96 object-contain rounded-xl" />}
        {post.video && (
          <ReactPlayer
            url={post.video}
            controls
            width={720}
            height={480}
            className=" m-auto max-w-full max-h-96 object-cover rounded-xl"
          />
        )}
      </CardContent>

      <CardFooter className="p-2 flex justify-start items-center border-t-2">
        <div className="flex h-7 w-full mx-2 text-sm">
          <div className="flex justify-center items-center w-1/3">
            <button 
              onClick={() => handleVote('upvote')} 
              className={`flex items-center justify-center w-8 h-8 rounded-full ${votedType === 'upvote' ? 'bg-emerald-500 text-white' : ''}`}
            >
              <TbArrowBigUp className="w-4 h-4" />
            </button>
            <span>{votes}</span>
            <button 
              onClick={() => handleVote('downvote')} 
              className={`flex items-center justify-center w-8 h-8 rounded-full ${votedType === 'downvote' ? 'bg-pink-500 text-white' : ''}`}
            >
              <TbArrowBigDown className="w-4 h-4" />
            </button>
          </div>

          <Separator orientation="vertical" />
          <a href={`/p/${post._id}`} className="flex justify-center items-center w-1/3 gap-1">
            <FaRegComment className="w-4 h-4" />
            <span>{commentsCount}</span>
          </a>

          <Separator orientation="vertical" />
          <a href="/" className="flex justify-center items-center w-1/3">
            <PiShareFatBold className="w-4 h-4" />
          </a>
        </div>
      </CardFooter></a>
    </Card>
  );
}
