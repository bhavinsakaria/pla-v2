import { Connection } from 'mysql2/promise';

export async function od_mod(connection: Connection): Promise<string> {
    try {
        // Disable safe updates
        await connection.execute('SET SQL_SAFE_UPDATES = 0');

        // Update outstanding table
        await connection.execute(
            'UPDATE outstanding SET Days = DATEDIFF(CURDATE(), Date) WHERE Balance > 0'
        );

        // Re-enable safe updates
        await connection.execute('SET SQL_SAFE_UPDATES = 1');

        return 'Outstanding table updated successfully!';
    } catch (error) {
        // Ensure error is a string when returning in TypeScript
        return `Error updating database: ${error instanceof Error ? error.message : error}`;
    }
}
