import express from "express";
import { voteOnPost, getAllVotes } from "../controllers/voteController.js";
import { protectRoute } from '../middlewares/authMiddlware.js'

const router = express.Router();

// Route to handle voting on a post (upvote or downvote)
router.put("/posts/:postId/vote", protectRoute, voteOnPost);

// Route to get all votes
router.get("/votes", protectRoute, getAllVotes);

export default router;
