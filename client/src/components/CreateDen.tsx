import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { useState } from 'react';
import axios from 'axios';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RuleProps {
  title: string;
  description: string;
}

function CreateDen() {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [banner, setBanner] = useState<string>('');
  const [categories, setCategories] = useState<string>('');
  const [rules, setRules] = useState<RuleProps>({ title: '', description: '' });
  const [visibility, setVisibility] = useState<string>('public');
  const [tags, setTags] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');

    try {
      await axios.post(
        'http://localhost:3000/api/dens',
        { name, description, visibility, categories, tags, rules, banner, avatar },
        {
          headers: {
            token: token || '',
          },
        }
      );

      setMessage('Den created successfully!');
      setName('');
      setDescription('');
      setAvatar('');
      setBanner('');
      setCategories('');
      setTags('');
      setRules({ title: '', description: '' });
    } catch (error) {
      setMessage('Failed to create den. Try again later.');
      console.error('Error creating den:', error);
    } finally {
      setLoading(false);
    }
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
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="Avatar URL"
            required
          />

          {/* Banner */}
          <Input
            type="text"
            value={banner}
            onChange={(e) => setBanner(e.target.value)}
            placeholder="Banner URL"
            required
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

          {/* Rules 
          <Input
            type="text"
            value={rules.title}
            onChange={(e) => setRules((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Rule Title"
            required
          />
          <Input
            type="text"
            value={rules.description}
            onChange={(e) => setRules((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Rule Description"
            required
          />
          */}

          {/* Tags */}
          <Input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma-separated)"
            required
          />

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

export default CreateDen;
