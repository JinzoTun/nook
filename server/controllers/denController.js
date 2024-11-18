import Den from '../models/Den.js';

// Create a new Den
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
    res.status(201).json(savedDen);
  } catch (error) {
    res.status(500).json({ message: 'Error creating Den', error: error.message });
  }
};

// Get a specific Den by ID
export const getDenById = async (req, res) => {
  try {
    const den = await Den.findById(req.params.denId).populate('createdBy', 'username').populate('moderators', 'username');
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

// Join a Den
export const joinDen = async (req, res) => {
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

    // Check if the user is already a member
    if (den.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member of this Den' });
    }

    // Add user to the Den's members
    den.members.addToSet(userId); // Use `addToSet` to avoid duplicates
    await den.save();

    res.status(200).json({ message: 'Successfully joined Den' });
  } catch (error) {
    console.error('Error joining Den:', error);
    res.status(500).json({ message: 'Error joining Den', error: error.message });
  }
};
