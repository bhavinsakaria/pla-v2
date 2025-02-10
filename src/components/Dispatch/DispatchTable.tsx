"use client";

import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { useQuery } from "@tanstack/react-query";
import { getDispatchRecord } from "@/action/dispatchReg/dispatch";
import axios from "axios";
import Link from "next/link";

interface DispatchData {
  id?: number;
  challanNo?: string;
  challanDate?: string;
  partyName?: string;
  partyPlace?: string;
  orderAmt?: number;
  invoiceNo?: string;
  tags?: string;
  orderStatus?: string;
}

interface DispatchTableProps {
  refreshTrigger: boolean;
}

const DispatchTable: React.FC<DispatchTableProps> = ({ refreshTrigger }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const pageSize: number = 25; // Records per page

  // Fetch dispatch data using React Query
  const {
    data: dispatchData = [],
    error,
    isLoading,
    refetch,
  } = useQuery<DispatchData[]>({
    queryKey: ["dispatch"],
    queryFn: () => getDispatchRecord(),
  });

  useEffect(() => {
    // Fetch data initially and whenever refreshTrigger changes
    refetch();
  }, [refreshTrigger, refetch]);

  // Filter and paginate data
  const filteredData = (dispatchData || []).filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      !term ||
      item.partyName?.toLowerCase().includes(term) ||
      item.challanNo?.toLowerCase().includes(term) ||
      item.orderStatus?.toLowerCase().includes(term)
    );
  });

  const totalRecords = filteredData.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const firstRecordIndex = (currentPage - 1) * pageSize;
  const currentData = filteredData.slice(
    firstRecordIndex,
    firstRecordIndex + pageSize
  );

  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPage = (page: number) => setCurrentPage(page);

  const getVisiblePages = (): number[] => {
    const pages: number[] = [];
    const sideButtons = 2; // Number of buttons on either side
    const start = Math.max(1, currentPage - sideButtons);
    const end = Math.min(totalPages, currentPage + sideButtons);

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div>
      {isLoading ? (
        <div className="skeleton h-80 max-w-6xl mx-auto mt-4 xl:max-w-7xl"></div>
      ) : error ? (
        <div role="alert" className="alert alert-error">
          <span>Error! {(error as Error).message}</span>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-1 mt-4 px-2 xl:max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold">Dispatch Registry</h1>
            <div className="relative w-2/5">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-primary input-md border-gray-300 w-full hover:border-gray-400 pr-10"
              />
              {searchTerm && (
                <ImCross
                  size={15}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                  onClick={() => setSearchTerm("")}
                />
              )}
            </div>
          </div>

          <table className="table max-w-6xl mx-auto border mt-4 xl:max-w-7xl">
            <thead className="bg-gray-200 text-black border-solid text-base border-gray-300 xl:text-xl">
              <tr>
                <th className="border p-1 text-center border-gray-300">
                  Challan No
                </th>
                <th className="border p-1 text-center border-gray-300">
                  Challan Date
                </th>
                <th className="border p-1 text-center border-gray-300">
                  Invoice No
                </th>
                <th className="border p-1 text-center border-gray-300">
                  Party Name
                </th>

                <th className="border p-1 text-center border-gray-300">
                  Order Amount
                </th>
                <th className="border p-1 text-center border-gray-300">Tags</th>
                <th className="border p-1 text-center border-gray-300">
                  Order Status
                </th>
                <th className="border p-1 text-center border-gray-300">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-100 border border-gray-300 text-sm xl:text-lg"
                  >
                    <td className="border p-0 text-center border-gray-300">
                      {item.challanNo}
                    </td>
                    <td className="border p-0 text-center border-gray-300">
                    {item.challanDate ? new Date(item.challanDate).toLocaleDateString() : ''}
                    </td>
                    <td className="border p-0 text-center border-gray-300">
                      {item.invoiceNo}
                    </td>
                    <td className="border p-0 text-center border-gray-300">
                      {item.partyName}
                    </td>

                    <td className="border p-0 text-center border-gray-300">
                    {new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(item.orderAmt ?? 0)}
                    </td>
                    <td className="border p-0 text-center border-gray-300">
                      {item.tags}
                    </td>
                    <td className="border p-0 text-center border-gray-300">
                      {item.orderStatus}
                    </td>
                    <td className="border p-0 text-center border-gray-300">
                      <Link href={`/dispatch/${item.id}`}>
                        <button className="btn btn-ghost mx-auto">
                          <FaEdit />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-center items-center mt-6">
            <button
              className="btn bg-gray-200 hover:bg-gray-300 px-3 mx-2"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {getVisiblePages().map((page, index) => (
              <button
                key={index}
                className={`btn px-3 mx-1 ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="btn bg-gray-200 hover:bg-gray-300 px-3 mx-2"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DispatchTable;
