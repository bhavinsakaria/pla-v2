import mysql, { Pool, PoolConnection, RowDataPacket } from "mysql2/promise";
import { connectDB } from "../connectDB";

interface MetadataRow extends RowDataPacket {
    DateTime: string;
  }
export async function LoadDateTimeSql(db_name: string, apiName: string): Promise<string | null> {
  const pool: Pool = await connectDB(db_name);
  const connection: PoolConnection = await pool.getConnection();

  try {
    // Use a parameterized query to prevent SQL injection
    const [rows] = await connection.query<MetadataRow[]>(
      `SELECT DateTime FROM metadata WHERE ApiName = ? LIMIT 1`,
      [apiName]
    );

    return rows.length > 0 ? rows[0].DateTime : null; // Return null instead of throwing error
  } catch (error) {
    console.error("Error fetching DateTime:", error);
    throw error;
  } finally {
    connection.release(); // Always release the connection
  }
}
