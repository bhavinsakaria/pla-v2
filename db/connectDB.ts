import dotenv from "dotenv";
import mysql, { Pool } from "mysql2/promise";

dotenv.config();

export async function connectDB(db_name: string): Promise<Pool> {
  const pool: Pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: db_name,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool; // Return the pool instead of a single connection
}
