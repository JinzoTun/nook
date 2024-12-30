import { useNavigate } from "react-router-dom";
import Notification from "./Notification";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { clearSessionVotes } from "@/utils/sessionUtils";
import { FaPlus } from "react-icons/fa6";
import { useUser } from "@/context/UserContext"; // Import the user context
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import {ModeToggle} from "@/components/mode-toggle";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Header() {
  const navigate = useNavigate();
  const { user, setUser } = useUser(); // Use the user context
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // To track if the user is authenticated

  // Check for authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined' && token !== 'null' && token !== '') {
      setIsAuthenticated(true); // If token exists, set authenticated to true
    } else {
      setIsAuthenticated(false); // If no token, set authenticated to false
    }
  }, [user]);

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null); // Clear user context on logout
    navigate('/');
    clearSessionVotes(); // Clear session storage votes on logout
  };

  const getProfile = () => {
    if (user) {
      navigate(`/u/${user._id}`);
    }
  };

  const getSettings = () => {
    navigate('/settings');
  };

  const handleCreateButton = () => {
    navigate('/create');
  };
  
  const handleChatbutton = () => {
    navigate('/chat');
  };

  return (
    <div className="sticky z-50 top-0 flex h-16 items-center gap-4 border-b-2 bg-background px-4 md:px-6">
      <header className="flex h-16 justify-between w-screen items-center p-4 ">
        <a className="text-3xl font-bold" href="/">Nook</a>

        <div className="flex w-full justify-center items-center">
          <form className="m-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />
          {!isAuthenticated ? (
            <Button onClick={handleSignIn}>Sign In</Button> // Render only when not authenticated
          ) : (
            <>
              <Button onClick={handleChatbutton} className="rounded-full w-9 h-9" size={"icon"} variant={"secondary"}>
                <IoChatbubbleEllipsesOutline className="w-5 h-5" />
              </Button>
              <Notification />
              <Button onClick={handleCreateButton} className="rounded-full w-9 h-9" size={"icon"} variant={"secondary"}>
                <FaPlus className="w-5 h-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="rounded-full">
                    {/* Display user avatar or placeholder if no avatar */}
                    {user?.avatar ? (
                      <img src={user.avatar} alt="User Avatar" className="h-8 w-8 rounded-full" />
                    ) : (
                      <span className="h-8 w-8 rounded-full"></span>
                    )}
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>{user?.username || 'User'}</DropdownMenuLabel>
                  <DropdownMenuLabel className="font-light italic">"{user?.bio || 'no bio'}"</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={getProfile}>My Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={getSettings}>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </header>
    </div>
  );
}

export default Header;
