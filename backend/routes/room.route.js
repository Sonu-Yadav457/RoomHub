import express from 'express';
import { getRoomsByDepartment, toggleRoomStatus } from '../controllers/room.controller.js';

const router = express.Router();

router.get('/department/:departmentId', getRoomsByDepartment);
router.patch('/:roomId/toggle', toggleRoomStatus);
export default router;