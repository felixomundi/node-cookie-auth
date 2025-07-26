import { Router } from 'express';
import { authGuard } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { csrfProtection } from '../middleware/csrf.js';
import dotenv from "dotenv";
dotenv.config();
const router = Router();

router.post('/post-journal', csrfProtection, authGuard, requireRole(['accountant', 'admin']), (req, res) => {
  // Example payload validation omitted for brevity
  // TODO: insert journal entry logic
  res.json({ message: 'Journal entry posted (demo)' });
});

export default router;