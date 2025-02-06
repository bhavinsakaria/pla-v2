
import { syncDispatch } from "./Table_syncs/dispatchTableSync";
 async function sync_task() {
    try {
        await syncDispatch();
    } catch (error) {
        throw new Error("Error in sync task: " + error);
    }
}


sync_task().then(() => {
    console.log("Sync task completed successfully.");
}).catch((error) => {
    console.error("Error in sync task:", error);
});