import { pool } from '../db.js';

export async function findUserByEmail(email) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

export async function findUserById(id) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
}
export async function createUser(email, hash, role) {
  await pool.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash]);
}