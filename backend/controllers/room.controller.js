import Room from '../models/Room.model.js';

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