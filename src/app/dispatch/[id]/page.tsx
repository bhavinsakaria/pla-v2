import db from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function DispatchRecord({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const dispatchRec = await db.dispatch.findUnique({
    where: { id },
  });

  if (!dispatchRec) {
    return notFound();
  }

  return (
    <>
      <div className="mb-6">
        <Link href="/dispatch">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            &larr; Back
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-12 gap-4">
        {/* Main Content */}
        <div className="col-span-8">
          <div className="bg-white rounded shadow p-6 mt-2">
            <OrderSteps status={dispatchRec.orderStatus ?? ""} />
            <div className="divider my-4"></div>
            <div>
              <h1 className="text-xl font-bold mb-4">
                {dispatchRec.partyName}
              </h1>
              {/* Two-column grid for Challan and Invoice details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    Challan Details
                  </h2>
                  <p>Challan No: {dispatchRec.challanNo}</p>
                  <p>
                    Challan Date:{" "}
                    {dispatchRec.challanDate
                      ? new Date(dispatchRec.challanDate).toLocaleDateString()
                      : ""}
                  </p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    Invoice Details
                  </h2>
                  <p className="text-gray-700">
                    <span className="font-semibold">Invoice No:</span>{" "}
                    {dispatchRec.invoiceNo}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Invoice Date:</span>{" "}
                    {dispatchRec.invoiceDate
                      ? new Date(dispatchRec.invoiceDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="divider my-4"></div>
              <h1 className="text-xl font-bold mb-4">Transport Details</h1>
              <div>
                <p>Transport Name: {dispatchRec.transportName}</p>
                <p>LR No: {dispatchRec.lrNo}</p>
                <p>
                  LR Date:{" "}
                  {dispatchRec.lrDate
                    ? new Date(dispatchRec.lrDate).toLocaleDateString()
                    : ""}
                </p>
                <p>Number of Cases: {dispatchRec.numberofCases}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Side Content */}
        <div className="col-span-4">
          <div className="bg-white rounded shadow p-6 mt-2">
            <h1 className="text-2xl font-bold mb-4">Order Details</h1>
            <p className=" text-xl font-bold">
              <span className="font-semibold">Order Amount:</span>{" "}
              {new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(dispatchRec.orderAmt ?? 0)}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Sales Rep:</span>{" "}
              {dispatchRec.salesRep}
            </p>
          <div className="divider my-4"></div>
          <div>
          <p className="text-gray-700 mb-3">
              <span className="font-semibold">Order Status:</span>{" "}
              {dispatchRec.orderStatus}
            </p>
          
            <div className="mb-3">
            <p className="text-gray-700 font-semibold mb-2">Tag:</p>
            <div className="bg-gray-100 p-2 rounded max-h-40 overflow-y-auto">
              {dispatchRec.tags && dispatchRec.tags.length > 0 ? (
              dispatchRec.tags.map((log, index) => (
              <p key={index} className="text-gray-600">
              {log}
              </p>
              ))
              ) : (
              <p className="text-gray-500">Not available.</p>
              )}
            </div>
          </div>

          <div className="mb-3">
            <p className="text-gray-700 font-semibold mb-2">Remarks:</p>
            <div className="bg-gray-100 p-2 rounded max-h-40 overflow-y-auto">
              {dispatchRec.remarks && dispatchRec.remarks.length > 0 ? (
              dispatchRec.remarks?.map((log, index) => (
              <p key={index} className="text-gray-600">
              {log}
              </p>
              ))
              ) : (
              <p className="text-gray-500">No Remarks available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
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
        <p className="text-black font-bold">Order Status: {status}</p>
      </div>
      <div className="flex justify-center mt-3">
        <ul className="steps gap-4">
          {steps.map((step, index) => (
            <li
              key={step}
              className={`step ${
                index <= statusIndex ? "step-success" : ""
              }`}
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
