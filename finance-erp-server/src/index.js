import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import { apiLimiter } from './middleware/rate.js';
import router from './routes/index.js';
import dotenv from "dotenv";
import { csrfProtection } from './middleware/csrf.js';
dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(apiLimiter);

// CSRF protection middleware (configured but not applied globally)


// CSRF token endpoint (public)
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken(), {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true',
  });
  res.json({ csrfToken: req.csrfToken() });
});

// Mount API routes (apply csrfProtection inside individual routes where needed)
app.use('/api', router);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server listening on', PORT));