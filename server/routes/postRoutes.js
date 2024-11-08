// routes/postRoutes.js
import express from 'express';
import { createPost, getAllPosts, getPost  } from '../controllers/postController.js';
import { protectRoute } from '../middlewares/authMiddlware.js'

const router = express.Router();

router.post('/', protectRoute, createPost); // Route to create a post
router.get('/', getAllPosts); // Route to get all posts
router.get('/:id', getPost );

export default router;