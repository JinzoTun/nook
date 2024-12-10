import Post from '../models/Post.js';
import User from '../models/user.js';
import Den from '../models/Den.js';
import cloudinary from '../config/cloudinary.js'; // Cloudinary config

import mongoose from 'mongoose';

// Create a new post
export const createPost = async (req, res) => {
  const { title, body, denId  } = req.body; // Added `image` and `video`
  const userId = req.user; // User ID from the decoded token

  if (!title || !body) {
    return res.status(400).json({ message: 'Title and body are required.' });
  }

  try {
    // Determine the location and locationType based on the denId
    const location = denId && denId !== 'profile' ? denId : userId;
    const locationType = denId && denId !== 'profile' ? 'Den' : 'User';

    // upload image to cloudinary if provided
    let image = null;

    if (req.files?.image) {
      const imageUpload = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: 'nook/posts/images',
        public_id: `image_${Date.now()}`,
        overwrite: true,
      });
      image = imageUpload.secure_url; // Store the Cloudinary URL
    }

    // upload video to cloudinary if provided
    let video = null;

    if (req.files?.video) {
      const videoUpload = await cloudinary.uploader.upload(req.files.video[0].path, {
        folder: 'nook/posts/videos',
        public_id: `video_${Date.now()}`,
        overwrite: true,
        resource_type: 'video', // Specify video upload

      });
      video = videoUpload.secure_url; // Store the Cloudinary URL
    }


    // Create the post
    const post = await Post.create({
      title,
      body,
      author: userId,
      location,
      locationType,
      image: image || null,
      video: video || null,
    });

    // Add the post to the user's posts
    await User.findByIdAndUpdate(
      userId,
      { $push: { posts: post._id } },
      { new: true }
    );

    // Add the post to the Den's posts if applicable
    if (locationType === 'Den') {
      await Den.findByIdAndUpdate(
        denId,
        { $push: { posts: post._id } },
        { new: true }
      );
    }

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Failed to create post', error });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('author', '_id username avatar email') // Populate author details
      .populate('location', '_id name') // Populate location details (Den or User)
      .populate({
        path: 'comments', // Populate comments
        populate: { path: 'author', select: '_id username avatar' }, // Populate comment authors
      })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      page,
      limit,
      totalPosts: await Post.countDocuments(),
      posts,
    });
  } catch (error) {
    console.error('Error retrieving posts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve posts',
      error: error.message || 'Internal Server Error',
    });
  }
};

// Get a single post by ID
export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id)
      .populate('author', '_id username avatar email') // Populate author
      .populate('location', '_id name') // Populate location (Den or User)
      .populate({
        path: 'comments', // Populate comments
        populate: { path: 'author', select: '_id username avatar' }, // Populate comment authors
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error('Error retrieving post:', error);
    res.status(500).json({
      message: 'Failed to retrieve post',
      error: error.message || 'Internal Server Error',
    });
  }
};

// Update vote count
export const updateVoteCount = async (req, res) => {
  const { postId } = req.params;
  const { voteType } = req.body;

  if (!['upvote', 'downvote'].includes(voteType)) {
    return res.status(400).json({ message: 'Invalid vote type. Must be "upvote" or "downvote".' });
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.votes += voteType === 'upvote' ? 1 : -1;
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Vote updated successfully',
      votes: post.votes,
    });
  } catch (error) {
    console.error('Error updating vote count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vote count',
      error: error.message || 'Internal Server Error',
    });
  }
};

// Get comments count
export const getCommentsCount = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const commentsCount = post.comments.length;

    res.status(200).json({ commentsCount });
  } catch (error) {
    console.error('Error retrieving comments count:', error);
    res.status(500).json({
      message: 'Failed to retrieve comments count',
      error: error.message || 'Internal Server Error',
    });
  }
};


// Get posts from followed users 
export const getFollowingPosts = async (req, res) => {
  try {
    // Get the logged-in user's ID
    const userId = req.user; // From JWT token (authMiddleware should set this)
    
    // Find the user and populate the 'following' field with the list of users they're following
    const user = await User.findById(userId).populate('following');
    
    // Get an array of user IDs that the logged-in user is following
    const followingIds = user.following.map(followingUser => new mongoose.Types.ObjectId(followingUser._id)); // Correct usage with `new`

    // Fetch posts from users they are following (use 'author' instead of 'user')
    const posts = await Post.find({ author: { $in: followingIds } }) // Corrected field name
      .populate('author', 'username') // Optionally, populate the username from the 'author' field
      .sort({ createdAt: -1 }); // Sort posts by creation date (newest first)

    res.status(200).json(posts); // Return the posts
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching feed' });
  }
}


// get posts sorted by top votes
export const getPostsByVotes = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', '_id username avatar email') // Populate author details
      .populate('location', '_id name') // Populate location details (Den or User)
      .populate({ path: 'comments', populate: { path: 'author', select: '_id username avatar' } }) // Populate comments 
      .sort({ votes: -1 }); // Sort by votes in descending order

    res.status(200).json(posts);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching posts' });
  }

}
