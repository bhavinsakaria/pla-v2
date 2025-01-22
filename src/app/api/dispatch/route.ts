import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/prisma";
import {
  dispatchRegisterSchema,
  dispatchUpdateSchema,
  type DispatchRegister,
  type DispatchUpdate,
} from "@/lib/VaildationSchema";

// Type definition for POST and GET handlers
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const valid = dispatchRegisterSchema.safeParse(body);
    

    if (!valid.success) {
      return NextResponse.json({ errors: valid.error.errors }, { status: 400 });
    }
    
    const { challanNo } = valid.data;
    
    const existingDispatch = await db.dispatch.findFirst({
      where: { challanNo },
    });

    if (existingDispatch) {
      return NextResponse.json(
        { message: "Challan No already exists" },
        { status: 400 }
      );
    }

   
    console.log(valid.data)
    const dispatch = await db.dispatch.create({
      data: valid.data,
    });
    console.log("Prisma user creation success:", dispatch);
    return NextResponse.json(dispatch);
  } catch (error: any) {
    
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const dispatchList = await db.dispatch.findMany();
    return NextResponse.json(dispatchList);
  } catch (error: any) {
    console.error("Error fetching dispatch records:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
