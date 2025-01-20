import React from "react";
import { FaHome } from "react-icons/fa";
import Link from "next/link";
import { TbTruckDelivery } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";

const NavBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-blue-50 text-black duration-300 flex flex-col max-w-sm h-full border-r hover:border-gray-300">
        {/* Sidebar Links */}
        <ul className="mt-2 space-y-1">
          <li>
            <Link
              href="/"
              className="flex items-center space-x-2 p-2 hover:bg-blue-200 rounded group"
            >
              <FaHome size={20} />
              <span className="text-sm whitespace-nowrap group-hover:text-blue-600 duration-300">
                Home
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/dispatch"
              className="flex items-center space-x-2 p-2 hover:bg-blue-200 rounded group"
            >
              <TbTruckDelivery size={20} />
              <span className="text-sm whitespace-nowrap group-hover:text-blue-600 duration-300">
                Dispatch
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className="flex items-center space-x-2 p-2 hover:bg-blue-200 rounded group"
            >
              <IoMdSettings size={20} />
              <span className="text-sm whitespace-nowrap group-hover:text-blue-600 duration-300">
                Settings
              </span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-2 min-w-0 overflow-auto">{children}</div>
    </div>
  );
};

export default NavBar;
