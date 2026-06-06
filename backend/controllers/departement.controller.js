import Department from '../models/Department.model.js';

// @desc    Get departments belonging to a specific college
// @route   GET /api/departments/college/:collegeId
export const getDepartmentsByCollege = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const departments = await Department.find({ collegeId });
    
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching departments', error: error.message });
  }
};