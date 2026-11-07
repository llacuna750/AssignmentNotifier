import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// 1. Create a reusable connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


// 2.1 Query to create your initial users tables if they don't exist
const initusersTable = `
  CREATE TABLE users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY email_unique(email)
  )
`;


// 2.2 Query to create your initial subjects tables if they don't exist
const initsubjectTable = `
CREATE TABLE IF NOT EXISTS subjects ( 
  id int primary key auto_increment,
  user_id INT UNSIGNED not null,
  title varchar(100) not null,
  instructor varchar(100) not null,
  logo_path varchar(255) default null,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
    constraint fk_subjects_user
    foreign key (user_id) references users(id)
    on update cascade
    on delete restrict
  );
  `;
  
  // 2.3 Query to create your initial assignment tables if they don't exist
  const initassignmentTable = `
    CREATE TABLE IF NOT EXISTS assignments (
      id int primary key auto_increment,
      title varchar(150) not null,
      due_date datetime not null,
      status enum('pending', 'in_progress', 'completed') default 'pending',
      subject_id int,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
      constraint fk_assignment_subject
      foreign key(subject_id) 
      references subjects(id)
      on update cascade
      on delete restrict
    );
  `;


const initializaDatabase = async () => {
  try {
    // Create parent table first (subjects), then child table (assignments)
    await pool.execute(initusersTable);
    await pool.execute(initsubjectTable);
    await pool.execute(initassignmentTable);

    console.log("✅ Initial database tables checked/created successfully.");
  } catch (error) {
    console.error("❌ Error initializing database tables:", error.message);
    process.exit(1);
  }
};

// 3. Auto-execute the initial table setup
await initializaDatabase();
export default pool;
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
