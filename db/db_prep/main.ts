import mysql, { Pool, PoolConnection } from 'mysql2/promise';
import { od_mod } from './os_tabel.js';
import {connectDB} from "../connectDB";
export async function db_prep(db_name: string): Promise<void> {
    const connection: mysql.Pool = await connectDB(db_name);
    const [od_mod_res] = await Promise.all([
        od_mod(connection),
    ]);

    const result = {
        od_mod: od_mod_res
    };

    console.log(result);
}