import { PrismaClient } from "@prisma/client";

// Define a function to truncate all tables
async function truncateAllTables(): Promise<void> {
  const prisma = new PrismaClient(); // Correctly instantiate PrismaClient
  try {
    // Get all table names
    const tables = await prisma.$queryRawUnsafe<{ table_name: string }[]>(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`
    );

    // Truncate each table
    // Truncate each table without disabling constraints
    for (const { table_name } of tables) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table_name}" CASCADE;`);
    }

    // Re-enable constraints

    console.log("All tables truncated successfully!");
  } catch (error) {
    console.error("Error truncating tables:", error);
  } finally {
    await prisma.$disconnect(); // Ensure the client disconnects
  }
}

// Invoke the truncateAllTables function
truncateAllTables();
