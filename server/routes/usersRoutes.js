import express from 'express';
import { protectRoute } from '../middlewares/authMiddlware.js';
import {
    getUserProfile,
    updateUserProfile,
    deleteUser,
    getAllUsers
} from '../controllers/usersController.js';

const router = express.Router();

// User profile routes
router.get('/profile', protectRoute, getUserProfile); // Get logged-in user's profile
router.put('/profile', protectRoute, updateUserProfile); // Update profile
router.delete('/profile', protectRoute, deleteUser); // Delete account

// Admin route to get all users
router.get('/', protectRoute, getAllUsers); // Add admin middleware if needed

export default router;
