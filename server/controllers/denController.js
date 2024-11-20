import Den from '../models/Den.js';
import User from '../models/user.js';

// Create a new Den and join 
export const createDen = async (req, res) => {
  try {
    const { name, description, visibility, categories, tags, rules, banner, avatar, flair } = req.body;
    const createdBy = req.user; // Assuming `req.user` holds the authenticated user

    // Check if Den with the same name already exists
    const existingDen = await Den.findOne({ name });
    if (existingDen) {
      return res.status(400).json({ message: 'Den name already exists.' });
    }

    const newDen = new Den({
      name,
      description,
      createdBy,
      visibility,
      categories,
      tags,
      rules,
      banner,
      avatar,
      flair,
    });

    const savedDen = await newDen.save();

    // Add the creator as a member of the Den
    const user = await User.findById(createdBy);
    const den = await Den.findById(savedDen._id);

    user.joinedDens.addToSet(savedDen._id); // Use `addToSet` to avoid duplicates
    den.members.addToSet(createdBy); // Use `addToSet` to avoid duplicates
    await user.save(); 


    res.status(201).json(savedDen);

  } catch (error) {
    res.status(500).json({ message: 'Error creating Den', error: error.message });
  }
};

// Get a specific Den by ID
export const getDenById = async (req, res) => {
  try {
    const den = await Den.findById(req.params.denId)
        .populate('members')
        .populate('moderators')
        .populate({
          path: 'posts',
          populate: {
            path: 'author' // Populate the 'author' field within 'posts'
          },
        });

    if (!den) {
      return res.status(404).json({ message: 'Den not found' });
    }

    res.json(den);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Den', error: error.message });
  }
};

// Update a Den
export const updateDen = async (req, res) => {
  try {
    const { denId } = req.params;
    const updates = req.body;

    // Only the creator or a moderator can update
    const den = await Den.findById(denId);
    if (!den) return res.status(404).json({ message: 'Den not found' });

    if (!den.createdBy.equals(req.user._id) && !den.moderators.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to update this Den' });
    }

    const updatedDen = await Den.findByIdAndUpdate(denId, updates, { new: true });
    res.json(updatedDen);
  } catch (error) {
    res.status(500).json({ message: 'Error updating Den', error: error.message });
  }
};

// Delete a Den
export const deleteDen = async (req, res) => {
  try {
    const { denId } = req.params;

    // Only the creator can delete
    const den = await Den.findById(denId);
    if (!den) return res.status(404).json({ message: 'Den not found' });

    if (!den.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this Den' });
    }

    await Den.findByIdAndDelete(denId);
    res.json({ message: 'Den deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Den', error: error.message });
  }
};

// List all Dens (with optional filtering)
export const getAllDens = async (req, res) => {
  try {
    const { visibility, tags, categories } = req.query;
    const filter = {};

    // Apply filters if they exist in the query params
    if (visibility) filter.visibility = visibility;
    if (tags) filter.tags = { $in: tags.split(',') };
    if (categories) filter.categories = { $in: categories.split(',') };

    const dens = await Den.find(filter);
    res.json(dens);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Dens', error: error.message });
  }
};

// Join a Den and save the user as a member 
export const joinDen = async (req, res) => {
  try {
    const { denId } = req.params;
    const userId = req.user; 

    // Ensure `denId` is not undefined
    if (!denId) {
      return res.status(400).json({ message: 'denId is required in the route parameter' });
    }

    // Find the Den by ID
    const den = await Den.findById(denId);
    if (!den) {
      return res.status(404).json({ message: 'Den not found', denId });
    }

    // Check if the user is already a member
    if (den.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member of this Den' });
    }

    // Add user to the Den's members 
    // add den to user's myDen array 
    const user = await User.findById(userId); 
    user.joinedDens.addToSet(denId); // Use `addToSet` to avoid duplicates
    await user.save();

    den.members.addToSet(userId); // Use `addToSet` to avoid duplicates
    await den.save();

    res.status(200).json({ message: 'Successfully joined Den' });
  } catch (error) {
    console.error('Error joining Den:', error);
    res.status(500).json({ message: 'Error joining Den', error: error.message });
  }
};

