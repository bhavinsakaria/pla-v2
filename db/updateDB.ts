import { LoadDateTimeSql } from "./db_seeder/sql_date";
import { ApiMasterData } from "./db_seeder/mst_api";
import { ApiCroprateData } from "./db_seeder/corp_api";
import { db_prep } from "./db_prep/main";
import { table_sync } from "./Table_syncs/main";

// Define the types for the results of the API calls
type ApiResult = string; // Assuming the API results are strings, modify based on actual return type

async function main(): Promise<void> {
    try {
        // Fetch the datetime values first
        const dataTime_mst = await LoadDateTimeSql("pla", "master") ?? "";
        const dataTime_crop = await LoadDateTimeSql("pla", "corp") ?? "";

        // Run both APIs concurrently using Promise.all
        const [master, crop]: [ApiResult, ApiResult] = await Promise.all([
            ApiMasterData("pla", dataTime_mst),
            ApiCroprateData("pla", dataTime_crop)
        ]);

        // Log results when both operations are done
        
        console.log(master, crop);
        await db_prep("pla");
        await table_sync("pla");
    } catch (error) {
        console.error("Error occurred:", error);
    }
}

main().then(() => process.exit(0));
