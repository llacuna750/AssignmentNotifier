/*
 * Responsibility: Receive HTTP requests,
 * communicate with the service, and return HTTP responses.
 */

import pool from "../../config/database.js";

async function findAll() {
  const [allUsers] = await pool.execute(
    `SELECT id, name, email, role, created_at FROM users`,
  );
  return allUsers;
}

async function findByEmail(email) {
  const [userSelected] = await pool.execute(
    `SELECT * 
      FROM users
      WHERE email = ?
      `,
    [email],
  );
  return userSelected[0];
}

async function findById(id) {
  const [userSelected] = await pool.execute(
    `SELECT id, name, email, role, created_at 
      FROM users
      WHERE id = ?
      `,
    [id],
  );
  return userSelected[0];
}

async function create(userData) {
  const { name, email, password_hash } = userData;

  const [result] = await pool.execute(
    `INSERT INTO users (name, email, password_hash)
    VALUES (?, ?, ?)`,
    [name, email, password_hash],
  );

  return result.insertId;
}

export default { findAll, findByEmail, findById, create };
