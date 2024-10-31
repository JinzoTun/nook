import Post from "../models/Post.js";
import Vote from "../models/Vote.js";
import mongoose from "mongoose";

export const voteOnPost = async (req, res) => {
  const { postId } = req.params;
  const { voteType } = req.body;
  const userId = req.user; // Assuming the middleware attaches userId to req.user

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const post = await Post.findById(postId).session(session);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }

    // Check if user has already voted on this post
    let existingVote = await Vote.findOne({ postId, userId }).session(session);

    if (existingVote) {
      // If the voteType matches, remove the vote
      if (existingVote.voteType === voteType) {
        const voteChange = voteType === "upvote" ? -1 : 1;
        await Post.findByIdAndUpdate(postId, { $inc: { votes: voteChange } }, { session });
        await existingVote.deleteOne({ session });
        
        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({ success: true, message: "Vote removed." });
      }

      // If voteType differs, reverse the vote (upvote to downvote or vice versa)
      const voteChange = voteType === "upvote" ? 2 : -2;
      await Post.findByIdAndUpdate(postId, { $inc: { votes: voteChange } }, { session });
      existingVote.voteType = voteType;
      await existingVote.save({ session });

      await session.commitTransaction();
      session.endSession();
      return res.status(200).json({ success: true, message: "Vote updated." });
    } else {
      // New vote
      const voteChange = voteType === "upvote" ? 1 : -1;
      await Post.findByIdAndUpdate(postId, { $inc: { votes: voteChange } }, { session });

      // Create a new vote record
      const newVote = new Vote({ postId, userId, voteType });
      await newVote.save({ session });

      await session.commitTransaction();
      session.endSession();
      return res.status(200).json({ success: true, message: "Vote cast." });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error voting:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Get all voteType for all posts of user_id to cache in the client side
export const getAllVotes = async (req, res) => {
  const userId = req.user;
  try {
    const votes = await Vote.find({ userId });
    //return voteType and postId to the client side

    if(votes.length === 0){
      return res.status(200).json({ success: true, votes: {} });
    }

    const voteMap = votes.reduce((acc, vote) => {
      acc[vote.postId] = vote.voteType;
      return acc;
    }, {}); // Create a map of postId: voteType

    res.status(200).json({ success: true, votes: voteMap });
  }
  catch (error) {
    console.error("Error getting votes:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
}

