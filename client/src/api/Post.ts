import axios from "axios";
import {API} from "../config/server";
import { Post } from "../interfaces/interfaces";

// Create a new post
export const createPost = async (token: string, post: FormData): Promise<Post> => {
  try {
    const response = await axios.post(`${API}/api/posts`, post, {
      headers: {
        token: token,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }
}

// Fetch all posts from the server
export const fetchAllPosts = async (pageNumber: number, limit: number = 10): Promise<Post[]> => {
  try {
    const response = await axios.get(`${API}/api/posts?page=${pageNumber}&limit=${limit}`);
    return response.data.posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
};

// Fetch a single post by id 
export const fetchPostById = async (id: string): Promise<Post> => {
  try {
    const response = await axios.get(`${API}/api/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw new Error("Failed to fetch post");
  }
};


// fetch posts from followed users
export const fetchFollowingPosts = async (token: string): Promise<Post[]> => {
  try {
    const response = await axios.get(`${API}/api/posts/p/following`, {
      headers: {
        token: token,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching  posts:", error);
    throw new Error("Failed to fetch posts");
  }
};

// fetch posts sorted by most liked
export const fetchPopularPosts = async (): Promise<Post[]> => {
  try {
    const response = await axios.get(`${API}/api/posts/p/votes`);
    return response.data;
  } catch (error) {
    console.error("Error fetching  posts:", error);
    throw new Error("Failed to fetch posts");
  }
};