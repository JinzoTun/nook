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
import CreatePost from './components/CreatePost';
import CreateDen from './components/CreateDen';
import Post from "@/components/Post";
import Profile from '@/components/Profile';

import PostList from './components/PostList';
import AllDens from './components/AllDens';
import Den from './components/Den';

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
    path: "/post/:id",
    element: <Home><Post/></Home>
  },
  {
    path: "/dens",
    element: <Home><AllDens/></Home>
  },
  {
    path: "/den/:id",
    element: <Home><Den/></Home>
  },
  {
    path: "/den/create",
    element: <Home><CreateDen/></Home>
  },
  {
    path: "/profile/:id",
    element: <Home><Profile/></Home>
  },

]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      </ThemeProvider>
  </StrictMode>,
)
