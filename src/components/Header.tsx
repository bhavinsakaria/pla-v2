"use client";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut } from "@/action/user";
import logo from "@/assets/images/logo-white.png";
import Link from "next/link";

interface HeaderProps {
  user?: {
    username: string;
  };
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const pathname = usePathname();

  const handleLogout = async () => {
    await LogOut();
    // Additional logic for handling post-logout behavior (e.g., redirect).
  };

  return (
    <div className="navbar shadow-lg bg-primary">
      {/* Navbar Start */}
      <div className="navbar-start ml-2">
        <Image src={logo} alt="logo" className="h-10 w-auto" />
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden sm:block">
        {pathname === "/dispatch" && <div>Stat</div>}
      </div>

      {/* Navbar End */}
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            className="btn btn-ghost bg-blue-950 hover:bg-blue-950 text-xl max-w-24 rounded-btn text-white text-center"
          >
            {user?.username?.charAt(0).toUpperCase() || "?"}
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow"
          >
            <li>
              <a>Profile</a>
            </li>
            <li>
              <a onClick={handleLogout}>Logout</a>
            </li>
            <li>
              <Link href="/user/register">Register User</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
