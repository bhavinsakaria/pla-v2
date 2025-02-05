"use server"
import { redirect } from "next/navigation";
import  db  from "@/lib/prisma";
import { DispatchRegister } from "@/lib/VaildationSchema";

 async function saveDispatchRecord(data: DispatchRegister) {
    return await db.dispatch.create({
        data,
    });
}

async function getDispatchRecord() {
    return await db.dispatch.findMany();
}

export {saveDispatchRecord, getDispatchRecord}