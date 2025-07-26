import { Router } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { signAccess, signRefresh, verifyJwt } from '../utils/jwt.js';
import { sha1, subnet } from '../utils/crypto.js';
import { createUser, findUserByEmail } from '../services/user.service.js';
import dotenv from "dotenv";
import { csrfProtection } from '../middleware/csrf.js';
dotenv.config();
const router = Router();

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.COOKIE_SECURE === 'true',
};

router.post('/login', csrfProtection, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const fp = sha1(req.get('user-agent') + subnet(req.ip));
    const access = signAccess({ uid: user.id, role: user.role, fp, jti: uuidv4() });
    const refresh = signRefresh({ uid: user.id, fp, jti: uuidv4() });

    return res
      .cookie('access', access, { ...COOKIE_OPTS, maxAge: 10 * 60 * 1000 })
      .cookie('refresh', refresh, { ...COOKIE_OPTS, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .json({ csrfToken: req.csrfToken() });

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error })
  }
});

router.post('/refresh', (req, res) => {
  try {
    const refresh = req.cookies.refresh;
    if (!refresh) {
      return res.status(401).json({ message: 'Refresh token missing' });
    }

    const payload = verifyJwt(refresh); // throws if invalid/expired

    // Optionally check token ID / version from DB here for logout tracking

    const access = signAccess({ sub: payload.sub });

    return res.cookie('access', access, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.COOKIE_SECURE === 'true',
      maxAge: 10 * 60 * 1000, // 10 mins
    })
      .json({ csrfToken: req.csrfToken() }); // 🔐 send new CSRF token
  } catch (err) {
    console.error('Refresh failed:', err.message);
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
});
router.post('/logout', (req, res) => {
  res
    .clearCookie('access', COOKIE_OPTS)
    .clearCookie('refresh', COOKIE_OPTS)
    .sendStatus(204);
});

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const existing = await findUserByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email already exists' });
    const hash = await bcrypt.hash(password, 10);
    await createUser(email, hash);
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error })
  }
});

export default router;