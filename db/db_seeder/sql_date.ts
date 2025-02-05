import mysql from 'mysql2/promise';
import {connectDB} from "../connectDB";
interface MetadataRow {
  DateTime: string;
}

export async function LoadDateTimeSql(db_name: string, apiName: string): Promise<string> {

    const connection : mysql.Pool = await connectDB(db_name);

    try {
        // Get a connection from the pool
        

        // Use a parameterized query to prevent SQL injection
        const [rows] = await connection.query<MetadataRow[]>(
            `SELECT DateTime FROM metadata WHERE ApiName = ?`, 
            [apiName]
        );

        if (rows.length > 0) {
            return rows[0].DateTime;
        } else {
            throw new Error('DateTime not found in metadata table');
        }
    } catch (error) {
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
