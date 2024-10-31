import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { protectRoute } from '../middlewares/authMiddlware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protectRoute, (req, res) => {
    res.json({ message: `Welcome, user ${req.user}` });
});

export default router;
