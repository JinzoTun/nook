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

interface Post {
  _id: string;
  title: string;
  body: string;
  author: {
    username: string;
    avatar: string;
  };
  votes: number;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [votes, setVotes] = useState(post.votes);
  const [votedType, setVotedType] = useState<'upvote' | 'downvote' | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  // Load user's vote status from local storage on component mount
  useEffect(() => {
    const userVote = localStorage.getItem(`vote_${post._id}`);
    if (userVote) {
      setVotedType(userVote === 'upvote' ? 'upvote' : 'downvote');
    }
  }, [post._id]);

  const handleVote = debounce(async (voteType: 'upvote' | 'downvote') => {
    if (isVoting) return;  // Prevent multiple votes at the same time

    setIsVoting(true);
    const token = localStorage.getItem('token');
    let updatedVotes = votes;

    if (votedType === voteType) {
      // Undo vote
      updatedVotes = voteType === 'upvote' ? votes - 1 : votes + 1;
      setVotedType(null);
      localStorage.removeItem(`vote_${post._id}`);
    } else {
      // User is voting or changing their vote
      if (votedType === 'upvote') updatedVotes = votes - 1;
      if (votedType === 'downvote') updatedVotes = votes + 1;
      updatedVotes = voteType === 'upvote' ? updatedVotes + 1 : updatedVotes - 1;
      setVotedType(voteType);
      localStorage.setItem(`vote_${post._id}`, voteType);
    }

    setVotes(updatedVotes);

    try {
      const response = await axios.put(
        `http://localhost:3000/api/posts/${post._id}/vote`,
        { voteType },
        {
          headers: {
            token: token,
          },
        }
      );

      if (!response.data.success) {
        console.error("Vote failed:", response.data.message);
        // If vote fails, revert votes
        setVotes(votes);
        setVotedType(null);
        localStorage.removeItem(`vote_${post._id}`);
      }
    } catch (error) {
      console.error("Error voting:", error);
      // Revert votes if error occurs
      setVotes(votes);
      setVotedType(null);
      localStorage.removeItem(`vote_${post._id}`);
    } finally {
      setIsVoting(false);  // Allow voting again
    }
  }, 150);  // Debounce to avoid spamming

  return (
    <Card className="w-full mt-8">
      <CardHeader className="flex">
        <div className="flex justify-start items-center gap-2 w-4/5">
          <Avatar className="w-8 h-8">
            <AvatarImage src={post.author.avatar || "https://placeholder.com/300x300"} alt="avatar" />
            <AvatarFallback>{post.author.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <p className="text-sm font-medium">{post.author.username}</p>
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
