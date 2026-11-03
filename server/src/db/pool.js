import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.DB_PASSWORD,
    database: process.env.DB_NAME,
  })
  .promise();

try {
  await pool.query("SELECT 1");
  console.log("Database connected!\n");
} catch (error) {
  console.log("Connection error:", error.message);
}

async function showDatabases() {
  const [showDB] = await pool.query(`SHOW DATABASES;`);
  console.log("Databases:");
  for (const [key, val] of Object.entries(showDB)) {
    console.log(`${Number(key) + 1}. ${val.Database}`);
  }
}

async function getallAssignment() {
  const [selectAssignment] = await pool.query(`SELECT * FROM assignment`);
  return selectAssignment;
}

async function getAssByID(id) {
  const [assignmentSelected] = await pool.query(
    `SELECT * 
    FROM assignment
    WHERE id = ?
    `,
    [id],
  );
  return assignmentSelected[0];
}

async function createAssignment(title, subject) {
  const [created] = await pool.query(
    `INSERT IGNORE INTO assignment (title, subject) 
        VALUES (?, ?)`,
    [title, subject],
  );
  const id = created.insertId;
  return created.insertId !== 0
    ? getAssByID(id)
    : "Failed to create because it is duplicated title.";
}

async function deleteAssignment(id) {
  const [targetDel] = await pool.query(`DELETE FROM assignment WHERE id = ? `, [
    id,
  ]);
  return targetDel.affectedRows !== 0
    ? `Succesfully row deleted!`
    : `ID not found`;
}

export { getallAssignment, getAssByID, createAssignment, deleteAssignment };
