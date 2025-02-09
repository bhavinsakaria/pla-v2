import cron from "node-cron";
import { LoadDateTimeSql } from "./db_seeder/sql_date";
import { ApiMasterData } from "./db_seeder/mst_api";
import { ApiCroprateData } from "./db_seeder/corp_api";
import { table_sync } from "./Table_syncs/main";
import { db_prep } from "./db_prep/main";

/**
 * Executes a task function and logs its result or error.
 * @param taskName - The name of the task for logging purposes.
 * @param taskFunction - The async function representing the task.
 */
async function runTask(taskName: string, taskFunction: () => Promise<any>): Promise<void> {
  console.log(`Running ${taskName} at ${new Date().toISOString()}`);
  try {
    const result = await taskFunction();
    console.log(`${taskName} result:`, result);
  } catch (error: unknown) {
    console.error(`Error occurred during ${taskName}:`, error);
  }
}

/**
 * Fetches master data sync.
 * @returns A promise that resolves to the master sync result.
 */
async function syncMaster(): Promise<any> {
  const dataTimeMaster = await LoadDateTimeSql("pla", "master") ?? "";
  return ApiMasterData("pla", dataTimeMaster);
}

/**
 * Fetches corporate data sync.
 * @returns A promise that resolves to the corporate sync result.
 */
async function syncCorp(): Promise<any> {
  const dataTimeCorp = await LoadDateTimeSql("pla", "corp")??"";
  return ApiCroprateData("pla", dataTimeCorp);
}

/**
 * Runs the immediate tasks once when the script starts.
 */
async function runImmediateTasks(): Promise<void> {
  await runTask("Master sync", syncMaster);
  await runTask("Corporate sync", syncCorp);
  await runTask("DB prep", () => db_prep("pla"));
  await runTask("Table sync", () => table_sync("pla"));
}

/**
 * Schedules recurring tasks using cron.
 */
function scheduleTasks(): void {
  // Schedule Master sync every 10 minutes
  cron.schedule("*/15 * * * *", async () => {
    await runTask("Master sync", syncMaster);
  });

  // Schedule Corporate sync, DB prep, and Table sync every 30 minutes
  cron.schedule("*/30 * * * *", async () => {
    await runTask("Corporate sync", syncCorp);
    await runTask("DB prep", () => db_prep("pla"));
    await runTask("Table sync", () => table_sync("pla"));
  });
}

/**
 * Main function to run immediate tasks and set up cron scheduling.
 */
async function main(): Promise<void> {
  // Execute tasks immediately on startup
  await runImmediateTasks();

  // Set up scheduled tasks
  scheduleTasks();

  console.log("Syncing DB. Press Ctrl+C to stop.");
}

// Start the process and catch any fatal errors
main().catch((error: unknown) => console.error("Fatal error in main:", error));
