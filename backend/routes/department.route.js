import express from 'express';
import { getDepartmentsByCollege, createDepartment } from '../controllers/departement.controller.js';

const router = express.Router();

router.get('/college/:collegeId', getDepartmentsByCollege);
router.post('/', createDepartment);

export default router;