"use server";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import db from "@/lib/prisma";
import {
  DispatchRegister,
  dispatchRegisterSchema,
} from "@/lib/VaildationSchema";

async function saveDispatchRecord(data: DispatchRegister): Promise<any> {
  const validateData = dispatchRegisterSchema.safeParse(data);
  try {
    if (!validateData.success) {
      throw new Error(validateData.error.message);
    }
    return await db.dispatch.create({
      data,
    });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error(
          "Duplicate Challan Number: This challan number already exists."
        );
      }
    }
    throw new Error("Database error: " + (error as Error).message);
  }
}

async function getDispatchRecord(): Promise<any> {
  return await db.dispatch.findMany();
}

export { saveDispatchRecord, getDispatchRecord };
