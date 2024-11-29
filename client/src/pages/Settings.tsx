import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { updateUser, updateUserAvatar, updateUserBanner } from "@/api/User";
import { User } from "@/interfaces/interfaces";
import { Label } from "@/components/ui/label";

export default function Settings() {
  const [avatar, setAvatar] = useState<File | null>(null); // State to store file (not URL)
  const [banner, setBanner] = useState<File | null>(null);
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, []);

  // Function to handle file selection (avatar)
  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file); // Save file to state
    }
  };

  // Function to handle file selection (banner)
  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBanner(file); // Save file to state
    }
  };  

  const handleUserUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user: Partial<User> = {};

      if (!avatar && !username && !bio && !banner) {
        setMessage("Please fill in at least one field.");
        setLoading(false);
        return;
      }

      // Prepare user data for update
      if (username) user.username = username;
      if (bio) user.bio = bio;
      if (banner) {
        const bannerUrl = URL.createObjectURL(banner);
        user.banner = bannerUrl;
      }

      // If there's an avatar, save it as file URL or process it before update
      if (avatar) {
        // Create a URL for the file using FileReader or a similar method to display it in the frontend
        const avatarUrl = URL.createObjectURL(avatar); // This URL will represent the file locally
        user.avatar = avatarUrl; // Save the URL in the user data (it will be handled by the backend)
      }

      // Update the user profile with the new data (including avatar URL)
      await updateUser(token, user);
      await updateUserAvatar(token, avatar!); // Update the avatar separately
      await updateUserBanner(token, banner!); // Update the banner separately

      setLoading(false);
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      setLoading(false);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav className="grid gap-4 text-sm text-muted-foreground">
            <a href="/settings" className="font-semibold ">
              Profile
            </a>
            <a href="/settings/password">Password</a>
            <a href="/settings/security">Security</a>
            <a href="/settings/notifications">Notifications</a>
            
          </nav>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Update Profile</CardTitle>
                <CardDescription>
                  Change your avatar, username, and bio.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUserUpdate}>
                  {/* Avatar File Input */}
                    <Label htmlFor="avatar">Avatar</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarSelect} // Handle avatar selection
                      className="block w-full"
                    />
              
               
                  {/* Input for banner */}
                  <Label htmlFor="banner">Banner</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerSelect} // Handle banner selection
                    className="mb-4"
                  />
                  {/* Input for username */}
                  <Label htmlFor="username">Username</Label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="mb-4"
                  />
                  {/* Input for bio */}
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Bio"
                  />
                </form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4 flex justify-start items-center gap-4">
                <Button type="submit" onClick={handleUserUpdate} disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </Button>
                <p className="text-sm text-muted-foreground">{message}</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
