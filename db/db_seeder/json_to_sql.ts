import mysql, { Connection} from 'mysql2/promise';
import {connectDB} from "../connectDB";
import fs from 'fs/promises';

interface Metadata {
  ID: number;
  Index: number;
  ApiName: string;
  Datastatus: string;
  Status: string;
  DateTime: string;
}

interface JsonData {
  Details: {
    [key: string]: any[];
  };
}

async function createTableIfNotExists(connection: Connection, tableName: string, columns: string[]): Promise<void> {
    const columnDefinitions = columns.map(col => `\`${col}\` VARCHAR(255)`).join(', ');
    const createTableQuery = `CREATE TABLE IF NOT EXISTS \`${tableName}\` (${columnDefinitions})`;

    try {
        await connection.execute(createTableQuery);
        await setPrimaryKey(connection, tableName);
    } catch (error) {
        console.error(`Error creating table \`${tableName}\`:`, error);
        throw error;
    }
}

async function setPrimaryKey(connection: Connection, tableName: string): Promise<void> {
    try {
        const [existingPrimaryKey] = await connection.execute(
            `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
             WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_KEY = 'PRI'`,
            [tableName]
        );

        if (existingPrimaryKey.length > 0) {
            return;
        }

        const priorityColumns = ['ID', 'rid', 'code', 'RowID'];

        for (const column of priorityColumns) {
            const [columnExists] = await connection.execute(
                `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
                 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
                [tableName, column]
            );

            if (columnExists.length > 0) {
                await connection.execute(`ALTER TABLE \`${tableName}\` ADD PRIMARY KEY (\`${column}\`)`);
                return;
            }
        }

        console.warn(`No primary key found or added for table \`${tableName}\`. Consider adding one.`);
    } catch (error) {
        console.error(`Error setting primary key for table \`${tableName}\`:`, error);
        throw error;
    }
}

async function insertOrUpdateDataIntoTable(connection: Connection, tableName: string, data: any[]): Promise<void> {
    if (data.length === 0) return;

    const columns = Object.keys(data[0]);
    const placeholders = columns.map(() => '?').join(', ');
    const updateColumns = columns.map(col => `\`${col}\` = VALUES(\`${col}\`)`).join(', ');

    const insertQuery = `INSERT INTO \`${tableName}\` (${columns.map(col => `\`${col}\``).join(', ')}) VALUES `;

    const batchSize = 500; // Chunk size to handle large datasets
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        const values = batch.map(row => columns.map(col => row[col] !== undefined ? row[col] : null)); // Correct mapping

        const rowPlaceholders = batch.map(() => `(${placeholders})`).join(', ');

        const finalQuery = insertQuery + rowPlaceholders + ` ON DUPLICATE KEY UPDATE ${updateColumns}`;

        try {
            await connection.execute(finalQuery, values.flat());
        } catch (error) {
            console.error(`Error inserting data into table \`${tableName}\`:`, error);
            throw error;
        }
    }
}

async function createMetaTableIfNotExists(connection: Connection): Promise<void> {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS metadata (
            id INT AUTO_INCREMENT PRIMARY KEY,
            \`Index\` INT,
            ApiName VARCHAR(255),
            Datastatus VARCHAR(255),
            Status VARCHAR(255),
            DateTime DATETIME
        );
    `;

    try {
        await connection.execute(createTableQuery);
    } catch (error) {
        console.error('Error creating metadata table:', error);
        throw error;
    }
}

async function insertMetaDataTable(metadata: Metadata, connection: Connection): Promise<void> {
    const query = `
        INSERT INTO metadata (\`id\`, \`Index\`, \`ApiName\`, \`Datastatus\`, \`Status\`, \`DateTime\`)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            \`Datastatus\` = VALUES(\`Datastatus\`),
            \`Status\` = VALUES(\`Status\`),
            \`DateTime\` = VALUES(\`DateTime\`);
    `;

    const { ID, Index, ApiName, Datastatus, Status, DateTime } = metadata;

    try {
        await connection.execute(query, [ID, Index, ApiName, Datastatus, Status, DateTime]);
    } catch (error) {
        console.error('Error inserting metadata:', error);
        throw error;
    }
}

async function insertMetaData(metadata: Metadata, connection: Connection): Promise<void> {
    await createMetaTableIfNotExists(connection);
    await insertMetaDataTable(metadata, connection);
}

export async function loadJsonToMySQL(args: string, db_name: string, apiName: string, drop: boolean): Promise<void> {

    const connection: mysql.Pool =  await connectDB(db_name)

    try {
        await connection.query("SET foreign_key_checks = 0");

        const jsonData: JsonData = JSON.parse(args);

        // Validate JSON structure
        if (!jsonData || !jsonData.Details || typeof jsonData.Details !== 'object') {
            throw new Error('Invalid JSON structure: Missing "Details" property');
        }

        const { Index, Datastatus, Status, DateTime } = jsonData.Details;

        const metadata: Metadata = {
            Index,
            Datastatus,
            Status,
            DateTime,
            ID: apiName === "corp" ? 1 : 2,
            ApiName: apiName,
        };

        await insertMetaData(metadata, connection);

        const tableRenameMap: { [key: string]: { [key: string]: string } } = {
            Party: { corp: 'PartyC', master: 'PartyM' },
        };

        for (const tableName in jsonData.Details) {
            const tableData = jsonData.Details[tableName];
            const newTableName = tableRenameMap[tableName]?.[apiName] || tableName;

            if (Array.isArray(tableData) && tableData.length > 0) {
                if (drop) await truncateAllTables(connection, newTableName);
                const columns = Object.keys(tableData[0]);
                await createTableIfNotExists(connection, newTableName, columns);
                await insertOrUpdateDataIntoTable(connection, newTableName, tableData);
            }
        }

    } catch (error) {
        console.error('Error:', error);
        throw error;
    } finally {
        await connection.query("SET foreign_key_checks = 1");
    }

    await connection.release();
}

async function truncateAllTables(connection: Connection, tableName: string): Promise<void> {
    try {
        const [rows] = await connection.query(`SHOW TABLES LIKE ?`, [tableName]);

        if (rows.length === 0) {
            console.warn(`Table \`${tableName}\` does not exist.`);
            return;
        }

        await connection.query(`TRUNCATE TABLE \`${tableName}\``);
        console.log(`${tableName} emptied successfully!`);
    } catch (error) {
        console.error('Error truncating table:', error);
        throw error;
    }
}
