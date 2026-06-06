import express from 'express';
import { getColleges, createCollege } from '../controllers/college.controller.js';

const router = express.Router();

router.get('/', getColleges);
router.post('/', createCollege);

export default router;