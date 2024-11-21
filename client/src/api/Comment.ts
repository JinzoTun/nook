import axios from "axios";
import { NewComment } from "@/interfaces/interfaces";
import {API} from "../config/server";



export async function createComment(comment: NewComment) {
    const { content, postId, userId } = comment;

    try {
        const response = await axios.post(
            `${API}/api/comments/${postId}`,
            { content },
            {
                headers: {
                    token: userId
                }
            }
        );
        fetchComments(postId);
        return response.data; // Return response data for further handling
    } catch (error) {
        console.error("Error posting comment:", error);
        throw error; // Rethrow error for the caller to handle
    }
}

export async function deleteComment(commentId: string, postId: string,  token: string) {
    try {
        const response = await axios.delete(`${API}/api/comments/${commentId}`, {
            headers: {
                token
            }
        });
        fetchComments(postId);
        return response.data;
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
    }
}

export async function fetchComments(postId: string) {
    try {
        const response = await axios.get(`${API}/api/comments/${postId}`);
        return response;
    } catch (error) {
        console.error("Error fetching comments:", error);
        throw error;
    }
}