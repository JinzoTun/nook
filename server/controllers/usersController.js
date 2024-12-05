import cloudinary from '../config/cloudinary.js';
import User from '../models/user.js';

// Update user profile (protected route)
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        const { username, email, password, bio } = req.body;

        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = password; // Ensure hashing before saving
        if (bio) user.bio = bio;

        // Upload avatar if provided
        if (req.files?.avatar) {
            const avatarUpload = await cloudinary.uploader.upload(req.files.avatar[0].path, {
                folder: 'nook/user/avatars',
                public_id: `avatar_${user._id}`,
                overwrite: true,
            });
            user.avatar = avatarUpload.secure_url; // Update user avatar URL
        }

        // Upload banner if provided
        if (req.files?.banner) {
            const bannerUpload = await cloudinary.uploader.upload(req.files.banner[0].path, {
                folder: 'nook/user/banners',
                public_id: `banner_${user._id}`,
                overwrite: true,
            });
            user.banner = bannerUpload.secure_url; // Update user banner URL
        }

        await user.save();

        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Get user profile (protected route)
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user)
            .populate({
                path: 'posts',  // Populate posts
                populate: { path: 'author', select: 'username avatar' }  // Populate author with only username and avatar
            })
            .populate('followers', '_id username avatar') // Populate followers with only username and avatar
            .populate('following', '_id username avatar') // Populate following with only username and avatar
            .select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// get user by id
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        .populate({
            path: 'posts',  // Populate posts
            populate: { path: 'author', select: 'username avatar' }  // Populate author with only username and avatar
        })
        .select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
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

// List all joined Dens
export const getJoinedDens = async (req, res) => {
    try {
        const user = await User.findById(req.user).populate('joinedDens');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.joinedDens);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// follow a user    
export const followUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user); // Get current user

        if (!user) { 

            return res.status(404).json({ message: 'User not found' });
        }

        if (user.followers.includes(req.user)) {
            return res.status(200).json({ message: 'You are already following this user' });
        }

        await user.updateOne({ $push: { followers: req.user } }); // Add follower
        await currentUser.updateOne({ $push: { following: req.params.id } }); // Add following

        res.json({ message: 'User followed successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }

}

// unfollow a user 
export const unfollowUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user); // Get current user

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.followers.includes(req.user)) {
            return res.status(200).json({ message: 'You are not following this user' });
        }

        await user.updateOne({ $pull: { followers: req.user } }); // Remove follower
        await currentUser.updateOne({ $pull: { following: req.params.id } }); // Remove following

        res.json({ message: 'User unfollowed successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }

}