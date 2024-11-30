import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateDen as CreateDenAPI } from '@/api/Den';
import { Den } from '@/interfaces/interfaces';

export default function CreateDen() {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [avatar, setAvatar] = useState<File | undefined>();
  const [banner, setBanner] = useState<File | undefined>();
  const [categories, setCategories] = useState<string>('');
  const [visibility, setVisibility] = useState<string>('public');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

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

      const den: Partial<Den> = {};
      // Convert categories string to array
     

      if (banner) {
        const bannerUrl = URL.createObjectURL(banner);
        den.banner = bannerUrl;
      }

      // If there's an avatar, save it as file URL or process it before update
      if (avatar) {
        // Create a URL for the file using FileReader or a similar method to display it in the frontend
        const avatarUrl = URL.createObjectURL(avatar); // This URL will represent the file locally
        den.avatar = avatarUrl; // Save the URL in the user data (it will be handled by the backend)
      }

      // Prepare den data 
      den.name = name;
      den.description = description;
      den.categories = categories;
      den.visibility = visibility;

      


      // Use API function to create den
      await CreateDenAPI(den, token, avatar, banner);

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

          {/* Avatar File Input */}
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && setAvatar(e.target.files[0])}
            placeholder="Avatar"
          />

          {/* Banner File Input */}
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && setBanner(e.target.files[0])}
            placeholder="Banner"
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
              className={`text-center mt-2 ${message.includes("success") ? "text-green-500" : "text-red-500"}`}
            >
              {message}
            </p>
          )}
        </form>
      </Card>
    </div>
  );
}
