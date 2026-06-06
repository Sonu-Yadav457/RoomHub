import Room from '../models/Room.model.js';
import Department from '../models/Department.model.js';

export const getRoomsByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const rawRooms = await Room.find({ departmentId });

    const now = new Date();
    
    // Map Javascript array indexing to day strings
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[now.getDay()];

    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeString = `${currentHours}:${currentMinutes}`;

    const calculatedRooms = rawRooms.map(room => {
      let isOccupied = false;
      let currentClass = "";

      // Look up if any scheduled timeline matching slot exists right now
      const activeSlot = room.timetable.find(slot => {
        return slot.day === currentDay && 
               currentTimeString >= slot.startTime && 
               currentTimeString <= slot.endTime;
      });

      if (activeSlot) {
        isOccupied = true;
        currentClass = activeSlot.subject;
      }

      return {
        _id: room._id,
        roomNumber: room.roomNumber,
        departmentId: room.departmentId,
        isOccupied,
        currentClass
      };
    });

    res.status(200).json(calculatedRooms);
  } catch (error) {
    res.status(500).json({ message: 'Error processing timetable matrix', error: error.message });
  }
};

export const createRoom = async (req, res) => {
  try {
    const { departmentId, roomNumber } = req.body;

    // 1. Validation check for required fields
    if (!departmentId || !roomNumber) {
      return res.status(400).json({ message: 'Please provide both departmentId and roomNumber.' });
    }

    // 2. Verify that the parent department actually exists
    const parentDept = await Department.findById(departmentId);
    if (!parentDept) {
      return res.status(404).json({ message: 'Parent department not found. Provide a valid departmentId.' });
    }

    // 3. Prevent duplicate room numbers within the SAME department block
    const roomExists = await Room.findOne({
      departmentId,
      roomNumber: roomNumber.trim().toUpperCase()
    });

    if (roomExists) {
      return res.status(400).json({ message: `Room ${roomNumber} already exists in this department.` });
    }

    // 4. Create and save the new room record (starts with an empty timetable array)
    const newRoom = await Room.create({
      departmentId,
      roomNumber: roomNumber.trim().toUpperCase(),
      timetable: []
    });

    res.status(201).json({
      message: `Room ${newRoom.roomNumber} successfully added to department!`,
      room: newRoom
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create room record', error: error.message });
  }
};

export const addTimetableSlots = async (req, res) => {
  try {
    const { roomId, slots } = req.body;

    // 1. Validation check
    if (!roomId || !slots || !Array.isArray(slots)) {
      return res.status(400).json({ 
        message: 'Invalid payload. Please provide a roomId string and a slots array.' 
      });
    }

    // 2. Use Mongoose $push with $each to append multiple slots into the array smoothly
    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      {
        $push: { timetable: { $each: slots } }
      },
      { new: true, runValidators: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: 'Target classroom not found.' });
    }

    res.status(200).json({
      message: `Successfully appended ${slots.length} schedule slots to room ${updatedRoom.roomNumber}!`,
      room: updatedRoom
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to append timetable data', 
      error: error.message 
    });
  }
};