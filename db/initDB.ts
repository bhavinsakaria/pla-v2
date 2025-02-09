import { ApiMasterData } from "./db_seeder/mst_api";
import { ApiCroprateData } from "./db_seeder/corp_api";
import { db_prep } from "./db_prep/main";
import { table_sync } from "./Table_syncs/main";
// Assuming ApiMasterData and ApiCroprateData return a string or some object.
async function main(): Promise<void> {
    try {
        const [result1, result2] = await Promise.all([
            ApiMasterData("pla"),
            ApiCroprateData("pla")
        ]);

       

        console.log(result1, result2);
        await db_prep("pla");
        await table_sync("pla")

    } catch (error) {
        console.error("An error occurred:", error);
    }
}

main().then(() => {
    process.exit(0);
});
