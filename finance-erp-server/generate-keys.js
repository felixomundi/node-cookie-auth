import { generateKeyPairSync } from 'crypto';
import fs from 'fs';

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
});

fs.mkdirSync('./keys', { recursive: true });
fs.writeFileSync('./keys/private.key', privateKey);
fs.writeFileSync('./keys/public.key', publicKey);

console.log('Keys generated in ./keys');
