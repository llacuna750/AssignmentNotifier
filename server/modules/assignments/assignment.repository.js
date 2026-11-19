/**
* 
* 
* ? Responsibility: Receive HTTP requests,
* ? communicate with the service, and return HTTP responses.
* 
* 
*/
import pool from "../../config/database.js";

async function findAll(userId) {
  const [allAssignment] = await pool.execute(
    `SELECT assignments.id, assignments.title, assignments.due_date,
            assignments.status, assignments.subject_id, assignments.created_at
       FROM assignments
       INNER JOIN subjects ON subjects.id = assignments.subject_id
       WHERE subjects.user_id = ?
       ORDER BY assignments.due_date ASC`,
    [userId],
  );
  return allAssignment;
}

async function findByIdForUser(id, userId) {
  const [assignmentSelected] = await pool.execute(
    `SELECT assignments.id, assignments.title, assignments.due_date,
            assignments.status, assignments.subject_id, assignments.created_at
       FROM assignments
       INNER JOIN subjects ON subjects.id = assignments.subject_id
       WHERE assignments.id = ? AND subjects.user_id = ?`,
    [id, userId],
  );
  return assignmentSelected[0];
}

async function createForUser(title, dueDate, subjectId, userId) {
  const [created] = await pool.execute(
    `INSERT INTO assignments (title, due_date, subject_id)
     SELECT ?, ?, subjects.id
       FROM subjects
       WHERE subjects.id = ? AND subjects.user_id = ?`,
    [title, dueDate, subjectId, userId],
  );
  if (created.affectedRows === 0) return null;

  return findByIdForUser(created.insertId, userId);
}

async function deleteByIdForUser(id, userId) {
  const [targetDel] = await pool.execute(
    `DELETE assignments
       FROM assignments
       INNER JOIN subjects ON subjects.id = assignments.subject_id
       WHERE assignments.id = ? AND subjects.user_id = ?`,
    [id, userId],
  );
  return targetDel.affectedRows > 0;
}

// async function updateById(id) {
//   const targetID = await pool.query(`UPDATE assignment
//   set `);
// }

// console.log(await deleteById(1))



export {
  findAll,
  findByIdForUser,
  createForUser,
  deleteByIdForUser,
};
