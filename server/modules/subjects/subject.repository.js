/*
 *
 *
 * Responsibility: Execute SQL queries and
 * communicate with the database.
 *
 *
 */
import pool from "../../config/database.js";

async function getAll(userId) {
  const [allSubject] = await pool.execute(
    `SELECT subjects.id, subjects.user_id, subjects.title,
    subjects.instructor, subjects.logo_path 
    from subjects
    subjects INNER JOIN users
    ON subjects.user_id = users.id 
    WHERE subjects.user_id = ?
    `,
    [userId],
  );
  return allSubject;
}

async function findById(id) {
  const [subjectSelected] = await pool.query(
    `SELECT * 
      FROM subjects
      WHERE id = ?
      `,
    [id],
  );
  return subjectSelected;
}

async function create(user_Id, title, instructor) {
  const [created] = await pool.query(
    `INSERT INTO subjects (user_id, title, instructor) 
    VALUES (?, ?, ?)`,
    [user_Id, title, instructor],
  );
  return findById(created.insertId);
}

export { getAll, findById, create };
