"use client";
import React from "react";
import Image from "next/image";
import logo from "@/assets/images/logo-white.png";


import { usePathname } from "next/navigation";
const Header = () => {
  const pathname = usePathname();

  return (
    <div className="navbar shadow-lg bg-primary ">
      <div className="navbar-start ml-2">
        <Image src={logo} alt="logo" className="h-10 w-auto" />
      </div>

      <div className="navbar-center  hidden sm:block">
        {pathname === "/dispatch" ? <div> Stat</div> : <div></div>}
      </div>

      <div className="avatar placeholder navbar-end">
      <div className="bg-blue-950 text-white text-2xl  w-12 rounded-lg">
            <span>B</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
