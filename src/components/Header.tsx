"use client";
import React from "react";
import Image from "next/image";
import logo from "@/assets/images/logo-white.png";


import { usePathname } from "next/navigation";
const Header = () => {
  const pathname = usePathname();

  return (
    <div className="navbar shadow-lg bg-primary ">
      <div className="navbar-start ml-5">
        <Image src={logo} alt="logo" className="h-12 w-auto" />
      </div>

      <div className="navbar-center  hidden sm:block">
        {pathname === "/dispatch" ? <div> Stat</div> : <div></div>}
      </div>

      <div className="avatar placeholder navbar-end">
      <div className="bg-neutral text-neutral-content w-12 rounded-lg">
            <span>SY</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
