/*
 * Responsibility: Receive HTTP requests,
 * communicate with the service, and return HTTP responses.
 */

import pool from "../database.js";

async function findAll() {
  const [allUsers] = await pool.query(`SELECT * FROM users`);
  return allUsers;
}

async function findById(id) {
  const [userSelected] = await pool.query(
    `SELECT * 
      FROM users
      WHERE id = ?
      `,
    [id],
  );
  return userSelected[0];
}
                    

// console.log(await findAll())
// console.log(await findById(2));

export default { findAll, findById };