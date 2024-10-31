// controllers/postController.js
import Post from '../models/Post.js'; // Using import

// Create a new post
export const createPost = async (req, res) => {
  const { title, body } = req.body;
  const userId = req.user; // Get userId from the decoded token set in protectRoute

  if (!title || !body) {
    return res.status(400).json({ message: 'Title and body are required.' });
  }

  try {
    const post = await Post.create({
      title,
      body,
      author: userId,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post', error });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    // Optional: Implement pagination if needed
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 posts per page
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('author', 'username avatar') // Populate author field if you have username or avatar in user model
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 }); // Sort by creation date (assuming you have a createdAt timestamp in your model)

    res.status(200).json({
      success: true,
      page,
      limit,
      totalPosts: await Post.countDocuments(), // Count total documents for pagination
      posts,
    });
  } catch (error) {
    console.error('Error retrieving posts:', error); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve posts',
      error: error.message || 'Internal Server Error', // Provide a more detailed error message
    });
  }
};


// Update vote count
export const updateVoteCount = async (req, res) => {
  const { postId } = req.params; // Get post ID from request parameters
  const { voteType } = req.body; // Expect voteType in the request body ('upvote' or 'downvote')

  if (!['upvote', 'downvote'].includes(voteType)) {
    return res.status(400).json({ message: 'Invalid vote type. Must be "upvote" or "downvote".' });
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Update the votes based on the vote type
    post.votes += voteType === 'upvote' ? 1 : -1; // Increment or decrement votes
    await post.save(); // Save the updated post

    res.status(200).json({
      success: true,
      message: 'Vote updated successfully',
      votes: post.votes, // Return the updated votes count
    });
  } catch (error) {
    console.error('Error updating vote count:', error); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: 'Failed to update vote count',
      error: error.message || 'Internal Server Error',
    });
  }
};
