import React from "react";

const ErrorMessage = ({ children }: { children: React.ReactNode }) => {
  if (!children) return null;
  return <p className="text-red-500">{children}</p>;
};

export default ErrorMessage;
