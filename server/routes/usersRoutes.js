import express from 'express';
import { protectRoute } from '../middlewares/authMiddlware.js';
import multer from '../middlewares/multer.js'; // Import Multer setup
import {
    getUserProfile,
    updateUserProfile,
    getUserById,
    deleteUser,
    getAllUsers,
    getJoinedDens,
    followUser,
    unfollowUser,
    getUserNotifications
} from '../controllers/usersController.js';

const router = express.Router();

// User profile routes
router.get('/profile', protectRoute, getUserProfile); // Get logged-in user's profile

// Update profile with Multer middleware to handle avatar and banner uploads
router.put(
    '/profile',
    protectRoute,
    multer.fields([
        { name: 'avatar', maxCount: 1 }, // Handle single avatar upload
        { name: 'banner', maxCount: 1 }, // Handle single banner upload
    ]),
    updateUserProfile
);

router.delete('/profile', protectRoute, deleteUser); // Delete account

// Admin route to get all users
router.get('/', protectRoute, getAllUsers); // Add admin middleware if needed

// Get all Dens joined by the user
router.get('/dens', protectRoute, getJoinedDens);

// Get user by ID
router.get('/profile/:id', getUserById);

// Follow a user
router.put('/follow/:id', protectRoute, followUser);

// Unfollow a user
router.put('/unfollow/:id', protectRoute, unfollowUser);

// user notifcations
router.get('/notifications', protectRoute, getUserNotifications);



export default router;
