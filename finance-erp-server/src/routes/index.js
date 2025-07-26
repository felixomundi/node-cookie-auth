import { Router } from 'express';
import auth from './auth.js';
import finance from './finance.js';
import { apiLimiter } from '../middleware/rate.js';
import dotenv from "dotenv";
dotenv.config();
const router = Router();
router.use(apiLimiter);
router.use('/auth', auth);
router.use('/finance', finance);

export default router;