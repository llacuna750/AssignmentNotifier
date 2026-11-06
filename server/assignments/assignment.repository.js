import pool from "../database.js";

async function findAll() {
  const [selectAssignment] = await pool.query(`SELECT * FROM assignment`);
  return selectAssignment;
}

async function findById(id) {
  const [assignmentSelected] = await pool.query(
    `SELECT * 
      FROM assignment
      WHERE id = ?
      `,
    [id],
  );
  return assignmentSelected[0];
}

async function create(title, subject) {
  const [created] = await pool.query(
    `INSERT INTO assignment (title, subject) 
    VALUES (?, ?)`,
    [title, subject],
  );
  return findById(created.insertId);
}

async function deleteById(id) {
  const [targetDel] = await pool.query(`DELETE FROM assignment WHERE id = ? `, [
    id,
  ]);
  return targetDel.affectedRows > 0;
}

async function updateById(id) {
  const targetID = await pool.query(`UPDATE assignment 
  set `);
}

export { findAll, findById, create, deleteById };
