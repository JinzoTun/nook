import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import getJoinedDens from '@/api/GetJoinedDens'; // API function to fetch joined Dens
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectValue,
  SelectContent,
  SelectLabel,
} from './ui/select';

interface Den {
  _id: string;
  name: string;
}

export default function CreatePost() {
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [joinedDens, setJoinedDens] = useState<Den[]>([]);
  const [selectedDenId, setSelectedDenId] = useState<string>('');

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
      setMessage('Please select a Den before creating the post.');
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        'http://localhost:3000/api/posts',
        { title, body, denId: selectedDenId }, // Send selected Den ID in the request body
        {
          headers: {
            token: token, // Use your token header as defined in the middleware
          },
        }
      );

      setMessage('Post created successfully!');
      setTitle('');
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
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border p-2"
          required
        />
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Body"
          className="border p-2"
          required
        />

        {/* Select Dropdown for Joined Dens */}
        <Select
          value={selectedDenId}
          onValueChange={(value) => setSelectedDenId(value)}
        >
          <SelectTrigger className="border p-2">
            <SelectValue placeholder="Select a Den" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {/*              \\ todo : add string for user
*/}
              <SelectLabel>Your Dens</SelectLabel>

              {joinedDens.map((den) => (
                <SelectItem key={den._id} value={den._id}>
                  {den.name}
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
