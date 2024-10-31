// models/Post.js
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User schema
      required: true,
    },
    votes : {
      type: Number,
      default: 0,
    
    }
  },
  { timestamps: true } // Enables createdAt and updatedAt fields
);

const Post = mongoose.model('Post', postSchema);
export default Post;
