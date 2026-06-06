import College from '../models/College.model.js';

// @desc    Get all colleges for the homepage selection
// @route   GET /api/colleges
export const getColleges = async (req, res) => {
  try {
    const colleges = await College.find({}); // Fetch all colleges without any filters
    res.status(200).json(colleges);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching colleges', error: error.message });
  }
};

export const createCollege = async (req, res) => {
  try {
    const { name, shortCode } = req.body;

    // 1. Validation check for required fields
    if (!name || !shortCode) {
      return res.status(400).json({ message: 'Please provide both the college name and shortCode.' });
    }

    // 2. Prevent duplicate entries (e.g., adding DTU twice)
    const collegeExists = await College.findOne({ 
      $or: [
        { name: name.trim() }, 
        { shortCode: shortCode.trim().toUpperCase() }
      ] 
    });

    if (collegeExists) {
      return res.status(400).json({ message: 'A college with this name or short code already exists.' });
    }

    // 3. Create and save the new college record
    const newCollege = await College.create({
      name: name.trim(),
      shortCode: shortCode.trim().toUpperCase()
    });

    res.status(201).json({
      message: 'College successfully added to the database!',
      college: newCollege
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create college record', error: error.message });
  }
};