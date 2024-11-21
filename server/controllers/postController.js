import Post from '../models/Post.js';
import User from '../models/user.js';
import Den from '../models/Den.js';

// Create a new post
export const createPost = async (req, res) => {
  const { title, body, denId, image, video } = req.body; // Added `image` and `video`
  const userId = req.user; // User ID from the decoded token

  if (!title || !body) {
    return res.status(400).json({ message: 'Title and body are required.' });
  }

  try {
    // Determine the location and locationType based on the denId
    const location = denId && denId !== 'profile' ? denId : userId;
    const locationType = denId && denId !== 'profile' ? 'Den' : 'User';

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
