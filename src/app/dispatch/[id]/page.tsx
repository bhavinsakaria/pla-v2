import db from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function DispatchRecord({
  params,
}: {
  params: { id: string };
}) {
  
  const { id } = params; // Extract 'id' after 'params' is resolved
  const dispatchRec = await db.dispatch.findUnique({
    where: { id },
  });

  if (!dispatchRec) {
    return notFound();
  }

  return (
    <>
      <div className="container mx-auto  pd-2">
        <Link href="/dispatch">
          <button className="btn btn-base "> Back </button>
        </Link>
      </div>

      <div className="container mx-auto border pd-2 mt-2">
        <OrderSteps status={dispatchRec.orderStatus ?? ""} />
        <div className="divider "></div>
        <div className="pl-4">
          <h1 className="text-xl font-bold">{dispatchRec?.partyName}</h1>
          <p>Challan No: {dispatchRec?.challanNo}</p>
          <p>
            Challan Date:{" "}
            {dispatchRec?.challanDate
              ? new Date(dispatchRec.challanDate).toLocaleDateString()
              : ""}
          </p>
          <div className="divider"></div>
          <h1 className="text-xl font-bold">Transport Details</h1>
          <p>Transport Name: {dispatchRec?.transportName}</p>
          <p>LR No: {dispatchRec?.lrNo}</p>
          <p>
            LR Date:{" "}
            {dispatchRec?.lrDate
              ? new Date(dispatchRec.lrDate).toLocaleDateString()
              : ""}
          </p>
          <p>Number of Cases: {dispatchRec?.numberofCases}</p>
        </div>
      </div>
    </>
  );
}



interface OrderStepsProps {
  status: string;
}



const OrderSteps: React.FC<OrderStepsProps> = ({ status }) => {
  const steps = ["Printed", "Packed", "Dispatched", "Delivered"];
  const statusIndex = steps.indexOf(status);

  return (
    <>
    <div className="flex justify-center mt-2">
    <p className="text-black font-bold ">Order Status : {status}</p> 
    </div>
    <div className="flex justify-center mt-3">
      <ul className="steps gap-4">
        {steps.map((step, index) => (
          <li
            key={step}
            className={`step ${index <= statusIndex ? "step-success" : ""}`}
            data-content={index <= statusIndex ? "✓" : ""}
          >
            {step}
          </li>
        ))}
      </ul>
    </div>
    </>
  );
};