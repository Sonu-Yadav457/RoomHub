import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department', // Links this ID directly to the Department collection
    required: [true, 'A room must belong to a specific department']
  },
  roomNumber: {
    type: String,
    required: [true, 'Please add a room number or name (e.g., SPS-01, Lab-3)'],
    trim: true
  },
  isOccupied: {
    type: Boolean,
    default: false // false means it is an EMPTY room, true means class happening
  },
  currentClass: {
    type: String,
    default: "" // e.g., "CO202 - Data Structures Lecture" if occupied
  },
  lastUpdatedBy: {
    type: String,
    default: "System" // Will hold user tracking info later
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensures a room number is unique within its specific department context
RoomSchema.index({ departmentId: 1, roomNumber: 1 }, { unique: true });

export default mongoose.model('Room', RoomSchema);