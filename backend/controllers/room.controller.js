import Room from '../models/Room.model.js';

// @desc    Get all classrooms belonging to a specific department
// @route   GET /api/rooms/department/:departmentId
export const getRoomsByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const rooms = await Room.find({ departmentId });

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching rooms', error: error.message });
  }
};

// @desc    Toggle a classroom's availability status (Crowdsourcing)
// @route   PATCH /api/rooms/:roomId/toggle
export const toggleRoomStatus = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { isOccupied, currentClass } = req.body; // Incoming updates from the student

    // 1. Find the room and update its fields dynamically
    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      {
        isOccupied,
        currentClass: isOccupied ? currentClass : "", // Clear string if marked empty
        updatedAt: Date.now(),
        lastUpdatedBy: "Verified Student" // Hardcoded tracking for now (Auth will handle this later)
      },
      { new: true, runValidators: true } // 'new: true' returns the fresh updated document
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({
      message: 'Room status updated successfully!',
      room: updatedRoom
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating room status', error: error.message });
  }
};