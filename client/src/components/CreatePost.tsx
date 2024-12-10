import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from './ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {getJoinedDens} from '@/api/User'; // API function to fetch joined Dens

import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectValue,
  SelectContent,
  SelectLabel,
} from './ui/select';

import { Den } from '@/interfaces/interfaces';
import { createPost } from '@/api/Post';


export default function CreatePost() {
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [joinedDens, setJoinedDens] = useState<Den[]>([]);
  const [selectedDenId, setSelectedDenId] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchDens = async () => {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      if (token) {
        try {
          const dens = await getJoinedDens(token); // Pass the token to getJoinedDens
          setJoinedDens(dens);
        } catch (error) {
          console.error('Error fetching joined Dens:', error);
        }
      } else {
        console.error('Token not found');
      }
    };

    fetchDens();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token'); // Get token from local storage

    if (!selectedDenId) {
      setMessage('Please select where you want to post.');
      setLoading(false);
      return;
    }

    if (!token) {
      setMessage('You need to be logged in to create a post.');
      setLoading(false);
      return;

    }

    // Create a new FormData object
    const post = new FormData();
    post.append('title', title);
    post.append('body', body);
    post.append('image', image || '');
    post.append('video', video || '');
    post.append('denId', selectedDenId);



    try {
      await createPost( token,post); // Call the createPost function

      setMessage('Post created successfully!');
      setTitle('');
      setVideo(null);
     setImage(null);
      setBody('');
      setSelectedDenId(''); // Clear the selected Den
    } catch (error) {
      setMessage('Failed to create post. Try again later.');
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-5">
      <h1 className="text-3xl font-semibold p-2 mb-4 flex">Create Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Label>Title</Label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border p-2"
          required
        />
        <Label>Body</Label>
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Body"
          className="border p-2"
          required
        />
        <Label>Image</Label>
        <Input
        type='file'
        accept='image/*'
        onChange={(e) => e.target.files && setImage(e.target.files[0])}
        placeholder='Image'
        className='border p-2'
        />
        <Label>Video</Label>
        <Input
        type='file'
        accept='video/*'
        onChange={(e) => e.target.files && setVideo(e.target.files[0])}
        placeholder='Video'
        className='border p-2'
        />



        {/* Select Dropdown for Joined Dens */}
        <Label>Den</Label>
        <Select
          value={selectedDenId}
          onValueChange={(value) => setSelectedDenId(value)}
        >
          <SelectTrigger className="border p-2">
            <SelectValue placeholder="Select a Den" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              
              <SelectLabel>Your Profile</SelectLabel>
              <SelectItem value={"profile"}>u/profile</SelectItem>
              <SelectLabel>Your Dens</SelectLabel>
              {joinedDens.map((den) => (
                <SelectItem key={den._id} value={den._id}>
                 <div className='flex justify-end items-center gap-2'><img
                  src={den.avatar || 'https://via.placeholder.com/60'}
                  alt={den.name}
                  className="w-6 h-6 rounded-full object-cover border-2 border-white" />
                  d/{den.name}
                  </div>
                </SelectItem>
              ))}

            </SelectGroup>
          </SelectContent>
        </Select>

        <Button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Create Post'}
        </Button>
      </form>
      {message && <p className="mt-2">{message}</p>}
    </Card>
  );
}
