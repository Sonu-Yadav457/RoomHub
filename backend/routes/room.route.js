import express from 'express';
import { getRoomsByDepartment } from '../controllers/room.controller.js';

const router = express.Router();

router.get('/department/:departmentId', getRoomsByDepartment);
export default router;