import Department from '../models/Department.model.js';
import College from '../models/college.model.js';

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

export const createDepartment = async (req, res) => {
  try {
    const { collegeId, name, shortCode } = req.body;

    // 1. Validation check for required fields
    if (!collegeId || !name || !shortCode) {
      return res.status(400).json({ message: 'Please provide collegeId, department name, and shortCode.' });
    }

    // 2. Verify that the parent college actually exists in Atlas
    const parentCollege = await College.findById(collegeId);
    if (!parentCollege) {
      return res.status(404).json({ message: 'Parent college not found. Provide a valid collegeId.' });
    }

    // 3. Prevent duplicate branches within the SAME college (e.g., adding CSE to DTU twice)
    const deptExists = await Department.findOne({
      collegeId,
      $or: [
        { name: name.trim() },
        { shortCode: shortCode.trim().toUpperCase() }
      ]
    });

    if (deptExists) {
      return res.status(400).json({ message: `A branch with this name or code already exists at ${parentCollege.shortCode}.` });
    }

    // 4. Create and save the new branch record
    const newDepartment = await Department.create({
      collegeId,
      name: name.trim(),
      shortCode: shortCode.trim().toUpperCase()
    });

    res.status(201).json({
      message: `Branch successfully added to ${parentCollege.shortCode}!`,
      department: newDepartment
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create branch record', error: error.message });
  }
};