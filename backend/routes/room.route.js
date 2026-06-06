import express from 'express';
import { getRoomsByDepartment, createRoom, addTimetableSlots } from '../controllers/room.controller.js';

const router = express.Router();

router.get('/department/:departmentId', getRoomsByDepartment);
router.post('/', createRoom);
router.post('/timetable', addTimetableSlots);
export default router;