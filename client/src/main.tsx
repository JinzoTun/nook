import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider"

import Home from "@/pages/Home";
import Register from './pages/Register';
import Login from "@/pages/Login";
import Settings from "@/pages/Settings";
import TermsOfService from './pages/TermsOfService';

import CreatePost from './components/CreatePost';
import CreateDen from './components/CreateDen';
import Post from "@/components/Post";
import Profile from '@/components/Profile';
import PostList from './components/AllPosts';
import AllDens from './components/AllDens';
import Den from './components/Den';
import Following from './components/Following';
import Popular from './components/Popular';

import Chat from './pages/Chat';

import { UserProvider } from "@/context/UserContext";



const router = createBrowserRouter([
  {
    path: "/",
    element: <Home><PostList /></Home>,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/Settings",
    element: <Settings />,
  },
  {
    path: "/create",
    element: <Home><CreatePost/></Home>  
  },
  {
    path: "/p/:id",
    element: <Home><Post/></Home>
  },
  {
    path: "/dens",
    element: <Home><AllDens/></Home>
  },
  {
    path: "/d/:id",
    element: <Home><Den/></Home>
  },
  {
    path: "/d/create",
    element: <Home><CreateDen/></Home>
  },
  {
    path: "/u/:id",
    element: <Home><Profile/></Home>
  },
  {
    path: "/terms",
    element: <TermsOfService />,
  },
  {
    path: "/following",
    element: <Home><Following/></Home>
  },
  { 
    path: "/popular",
    element: <Home><Popular/></Home>
  },
  {
    path: "/chat",
    element: <Home><Chat/></Home>
  }

]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <UserProvider>
      <RouterProvider router={router} />
      </UserProvider>
      </ThemeProvider>
  </StrictMode>,
)