/*
// Leave a Den and remove the user as a member
export const leaveDen = async (req, res) => {
  try {
    const { denId } = req.params;
    const userId = req.user.id;

    // Ensure `denId` is not undefined
    if (!denId) {
      return res.status(400).json({ message: 'denId is required in the route parameter' });
    }

    // Find the Den by ID
    const den = await Den.findById(denId);
    if (!den) {
      return res.status(404).json({ message: 'Den not found', denId });
    }

    // Check if the user is a member
    if (!den.members.includes(userId)) {
      return res.status(400).json({ message: 'User is not a member of this Den' });
    }

    // Remove user from the Den's members
    // remove den from user's myDen array
    const user = await User.findById(userId );
    user.myDen.pull(denId);
    await user.save();

    den.members.pull(userId);
    await den.save();

    res.status(200).json({ message: 'Successfully left Den' });
  }
  catch (error) {
    console.error('Error leaving Den:', error);
    res.status(500).json({ message: 'Error leaving Den', error: error.message });
  }
}

// Promote a user to moderator

export const promoteModerator = async (req, res) => {
  try {
    const { denId, userId } = req.params;

    // Ensure `denId` and `userId` are not undefined
    if (!denId || !userId) {
      return res.status(400).json({ message: 'denId and userId are required in the route parameter' });
    }

    // Find the Den by ID
    const den = await Den.findById(denId);
    if (!den) {
      return res.status(404).json({ message: 'Den not found', denId });
    }

    // Check if the user is a member
    if (!den.members.includes(userId)) {
      return res.status(400).json({ message: 'User is not a member of this Den' });
    }

    // Promote user to moderator
    den.moderators.addToSet(userId); // Use `addToSet` to avoid duplicates
    await den.save();

    res.status(200).json({ message: 'Successfully promoted user to moderator' });
  } catch (error) {
    console.error('Error promoting moderator:', error);
    res.status(500).json({ message: 'Error promoting moderator', error: error.message });
  }
}

// Demote a moderator to member

export const demoteModerator = async (req, res) => {
  try {
    const { denId, userId } = req.params;

    // Ensure `denId` and `userId` are not undefined
    if (!denId || !userId) {
      return res.status(400).json({ message: 'denId and userId are required in the route parameter' });
    }

    // Find the Den by ID
    const den = await Den.findById(denId);
    if (!den) {
      return res.status(404).json({ message: 'Den not found', denId });
    }

    // Check if the user is a moderator
    if (!den.moderators.includes(userId)) {
      return res.status(400).json({ message: 'User is not a moderator of this Den' });
    }

    // Demote user to member
    den.moderators.pull(userId);
    await den.save();

    res.status(200).json({ message: 'Successfully demoted moderator to member' });
  } catch (error) {
    console.error('Error demoting moderator:', error);
    res.status(500).json({ message: 'Error demoting moderator', error: error.message });
  }
}


// List all members of a Den

export const getDenMembers = async (req, res) => {
  try {
    const { denId } = req.params;

    // Ensure `denId` is not undefined
    if (!denId) {
      return res.status(400).json({ message: 'denId is required in the route parameter' });
    }

    // Find the Den by ID
    const den = await Den.findById(denId);
    if (!den) {
      return res.status(404).json({ message: 'Den not found', denId });
    }

    // Find all members of the Den
    const members = await User.find({ _id: { $in: den.members } });
    res.json(members);
  } catch (error) {
    console.error('Error fetching Den members:', error);
    res.status(500).json({ message: 'Error fetching Den members', error: error.message });
  }
}

// List all moderators of a Den 

export const getDenModerators = async (req, res) => {
  try {
    const { denId } = req.params;

    // Ensure `denId` is not undefined
    if (!denId) {
      return res.status(400).json({ message: 'denId is required in the route parameter' });
    }

    // Find the Den by ID
    const den = await Den.findById(denId);
    if (!den) {
      return res.status(404).json({ message: 'Den not found', denId });
    }

    // Find all moderators of the Den
    const moderators = await User.find({ _id: { $in: den.moderators } });
    res.json(moderators);
  } catch (error) {
    console.error('Error fetching Den moderators:', error);
    res.status(500).json({ message: 'Error fetching Den moderators', error: error.message });
  }
}
*/
