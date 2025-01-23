import db from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";


export default async function DispatchRecord({ params }: { params: { id: string } }) {       
  const { id } = params; // Extract 'id' after 'params' is resolved
  const dispatchRec = await db.dispatch.findUnique({
    where: { id },
  });

  if (!dispatchRec) {
    return notFound();
  }

  return (
    <div>
      
      <div>
      <Link href="/dispatch"><button className="btn btn-base "> Back </button></Link>
      </div>
      
      <div className="card w-full shadow-xl mt-2">
        <div className="card-body">
          <h2 className="card-title">Dispatch Record</h2>
          <p>
            <span className="font-bold text-xl">Challan No:</span> <span className="text-xl">{dispatchRec.challanNo}</span>
          </p>
          <p>
            <span className="font-bold">Party Name:</span> {dispatchRec.partyName}{dispatchRec.partyPlace}
          </p>

        </div>
      </div>  
    </div>
  );
}
