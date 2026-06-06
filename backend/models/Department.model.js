import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College', // Links this ID directly to the College collection
    required: [true, 'A department must belong to a specific college']
  },
  name: {
    type: String,
    required: [true, 'Please add a department name'],
    trim: true
  },
  shortCode: {
    type: String,
    required: [true, 'Please add a department code (e.g., CSE)'],
    uppercase: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// To prevent duplicate departments within the SAME college (e.g., Two CSEs in DTU)
DepartmentSchema.index({ collegeId: 1, shortCode: 1 }, { unique: true });

export default mongoose.model('Department', DepartmentSchema);