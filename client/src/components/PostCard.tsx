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
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ArrowDownIcon, ArrowUpIcon, ChatBubbleIcon, Share2Icon } from "@radix-ui/react-icons";
import { formatDate } from "@/utils/formatDate"; 

interface Post {
  _id: string;
  title: string;
  body: string;
  author: {
    username: string;
    avatar: string;
  };
  votes: number;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [votes, setVotes] = useState(post.votes);
  const [votedType, setVotedType] = useState<'upvote' | 'downvote' | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  // Fetch all user votes for initial load and store them in session storage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`http://localhost:3000/api/votes`, {
        headers: { token },
      })
      .then((response) => {
        const votes = response.data.votes;
        
        // Store each vote in sessionStorage
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
      // Undo vote
      updatedVotes = voteType === 'upvote' ? votes - 1 : votes + 1;
      setVotedType(null);
      sessionStorage.removeItem(`vote_${post._id}`);
    } else {
      // User is voting or changing their vote
      if (votedType === 'upvote') updatedVotes = votes - 1;
      if (votedType === 'downvote') updatedVotes = votes + 1;
      updatedVotes = voteType === 'upvote' ? updatedVotes + 1 : updatedVotes - 1;
      setVotedType(voteType);
      sessionStorage.setItem(`vote_${post._id}`, voteType);
    }

    setVotes(updatedVotes);

    try {
      const response = await axios.put(
        `http://localhost:3000/api/posts/${post._id}/vote`,
        { voteType },
        {
          headers: { token },
        }
      );

      if (!response.data.success) {
        console.error("Vote failed:", response.data.message);
        // Revert votes if there's an error
        setVotes(votes);
        setVotedType(null);
        sessionStorage.removeItem(`vote_${post._id}`);
      }
    } catch (error) {
      console.error("Error voting:", error);
      // Revert votes if there's an error
      setVotes(votes);
      setVotedType(null);
      sessionStorage.removeItem(`vote_${post._id}`);
    } finally {
      setIsVoting(false);
    }
  }, 150);
  

  return (
    <Card className="w-full mt-8">
      <CardHeader className="flex">
        <div className="flex justify-start items-center gap-2 w-4/5">
          <Avatar className="w-8 h-8">
            <AvatarImage src={post.author.avatar || "https://placeholder.com/300x300"} alt="avatar" />
            <AvatarFallback>{post.author.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <p className="text-sm font-medium">{post.author.username}  <span className="m-1 opacity-50 text-xs">{formatDate(post.createdAt)}</span></p>
        </div>
        <CardDescription>{post.title}</CardDescription>
      </CardHeader>

      <CardContent>
        <p>{post.body}</p>
      </CardContent>

      <CardFooter className="p-2 flex justify-start items-center border-t-2">
        <div className="flex h-7 w-full mx-2 text-sm">
          <div className="flex justify-center items-center w-1/3">
            <ToggleGroup type="single">
              <ToggleGroupItem 
                value="1" 
                onClick={() => handleVote('upvote')} 
                variant={votedType === 'upvote' ? 'outline' : 'default'} 
              >
                <ArrowUpIcon />
              </ToggleGroupItem>
              <span>{votes}</span>
              <ToggleGroupItem 
                value="-1" 
                onClick={() => handleVote('downvote')} 
                variant={votedType === 'downvote' ? 'outline' : 'default'} 
              >
                <ArrowDownIcon />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <Separator orientation="vertical" />
          <div className="flex justify-center items-center w-1/3">
            <ChatBubbleIcon />
          </div>
          <Separator orientation="vertical" />
          <div className="flex justify-center items-center w-1/3">
            <Share2Icon />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
