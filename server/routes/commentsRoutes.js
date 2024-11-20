import express from 'express';
import {createComment, getCommentsByPostId, deleteComment } from '../controllers/commentController.js';
import { protectRoute } from '../middlewares/authMiddlware.js';

const router = express.Router();

router.post('/:postId', protectRoute, createComment); // Route to create a comment
router.get('/:postId' ,getCommentsByPostId); // Route to get comments by post id
router.delete('/:id', protectRoute, deleteComment); // Route to delete a comment


export default router;