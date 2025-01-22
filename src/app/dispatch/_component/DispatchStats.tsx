import React from "react";

const DispatchStats = () => {
  return (
    <div className=" stats bg-white rounded-badge items-center p-0 gap-1 grid grid-cols-4 overflow-hidden">
      <div className="stat p-0 place-items-center">
        <div className="stat-title text-sm">Non Printed</div>
        <div className="stat-value text-2xl text-red-500">15</div>
        <div className="stat-desc">Challan</div>
      </div>
      <div className="stat p-0 place-items-center ">
        <div className="stat-title text-sm">Printed</div>
        <div className="stat-value  text-2xl text-yellow-500">17</div>
        <div className="stat-desc">Challan</div>
      </div>
      <div className="stat p-0 place-items-center mx-1">
        <div className="stat-title text-sm">Packed</div>
        <div className="flex justify-center gap-6">
          <div className="stat-value  text-2xl text-blue-500">17</div>
          <div className="stat-value  text-2xl text-blue-500">9</div>
        </div>
        <div className="flex text-center ml-3  gap-2">
          <div className="stat-desc">Local</div>
          <div className="stat-desc">Outstation</div>
        </div>
      </div>

      <div className="stat p-0 place-items-center ">
        <div className="stat-title text-sm">Delivered</div>
        <div className="stat-value  text-2xl text-green-500">10</div>
        <div className="stat-desc">Orders</div>
      </div>
    </div>
  );
};

export default DispatchStats;
