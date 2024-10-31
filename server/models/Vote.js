import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  voteType: { type: String, enum: ["upvote", "downvote"], required: true },
}, { timestamps: true });

voteSchema.index({ userId: 1, postId: 1 }, { unique: true }); // Ensure one vote per user per post

const Vote = mongoose.model("Vote", voteSchema);
export default Vote;
