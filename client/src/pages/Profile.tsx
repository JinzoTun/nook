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
import axios from "axios";

export default function Profile() {
  const [avatar, setAvatar] = useState<string>("");
  const [username, setUsername] = useState<string>(""); // State for username
  const [bio, setBio] = useState<string>(""); // State for bio
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");

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
      await axios.put(
        "http://localhost:3000/api/users/profile",
        { avatar, username, bio }, // Send avatar, username, and bio
        {
          headers: {
            token: token,
          },
        }
      );
      
      // Clear the inputs after successful submission
      setAvatar("");
      setUsername("");
      setBio("");

      // Refresh the page
      window.location.reload();
    } finally {
      setLoading(false);
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
              <CardFooter className="border-t px-6 py-4">
                <Button type="submit" onClick={handleUserUpdate} disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
