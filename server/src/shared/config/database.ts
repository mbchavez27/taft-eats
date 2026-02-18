import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const checkDatabaseConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Database connected successfully...");
    connection.release();
  } catch (error) {
    console.error("Database connection failed: ", error);
    process.exit(1);
  }
};
