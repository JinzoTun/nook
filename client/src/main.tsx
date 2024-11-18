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
import Profile from "@/pages/Profile";
import CreatePost from './components/CreatePost';
import Post from "@/components/Post";

import PostList from './components/PostList';
import AllDens from './components/AllDens';

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
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/post",
    element: <Home><CreatePost/></Home>  
  },
  {
    path: "/post/:id",
    element: <Home><Post/></Home>
  },
  {
    path: "/dens",
    element: <Home><AllDens/></Home>
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      </ThemeProvider>
  </StrictMode>,
)
