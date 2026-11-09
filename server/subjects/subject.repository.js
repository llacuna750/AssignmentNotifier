// * Responsibility: Execute SQL queries and communicate with the database.

import pool from "../database.js";

async function getAll() {
  const [allSubject] = await pool.query(`SELECT * FROM subjects`);
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
    `INSERT INTO subjects (user_Id, title, instructor) 
    VALUES (?, ?, ?)`,
    [user_Id, title, instructor],
  );
  return [findById(created.insertId)];
}

// console.log(await create(1, "", "Isabel"));
// console.log(await getAll());
// console.log(await findById(1000));

export default { getAll, findById, create };
