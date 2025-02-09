
import { syncDispatch } from "./dispatchTableSync";
export async function table_sync(db_name: string): Promise<any> {
        const [sync_dispatch_res] = await Promise.all([
            syncDispatch(),
        ]);

        const result = {
            sync_dispatch: sync_dispatch_res
        };
        return result
}
