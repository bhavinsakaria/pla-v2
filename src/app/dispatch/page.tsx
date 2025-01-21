"use client";
import React, { useState, KeyboardEvent, FormEvent } from "react";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  dispatchRegisterSchema,
  dispatchUpdateSchema,
  type DispatchRegister,
  type DispatchUpdate,
} from "@/lib/VaildationSchema";

import { toast } from "react-toastify";
import useSerialPort from "@/lib/serialPort";
import ErrorMessage from "@/components/ErrorMessage";
import DispatchTable from "./_component/DispatchTable";

type CleanInputFn = (input: string) => string;
type GenerateRandomIDFn = (prefix?: string, length?: number) => string;
type GenerateRandomOrderAmtFn = () => number;
type HandleScanFn = (e: KeyboardEvent<HTMLInputElement>) => void;
type HandleResetFn = (e: FormEvent) => void;

const DispatchScreen: React.FC = () => {
  const [isManual, setIsManual] = useState<boolean>(false);
  const [refreshTable, setRefreshTable] = useState<boolean>(false);
  const { connectToSerialPort, serialData, connected } = useSerialPort();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DispatchRegister | DispatchUpdate>({
    resolver: zodResolver(
      isManual ? dispatchUpdateSchema : dispatchRegisterSchema
    ),
  });

  const cleanInput: CleanInputFn = (input) => {
    return input
      .replace(/\[/g, "{") // Replace opening square brackets with curly braces
      .replace(/\]/g, "}") // Replace closing square brackets with curly braces
      .replace(/Shift|ArrowDown/g, "") // Remove unwanted keys
      .replace(/(\s){2,}/g, " ") // Remove extra spaces
      .trim() // Remove leading and trailing spaces
      .toUpperCase(); // Convert to uppercase
  };

  const generateRandomID: GenerateRandomIDFn = (prefix = "CA", length = 6) => {
    const number = Math.floor(Math.random() * Math.pow(10, length));
    return `${prefix}${number.toString().padStart(length, "0")}`;
  };

  const generateRandomOrderAmt: GenerateRandomOrderAmtFn = () => {
    return Math.floor(Math.random() * 10000) + 1;
  };

  const handelScan: HandleScanFn = async (e) => {
    if (e.key === "Enter") {
      const input = e.currentTarget.value;
      const cleanedInput = cleanInput(input);

      if (cleanedInput.includes("{") && cleanedInput.includes("}")) {
        try {
          const parsedData = JSON.parse(cleanedInput);

          if (!parsedData.TN) {
            toast.error("Invalid JSON format");
            e.currentTarget.value = "";
          } else {
            const data: DispatchRegister = {
              challanNo: generateRandomID(),
              challanDate: new Date(),
              partyCode: parsedData.PC?.trim() || null,
              partyName: parsedData.PN?.trim(),
              partyPlace: parsedData.STN?.trim(),
              transportName: parsedData.TN?.trim(),
              orderAmt: generateRandomOrderAmt(),
            };

            e.currentTarget.value = "";
          }
        } catch (error) {
          e.currentTarget.value = "";
          toast.error(`Not a valid JSON format: ${error}`);
        }
      } else {
        e.currentTarget.value = "";
        toast.error("Enter Scan Data");
      }
    }
  };

  const handleReset: HandleResetFn = (e) => {
    e.preventDefault();
    reset();
  };

  return (
    <div>
      <div className="card flex flex-nowrap justify-center mt-2 shadow-md lg:max-w-7xl mx-auto p-5">
        {serialData || "No data received."}
        {!isManual ? (
          <div>
            <input
              type="text"
              placeholder="Please Scan Here"
              onKeyDown={handelScan}
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
          <form>
            <div className=" flex-wrap grid grid-cols-5 lg:max-w-full">
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
                <ErrorMessage>
                  {"challanNo" in errors ? errors?.challanNo?.message : ""}
                </ErrorMessage>
              </label>
              <label className="form-control mr-2 w-full lg:w-2/12">
                <div className="label">
                  <span className="label-text text-lg">Challan Date</span>
                </div>
                <input
                  type="date"
                  {...register("challanDate")}
                  className="input input-primary border-gray-300 hover:border-gray-400"
                />
                <ErrorMessage>{errors.challanDate?.message}</ErrorMessage>
              </label>
              <label className="form-control mr-2 w-full lg:w-3/12">
                <div className="label">
                  <span className="label-text text-lg">Party Name</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter Party Name"
                  {...register("partyName")}
                  className="input input-primary border-gray-300 hover:border-gray-400"
                />
                {"challanNo" in errors ? errors?.partyName?.message : ""}
              </label>
              <label className="form-control mr-2 w-full lg:w-2/12">
                <div className="label">
                  <span className="label-text text-lg">Place</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter Party Place"
                  {...register("partyPlace")}
                  className="input input-primary border-gray-300 hover:border-gray-400"
                />
                <ErrorMessage>{errors.partyPlace?.message}</ErrorMessage>
              </label>
              <label className="form-control w-full lg:w-2/12">
                <div className="label">
                  <span className="label-text text-lg">Order Amount</span>
                </div>
                <input
                  type="number"
                  placeholder="Enter Order Amount"
                  {...register("orderAmt", {
                    setValueAs: (value) => parseFloat(value) || 0,
                  })}
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
                className="btn bg-accent hover:bg-yellow-600 text-black ml-5"
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                className="btn btn-active text-black mx-5"
                onClick={(e) => {
                  e.preventDefault();
                  setIsManual(false);
                }}
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
