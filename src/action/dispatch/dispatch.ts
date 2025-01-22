"use server"
import { redirect } from "next/navigation";
import  db  from "@/lib/prisma";

async function DispatchData() {
    try {
        const dispatch = await db.dispatch.findMany();
        return dispatch
    } catch (error) {
       return error 
    }
}

export  {DispatchData};