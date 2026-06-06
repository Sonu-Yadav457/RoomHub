import mongoose from 'mongoose';

const CollegeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  shortCode: { type: String, required: true, trim: true, uppercase: true }
}, { timestamps: true });

// Fix: Check if model exists already, otherwise compile it
const College = mongoose.models.College || mongoose.model('College', CollegeSchema);
export default College;