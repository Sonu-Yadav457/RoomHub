import express from 'express';
import { getDepartmentsByCollege } from '../controllers/departement.controller.js';

const router = express.Router();

router.get('/college/:collegeId', getDepartmentsByCollege);

export default router;