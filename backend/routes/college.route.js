import express from 'express';
import { getColleges } from '../controllers/college.controller.js';

const router = express.Router();

router.get('/', getColleges);

export default router;