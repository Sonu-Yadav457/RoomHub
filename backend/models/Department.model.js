import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  name: { type: String, required: true, trim: true },
  shortCode: { type: String, required: true, trim: true, uppercase: true }
}, { timestamps: true });

// Fix: Check if model exists already, otherwise compile it
const Department = mongoose.models.Department || mongoose.model('Department', DepartmentSchema);
export default Department;