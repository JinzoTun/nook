// routes/postRoutes.js
import express from 'express';
import { createPost, getAllPosts, getPost, getCommentsCount, getFollowingPosts, getPostsByVotes  } from '../controllers/postController.js';
import { protectRoute } from '../middlewares/authMiddlware.js';
import multer from '../middlewares/multer.js'; // Import Multer setup


const router = express.Router();

router.post('/', protectRoute,
    multer.fields([
        { name: 'image', maxCount: 1 }, // Handle single image upload
        { name: 'video', maxCount: 1 }, // Handle single video upload
    ]),
     createPost); // Route to create a post
     
router.get('/', getAllPosts); // Route to get all posts
router.get('/:id', getPost );
router.get('/p/following',  protectRoute, getFollowingPosts );
router.get('/p/votes', getPostsByVotes );

router.get('/commentsCount/:id', getCommentsCount );


export default router;