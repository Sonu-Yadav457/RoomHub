import mongoose from 'mongoose';

const CollegeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please add a university name'], 
    unique: true,
    trim: true 
  },
  shortCode: { 
    type: String, 
    required: [true, 'Please add a short code (e.g., DTU)'], 
    unique: true, 
    uppercase: true,
    trim: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model('College', CollegeSchema);
