// todo : update this garbage !
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
import { formatDate } from "@/utils/formatDate"; 
// import Comments from "./Comments";
import { PiShareFatBold } from "react-icons/pi";
import { FaRegComment } from "react-icons/fa";
import { TbArrowBigUp, TbArrowBigDown  } from "react-icons/tb";
import { Post } from "@/interfaces/interfaces";
import {API} from "@/config/server"

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [votes, setVotes] = useState(post.votes);
  const [votedType, setVotedType] = useState<'upvote' | 'downvote' | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [CommentsCount, setCommentsCount] = useState<number>();

    
 // todo : need update cuz it will rerender every time even user is not logged in
  // Fetch all user votes for initial load and store them in session storage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API}/api/votes`, {
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
        `${API}/api/posts/${post._id}/vote`,
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

  // get comments count from http://localhost:3000/api/coments/${post._id}
  useEffect(() => {

    axios.get(`${API}/api/Comments/${post._id}`)
    .then((response) => {
      setCommentsCount(response.data.length);
    })
    .catch((error) => console.error("Error fetching comments count:", error));
  }
  , [post._id]);

  

  return (
    <Card className="w-full mt-4">
      <CardHeader className="flex">
        <a href={`/u/${post.author._id}`} className="flex justify-start items-center gap-2 w-4/5">
          <Avatar className="w-8 h-8" >
            <AvatarImage src={post.author.avatar || "https://placeholder.com/300x300"} alt="avatar" />
            <AvatarFallback>{post.author.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <p className="text-sm font-medium">u/{post.author.username} <span className="m-1 opacity-50 text-xs">{formatDate(post.createdAt)}</span></p>
        </a>
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
                className={votedType === 'upvote' ? ' bg-emerald-500' : 'default'} 

              >
                <TbArrowBigUp className="w-4 h-4" />
              </ToggleGroupItem>
              <span>{votes}</span>
              <ToggleGroupItem 
                value="-1" 
                onClick={() => handleVote('downvote')} 
                variant={votedType === 'downvote' ? 'outline' : 'default'} 
                className={votedType === 'downvote' ? ' bg-pink-500' : 'default'} 
              >
                <TbArrowBigDown  className="w-4 h-4"  />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <Separator orientation="vertical" />
          <a href={`/p/${post._id}`} className="flex justify-center items-center w-1/3 gap-1">
        
        
            <FaRegComment className="w-4 h-4" />
            <span>{ CommentsCount }</span>
            
        
          </a>
          
          <Separator orientation="vertical" />
          <a href="/" className="flex justify-center items-center w-1/3">
            <PiShareFatBold className="w-4 h-4" />
          </a>
        </div>
      </CardFooter>

      {/* Render comments if there are any     <Comments postId={post._id} />  */}
 
    </Card>
  );
}
