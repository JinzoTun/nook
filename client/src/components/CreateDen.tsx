import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

//todo : add rules for den creation
import { CreateDen as CreateDenAPI } from '@/api/Den';
import { Den } from '@/interfaces/interfaces';

export default function CreateDen() {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [avatar, setAvatar] = useState<string | undefined>();
  const [banner, setBanner] = useState<string | undefined>();
  const [categories, setCategories] = useState<string>('');
  const [visibility, setVisibility] = useState<string>('public');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // todo : change how the form is submitted new den 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Authentication required.');
      setLoading(false);
      return;
    }

    try {
      // Convert categories string to array
      const categoriesArray = categories.split(',').map((cat) => cat.trim());

      const newDen: Den = {
        _id: '', // Backend will generate this
        name,
        description,
        categories: categoriesArray.join(','),
        avatar,
        banner,
        members: [], // Backend will handle members
        posts: [], // Backend will handle posts
        visibility,
        moderators: [], // Backend will handle moderators
      };

      // Use API function
      await CreateDenAPI(newDen, token);

      setMessage('Den created successfully!');
      resetForm();
    } catch (error) {
      setMessage('Failed to create den. Try again later.');
      console.error('Error creating den:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setAvatar(undefined);
    setBanner(undefined);
    setCategories('');
    setVisibility('public');
  };

  return (
    <div>
      <Card className="p-5">
        <h1 className="text-3xl font-semibold p-2 mb-4 flex">Create Den</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Den Name"
            required
          />

          {/* Description */}
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
          />

          {/* Avatar */}
          <Input
            type="text"
            value={avatar || ''}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="Avatar URL"
          />

          {/* Banner */}
          <Input
            type="text"
            value={banner || ''}
            onChange={(e) => setBanner(e.target.value)}
            placeholder="Banner URL"
          />

          {/* Categories */}
          <Input
            type="text"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            placeholder="Categories (comma-separated)"
            required
          />

          {/* Visibility */}
          <Select onValueChange={(value) => setVisibility(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="restricted">Restricted</SelectItem>
            </SelectContent>
          </Select>

          {/* Submit Button */}
          <Button type="submit" disabled={loading}>
            {loading ? "Creating Den..." : "Create Den"}
          </Button>

          {/* Message */}
          {message && (
            <p
              className={`text-center mt-2 ${
                message.includes("success") ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </Card>
    </div>
  );
}
