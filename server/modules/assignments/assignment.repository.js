/*
* 
* 
* Responsibility: Receive HTTP requests,
* communicate with the service, and return HTTP responses.
* 
* 
*/
import pool from "../../config/database.js";

async function findAll() {
  const [allAssignment] = await pool.query(`SELECT * FROM assignments`);
  return allAssignment;
}

async function findById(id) {
  const [assignmentSelected] = await pool.query(
    `SELECT * 
      FROM assignments
      WHERE id = ?
      `,
    [id],
  );
  return assignmentSelected[0];
}

async function create(title, due_date, subject_id) {
  const [created] = await pool.query(
    `INSERT INTO assignments (title, due_date, subject_id) 
    VALUES (?, ?, ?)`,
    [title, due_date, subject_id],
  );
  return findById(created.insertId);
}

async function deleteById(id) {
  const [targetDel] = await pool.query(
    `DELETE FROM assignments WHERE id = ? `,
    [id],
  );
  return targetDel.affectedRows > 0;
}

// async function updateById(id) {
//   const targetID = await pool.query(`UPDATE assignment
//   set `);
// }

// console.log(await deleteById(1))



export { findAll, findById, create, deleteById };
