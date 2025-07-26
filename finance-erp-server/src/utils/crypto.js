import crypto from 'crypto';

export function sha1(str) {
  return crypto.createHash('sha1').update(str).digest('hex');
}

export function subnet(ip) {
  if (!ip) return '';
  const parts = ip.split('.');
  return parts.length === 4 ? parts.slice(0, 3).join('.') : ip;
}