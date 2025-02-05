"use client";
import React, { useState, KeyboardEvent, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  dispatchRegisterSchema,
  type DispatchRegister,
} from "@/lib/VaildationSchema";
import { toast } from "react-toastify";
import useSerialPort from "@/lib/serialPort";
import {saveDispatchRecord} from "@/action/dispatchReg/dispatch";
import ErrorMessage from "@/components/ErrorMessage";
import DispatchTable from "@/components/Dispatch/DispatchTable";

type CleanInputFn = (input: string) => string;

const DispatchScreen: React.FC = () => {
  const [isManual, setIsManual] = useState<boolean>(false);
  const [refreshTable, setRefreshTable] = useState<boolean>(false);
  const [prevData, setPrevData] = useState<string>("");

  const { connectToSerialPort, connectionStatus, serialData, connected } =
    useSerialPort();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DispatchRegister>({
    resolver: zodResolver(dispatchRegisterSchema),
  });

  const onSubmit: SubmitHandler<DispatchRegister> = async (data) => {
    try {
      await saveDispatchRecord(data);
      toast.success("Record added successfully");
      reset();
    } catch (error:unknown) {
      toast.error((error as Error).message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (serialData && serialData !== prevData) {
      try {
        const parsedData = processData(serialData);
        console.log(parsedData)
        saveDispatchRecord(parsedData).then(() => {
          toast.success("Record added successfully");
          setRefreshTable((prev) => !prev);
        });
      } catch (error: any) {
        toast.error(error.message || "Invalid input");
      }
      setPrevData(serialData);
    }
  }, [serialData, connected]);

  const handleScan = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const input = e.currentTarget.value.trim();
      e.currentTarget.value = "";
      try {
        const parsedData = processData(input);
        saveDispatchRecord(parsedData).then(() => {
          toast.success("Record added successfully");
          setRefreshTable((prev) => !prev);
        });
      } catch (error: any) {
        toast.error(error.message || "Invalid input");
      }
    }
  };

  return (
    <div>
     
        <div>{connectionStatus || ""}</div>

        {!isManual ? (
          
          <div>
                  <button
              className={`btn ${
                connected
                  ? "bg-green-600 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-500"
              } text-white m-2`}
              disabled={connected}
              onClick={connectToSerialPort}
            >
              {connected ? "Connected" : "Connect"}
            </button>
            <button
              className="btn btn-active text-black m-2"
              onClick={() => setIsManual(true)}
            >
              Manual
            </button>
            {!connected ? (
                          <input
                          type="text"
                          placeholder="Please Scan Here"
                          onKeyDown={handleScan}
                          className="input input-primary border-gray-300 w-full lg:w-3/4 hover:border-gray-400"
                        />
            ):null}
          </div>
        ) : (
          <div className="card flex flex-nowrap justify-center mt-2 shadow-md lg:max-w-7xl mx-auto p-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-wrap grid-cols-5 lg:max-w-full">
              {/* Fields */}
              <label className="form-control mr-2 w-full lg:w-2/12">
                <div className="label">
                  <span className="label-text text-lg">Challan No.</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter Challan No."
                  {...register("challanNo")}
                  className="input input-primary border-gray-300 hover:border-gray-400"
                />
                <ErrorMessage>{errors.challanNo?.message}</ErrorMessage>
              </label>
              {/* Other Fields */}
              <label className="form-control mr-2 w-full lg:w-2/12">
                <div className="label">
                  <span className="label-text text-lg">Challan Date</span>
                </div>
                <input
                  type="date"
                  placeholder="Enter Challan Date"
                  {...register("challanDate")}
                  className="input input-primary border-gray-300 hover:border-gray-400"
                />
                <ErrorMessage>{errors.challanDate?.message}</ErrorMessage>
              </label>
              <label className="form-control mr-2  w-full lg:w-3/12">
                <div className="label">
                  <span className="label-text text-lg">Party Name</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter Party Name"
                  {...register("partyName")}
                  className="input input-primary border-gray-300 hover:border-gray-400"
                />
                <ErrorMessage>{errors.partyName?.message}</ErrorMessage>
              </label>
              <label className="form-control mr-2 w-full lg:w-2/12">
                <div className="label">
                  <span className="label-text text-lg">Station</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter Party Place"
                  {...register("partyPlace")}
                  className="input input-primary border-gray-300 hover:border-gray-400"
                />
                <ErrorMessage>{errors.partyPlace?.message}</ErrorMessage>
              </label>
              <label className="form-control mr-2 w-full lg:w-2/12">
                <div className="label">
                  <span className="label-text text-lg">Order Amount</span>
                </div>
                <input
                  type="number"
                  placeholder="Enter Party Place"
                  {...register("orderAmt", { valueAsNumber: true })}
                  className="input input-primary border-gray-300 hover:border-gray-400"
                />
                <ErrorMessage>{errors.orderAmt?.message}</ErrorMessage>
              </label>
              
            </div>
            <div className="flex mt-3">
              <button
                type="submit"
                className="btn bg-primary hover:bg-blue-950 text-white"
              >
                Submit
              </button>
              <button
                type="button"
                className="btn bg-yellow-500 hover:bg-yellow-600 text-white ml-5"
                onClick={() => reset()}
              >
                Reset
              </button>
              <button
                className="btn btn-accent text-white mx-5"
                onClick={() => setIsManual(false)}
              >
                Scan
              </button>
            </div>
          </form>
          </div>
        )}
      
      <DispatchTable refreshTrigger={refreshTable} />
    </div>
  );
};

export default DispatchScreen;


const cleanInput: CleanInputFn = (input) =>
  input
    .replace(/\[/g, "{")
    .replace(/\]/g, "}")
    .replace(/Shift|ArrowDown/g, "")
    .replace(/(\s){2,}/g, " ")
    .trim()
    .toUpperCase();

function processData(input: string): DispatchRegister {
  const cleanedInput = cleanInput(input);

  if (cleanedInput.includes("{") && cleanedInput.includes("}")) {
    try {
      const parsedData = JSON.parse(cleanedInput);
      if (!parsedData.TN) {
        throw new Error("Invalid JSON format. Missing TN field.");
      }
      return {
        challanNo: parsedData.DN.trim(),
        challanDate: new Date(),
        partyCode: parsedData.PC?.trim() || null,
        partyName: parsedData.PN?.trim(),
        partyPlace: parsedData.STN?.trim(),
        transportName: parsedData.TN?.trim(),
        orderStatus: "Printed",
      };
    } catch (error: any) {
      throw new Error(`Failed to parse JSON: ${error.message}`);
    }
  } else {
    throw new Error("Input is not in JSON format.");
  }
}
