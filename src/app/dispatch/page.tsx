"use client";
import React, { useState, KeyboardEvent, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  dispatchRegisterSchema,
  type DispatchRegister,
} from "@/lib/VaildationSchema";
import axios from "axios";
import { toast } from "react-toastify";
import useSerialPort from "@/lib/serialPort";
import ErrorMessage from "@/components/ErrorMessage";
import DispatchTable from "./_component/DispatchTable";

type CleanInputFn = (input: string) => string;
type GenerateRandomIDFn = (prefix?: string, length?: number) => string;
type GenerateRandomOrderAmtFn = () => number;

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

  const mutation = useMutation({
    mutationFn: (data: DispatchRegister) => axios.post("/api/dispatch/", data),
    onSuccess: () => {
      toast.success("Record added successfully");
      reset();
      setRefreshTable((prev) => !prev);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  const onSubmit: SubmitHandler<DispatchRegister> = (data) => {
    mutation.mutate(data);
  };

  useEffect(() => {
    if (serialData && serialData !== prevData) {
      try {
        const parsedData = processData(serialData);
        mutation.mutate(parsedData);
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
        mutation.mutate(parsedData);
      } catch (error: any) {
        toast.error(error.message || "Invalid input");
      }
    }
  };

  return (
    <div>
      <div className="card flex flex-nowrap justify-center mt-2 shadow-md lg:max-w-7xl mx-auto p-5">
        <div>{connectionStatus || ""}</div>

        {!isManual ? (
          <div>
            <input
              type="text"
              placeholder="Please Scan Here"
              onKeyDown={handleScan}
              className="input input-primary border-gray-300 w-full lg:w-3/4 hover:border-gray-400"
            />
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
          </div>
        ) : (
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
        )}
      </div>
      <DispatchTable refreshTrigger={refreshTable} />
    </div>
  );
};

export default DispatchScreen;

// Helper functions
const generateRandomID: GenerateRandomIDFn = (prefix = "CA", length = 6) => {
  const number = Math.floor(Math.random() * Math.pow(10, length));
  return `${prefix}${number.toString().padStart(length, "0")}`;
};

const generateRandomOrderAmt: GenerateRandomOrderAmtFn = () =>
  Math.floor(Math.random() * 10000) + 1;

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
        orderAmt: generateRandomOrderAmt(),
      };
    } catch (error: any) {
      throw new Error(`Failed to parse JSON: ${error.message}`);
    }
  } else {
    throw new Error("Input is not in JSON format.");
  }
}
