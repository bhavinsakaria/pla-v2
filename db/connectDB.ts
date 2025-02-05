import dotenv from 'dotenv';
import mysql, { Pool } from 'mysql2/promise';

// Properly typing the function with Pool return type
export async function connectDB(db_name: string): Promise<mysql.Pool> {
    dotenv.config();


    const pool: Pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: db_name,
        password:process.env.DB_PASSWORD,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });

    const connection: mysql.Pool = await pool.getConnection();
    return connection;
}
