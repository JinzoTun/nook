import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// Create a new comment (postId, userId, content )  => POST /api/comments
export const createComment = async (req, res) => {
    const { content } = req.body;
    const postId = req.params.postId;
    const userId = req.user;

    console.log("postId "+ postId + "userId "+ userId)
    if (!postId) {
        return res.status(400).json({ message: 'postId is required.' });

    }
    if (!content) {
        return res.status(400).json({ message: 'content is required.' });
    }

    
    try {
        const comment = await Comment.create({
        post: postId.trim(),
        author: userId,
        content : content,
        });
        const post = await Post.findById(postId);
        post.comments.push(comment._id);
        await post.save();
        
    
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create comment', error });
    }
};

// Get all comments => GET /api/comments 
export const getComments = async (req, res) => {
    try {
        const comments = await Comment.find().populate('author').populate('post');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get comments', error });
    }
}

// Get a comment by id => GET /api/comments/:id
export const getCommentById = async (req, res) => {
    const { id } = req.params;
    try {
        const comment = await Comment.findById(id).populate('author').populate('post');
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get comment', error });
    }
}

// Get comments by post id => GET /api/comments/:postId

export const getCommentsByPostId = async (req, res) => {
    const { postId } = req.params;
    try {
        const comments = await Comment.find({ post: postId }).populate('author').populate('post');
        
        if (!comments) {
            return res.status(404).json({ message: "error" });
        }
        if(comments.length === 0){
            return res.status(200).json({ message: 'No comments found' });
        
        }
        res.json(comments);



    } catch (error) {
        res.status(500).json({ message: 'Failed to get comments', error });
    }
}



