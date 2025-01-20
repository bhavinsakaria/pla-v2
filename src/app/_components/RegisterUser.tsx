import React from "react";
import Image from "next/image";
import logo from "@/assets/images/logo-blk.png";
import { registerUser } from "@/action/user";

const RegisterUser = () => {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card bg-base-100 w-full max-w-md shrink-0 shadow-2xl">
          <form className="card-body" action={registerUser}>
            <Image src={logo} alt="logo" className="h-50 w-auto" />
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
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confrim Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                name="confirmPassword"
                required
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;
