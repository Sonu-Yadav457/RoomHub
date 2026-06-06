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