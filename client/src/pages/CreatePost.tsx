import { useState } from 'react';
import axios from 'axios';
import Header from "@/components/Header";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';


const CreatePost: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const token = localStorage.getItem('token'); // Get token from local storage

    try {
       await axios.post(
        'http://localhost:3000/api/posts',
        { title, body },
        {
          headers: {
            token: token, // Use your token header as defined in the middleware
          },
        }
      );

      setMessage('Post created successfully!'); // Set success message
      setTitle(''); // Clear title input
      setBody(''); // Clear body input
    } catch (error) {
      setMessage('Failed to create post. Try again later.'); // Set error message
      console.error('Error creating post:', error); // Optional: Log the error for debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-72 flex flex-col ">
      <Header />
      <Card  className="flex flex-col gap-4 p-6 w-3/4 justify-center h-1/2">
        <h1 className="text-3xl font-semibold">Create Post</h1>
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
          <Button type="submit" disabled={loading}>
            {loading ? 'Posting...' : 'Create Post'}
          </Button>
        </form>
        {message && <p className="mt-2">{message}</p>}
      </Card>
    </div>
  );
}

export default CreatePost;
