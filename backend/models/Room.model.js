import mongoose from 'mongoose';

const TimetableSlotSchema = new mongoose.Schema({
  day: { type: String, required: true, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
  startTime: { type: String, required: true }, // 24-hour format string, e.g., "09:00"
  endTime: { type: String, required: true },   // 24-hour format string, e.g., "10:00"
  subject: { type: String, required: true }    // e.g., "CO202 - Data Structures"
});

const RoomSchema = new mongoose.Schema({
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  roomNumber: { type: String, required: true, trim: true },
  
  // Timetable definition structure
  timetable: [TimetableSlotSchema],

  // Crowdsourcing overrides (takes precedence if active)
  isOverrideActive: { type: Boolean, default: false },
  overrideIsOccupied: { type: Boolean, default: false },
  overrideCurrentClass: { type: String, default: "" },
  overrideExpiresAt: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model('Room', RoomSchema);