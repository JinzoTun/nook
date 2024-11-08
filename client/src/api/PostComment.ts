import axios from "axios";

interface CommentProps {
    userId: string;
    postId: string;
    content: string;
}

async function PostComment(comment: CommentProps) {
    const { content, postId, userId } = comment;

    try {
        const response = await axios.post(
            `http://localhost:3000/api/comments/${postId}`,
            { content },
            {
                headers: {
                    token: userId
                }
            }
        );
        return response.data; // Return response data for further handling
    } catch (error) {
        console.error("Error posting comment:", error);
        throw error; // Rethrow error for the caller to handle
    }
}

export default PostComment;
