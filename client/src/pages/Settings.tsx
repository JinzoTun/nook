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
import { updateUser } from "@/api/User";
import { User } from "@/interfaces/interfaces";

export default function Settings() {
  // todo : set the initial state of the user profile
  const [avatar, setAvatar] = useState<string>("");
  const [banner, setBanner] = useState<string>("");
  const [username, setUsername] = useState<string>(""); // State for username
  const [bio, setBio] = useState<string>(""); // State for bio

  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, []);

  const handleUserUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user: Partial<User> = {};

      if( !avatar && !username && !bio && !banner) {
        setMessage("Please fill in at least one field.");
        setLoading(false);
        return;
      }
      if (avatar) {
        user.avatar = avatar;
      }
      if (username) {
        user.username = username;
      }
      if (bio) {
        user.bio = bio;
      }
      if (banner) {
        user.banner = banner;
      }
      await updateUser(token, user);
      setLoading(false);
      setMessage("Profile updated successfully !");
      

    } catch (error) {
      console.error("Error updating user:", error);
      setLoading(false);
      setMessage("An error occurred. Please try again.");
    }
    
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav className="grid gap-4 text-sm text-muted-foreground">
            <a href="#" className="font-semibold text-primary">
              General
            </a>
            <a href="#">Security</a>
            <a href="#">Integrations</a>
            <a href="#">Support</a>
            <a href="#">Advanced</a>
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
                  {/* Input for avatar */}
                  <Input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="Avatar URL"
                    className="mb-4"
                  />
                  {/* Input for banner */}
                  <Input
                    type="text"
                    value={banner}
                    onChange={(e) => setBanner(e.target.value)}
                    placeholder="Banner URL"
                    className="mb-4"
                  />
                  {/* Input for username */}
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="mb-4"
                  />
                  {/* Input for bio */}
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
