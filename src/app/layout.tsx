import type { Metadata } from "next";
import QueryClientProvider from "@/app/QueryClientProvider"
import NavBar from "@/components/Navbar";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import Header from "@/components/Header";

import LoginUser from "./_components/LoginUser";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Pharma Links Agencies",
};

interface UserInfo{
    username?:string
}
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user : UserInfo = session?.user as UserInfo

  return (
    <html lang="en" >
      <body>
        {user ? (
          <>
            <QueryClientProvider>
            <ToastContainer />
            <Header user={user} />
            <NavBar>{children}</NavBar>
            </QueryClientProvider>

          </>
        ) : (
          <LoginUser />
        )}
      </body>
    </html>
  );
}
