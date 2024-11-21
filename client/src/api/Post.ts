import axios from "axios";
import {API} from "../config/server";
import { Post } from "../interfaces/interfaces";

// Create a new post
export const createPost = async (title: string, body: string, denId: string, token: string): Promise<void> => {
  try {
    await axios.post(
      `${API}/api/posts`,
      { title, body, denId },
      {
        headers: {
          token,
        },
      }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }
};

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