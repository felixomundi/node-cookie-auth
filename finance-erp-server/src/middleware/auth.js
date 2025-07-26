import { verifyJwt } from '../utils/jwt.js';
import { sha1, subnet } from '../utils/crypto.js';

export function authGuard(req, res, next) {
  const token = req.cookies.access;
  if (!token) return res.sendStatus(401);

  let decoded;
  try {
    decoded = verifyJwt(token, 'finance-api');
  } catch {
    return res.sendStatus(401);
  }

  const fp = sha1(req.get('user-agent') + subnet(req.ip));
  if (decoded.fp !== fp) return res.sendStatus(401);

  req.user = decoded;
  next();
}