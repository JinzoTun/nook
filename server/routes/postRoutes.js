// routes/postRoutes.js
import express from 'express';
import { createPost, getAllPosts, getPost, getCommentsCount, getFollowingPosts  } from '../controllers/postController.js';
import { protectRoute } from '../middlewares/authMiddlware.js'

const router = express.Router();

router.post('/', protectRoute, createPost); // Route to create a post
router.get('/', getAllPosts); // Route to get all posts
router.get('/:id', getPost );
router.get('/p/following',  protectRoute, getFollowingPosts );

router.get('/commentsCount/:id', getCommentsCount );


export default router;