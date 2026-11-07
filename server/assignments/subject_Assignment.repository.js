import pool from "../database.js";

async function findAll() {
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
  return subjectSelected[0];
}

async function create(title, instructor) {
  const [created] = await pool.query(
    `INSERT INTO subjects (title, instructor) 
    VALUES (?, ?)`,
    [title, instructor],
  );
  return findById(created.insertId);
}

// console.log(await create("Socal & Professional Issues", "Ms. Tamayo"));
console.log(await findAll());
