import User from '../models/user.js';

// Get user profile (protected route)
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile (protected route)
export const updateUserProfile = async (req, res) => {
    const { avatar, username, email, password, bio } = req.body;

    try {
        const user = await User.findById(req.user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's information if provided
        if (avatar) user.avatar = avatar;
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = password; // Will be hashed before save
        if ( bio) user.bio = bio ;

        await user.save();
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete user account (protected route)
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.remove();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users (admin route, for example)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
