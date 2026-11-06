import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
/*
{
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
}
*/

export default pool;