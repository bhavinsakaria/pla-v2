"use client";
import React from "react";
import Image from "next/image";
import logo from "@/assets/images/logo-blk.png";
import { authUser } from "@/action/user";

const LoginUser = () => {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card bg-base-100 w-full max-w-md shrink-0 shadow-2xl">
          <form className="card-body" action={authUser}>
            <Image src={logo} alt="logo" className="h-50 w-auto" />
            <h1 className="text-2xl font-bold text-center">Log In </h1>
            <div className="form-control">
              <label className="label">
                <span className="label-text ">Email</span>
              </label>
              <input
                type="username"
                placeholder="Enter Username"
                className="input input-bordered"
                name="username"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                name="password"
                required
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginUser;
