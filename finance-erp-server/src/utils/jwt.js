// import jwt from 'jsonwebtoken';
// import dotenv from "dotenv";
// dotenv.config();
// const ACCESS_EXPIRES = '10m';
// const REFRESH_EXPIRES = '7d';

// export function signAccess(payload) {
//   return jwt.sign(payload, process.env.JWT_PRIVATE, {
//     algorithm: 'RS256',
//     expiresIn: ACCESS_EXPIRES,
//     audience: 'finance-api',
//   });
// }

// export function signRefresh(payload) {
//   return jwt.sign(payload, process.env.JWT_PRIVATE, {
//     algorithm: 'RS256',
//     expiresIn: REFRESH_EXPIRES,
//     audience: 'finance-refresh',
//   });
// }

// export function verifyJwt(token, audience) {
//   return jwt.verify(token, process.env.JWT_PUBLIC, {
//     algorithms: ['RS256'],
//     audience,
//   });
// }


import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const ACCESS_EXPIRES = '15m';
const REFRESH_EXPIRES = '7d';

const PRIVATE_KEY = fs.readFileSync(path.resolve('keys/private.key'), 'utf8');
const PUBLIC_KEY = fs.readFileSync(path.resolve('keys/public.key'), 'utf8');

export function signAccess(payload) {
  return jwt.sign(payload, PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: ACCESS_EXPIRES,
    audience:'finance-erp'
  });
}

export function signRefresh(payload) {
  return jwt.sign(payload, PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: REFRESH_EXPIRES,
    audience:'finance-erp'
  });
}

export function verifyJwt(token) {
  return jwt.verify(token, PUBLIC_KEY, {
    algorithms: ['RS256'],
    audience:'finance-erp'
  });
}
