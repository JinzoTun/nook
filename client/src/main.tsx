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
import CreatePost from './pages/CreatePost';
import PostPage from './pages/PostPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
    element: <CreatePost/>
  },
  {
    path: "/post/:id",
    element: <PostPage/>
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      </ThemeProvider>
  </StrictMode>,
)
