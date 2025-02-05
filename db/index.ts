import { LoadDateTimeSql } from "./db_seeder/sql_date";
import { ApiMasterData } from "./db_seeder/mst_api";
import { ApiCroprateData } from "./db_seeder/corp_api";

// Assuming LoadDateTimeSql returns a string representing the DateTime
async function main(): Promise<void> {
    // Assuming dataTime and dataTime_crop are strings or Date objects
    const dataTime: string = await LoadDateTimeSql("crop_data");
    await ApiMasterData("crop_data_dt", dataTime);

    const dataTime_crop: string = await LoadDateTimeSql("corp_data");
    await ApiCroprateData("corp_data_dt", dataTime_crop);

    // Re-run the APIs with the newly fetched DateTimes
    await ApiMasterData("crop_data_dt", dataTime);
    await ApiCroprateData("corp_data_dt", dataTime_crop);

    return;
}

main().catch((error) => {
    console.error("Error occurred during execution:", error);
});
