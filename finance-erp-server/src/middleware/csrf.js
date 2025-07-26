import csrf from 'csurf';
import dotenv from "dotenv";
dotenv.config();

export const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true',
  },
});

