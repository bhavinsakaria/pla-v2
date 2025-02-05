import cron from "node-cron";
import { LoadDateTimeSql } from "./db_seeder/sql_date";
import { ApiMasterData } from "./db_seeder/mst_api";
import { ApiCroprateData } from "./db_seeder/corp_api";

// Common wrapper to handle errors and log them
async function runTask(taskName: string, taskFunction: () => Promise<any>): Promise<void> {
    console.log(`Running ${taskName} at`, new Date().toISOString());
    try {
        const result = await taskFunction();
        console.log(`${taskName} result:`, result);
    } catch (error) {
        console.error(`Error occurred during ${taskName}:`, error);
    }
}

// Master sync function
async function syncMaster(): Promise<any> {
    const dataTime_mst = await LoadDateTimeSql("pla", "master");
    return ApiMasterData("pla", dataTime_mst);
}

// Corporate sync function
async function syncCorp(): Promise<any> {
    const dataTime_crop = await LoadDateTimeSql("pla", "corp");
    return ApiCroprateData("pla", dataTime_crop);
}

// Schedule the tasks
cron.schedule("*/10 * * * *", () => {
    runTask("Master sync", syncMaster);
});

cron.schedule("*/30 * * * *", () => {
    runTask("Corporate sync", syncCorp);
});

console.log("Syncing DB. Press Ctrl+C to stop.");
