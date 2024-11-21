import { useNavigate } from "react-router-dom";
import Notification from "./Notification";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {   Search } from "lucide-react";
import { clearSessionVotes } from "@/utils/sessionUtils";
import { HiPlus } from "react-icons/hi2";
import {fetchUser} from "@/api/User";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { User } from "@/interfaces/interfaces";

function Header() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<User | null>(null); // Store user profile

  // Check for authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token || token === 'undefined' || token === 'null' || token === '') {  
      return
    }
    if (token) {
      setIsAuthenticated(true);
      fetchUserProfile(token); // Fetch user profile if authenticated
    }
  }, []);

  // Function to fetch user profile from backend
  const fetchUserProfile = async (token: string) => {
    try {
      const user = await fetchUser(token);
      setUserProfile(user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserProfile(null); // Clear user profile on logout
    navigate('/');
    clearSessionVotes(); // Clear session storage votes on logout
  };

  const getProfile = () => {
    navigate(`/u/${userProfile?._id}`);
  }
  const getSettings = () => {
    navigate('/settings');
  }

  const handleCreateButton = () => {
    navigate('/create');
  }

  return (
    <div className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <header className="flex h-16 justify-between w-screen items-center p-4 border-b-2">
        <a className="text-3xl font-bold ml-6" href="/">Nook</a>

        <div className="flex w-full max-w-sm items-center space-x-2">
          <form className="ml-auto flex-1 sm:flex-initial">
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
        {!isAuthenticated ? (
            <></>
          ) : ( <>        <Button onClick={handleCreateButton}  className="rounded-full w-9 h-9" size={"icon"} variant={"secondary"} ><HiPlus className="w-5 h-5" /> </Button>
          <Notification />
</>)}
          

          {/* Conditionally render Sign In or Dropdown Menu based on authentication status */}
          {!isAuthenticated ? (
            <Button onClick={handleSignIn}>Sign In</Button>
          ) : (
            <>
        
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="rounded-full">

                    {/* Display user avatar or placeholder if no avatar */}
                    {userProfile?.avatar ? (
                      <img src={userProfile.avatar} alt="User Avatar" className="h-8 w-8 rounded-full" />
                    ) : (
                      <span className="h-8 w-8 rounded-full"></span>
                    )}
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className=" w-48">
                  <DropdownMenuLabel>{userProfile?.username || 'User'}</DropdownMenuLabel>
                  <DropdownMenuLabel className=" font-light italic">"{userProfile?.bio || 'no bio'}"</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={getProfile}>My Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={getSettings} >Settings</DropdownMenuItem>
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
