import type { Metadata } from "next";
import NavBar from "@/components/Navbar";
import "./globals.css";
import Header from "@/components/Header";

import LoginUser from "./_components/LoginUser";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Pharma Links Agencies",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  return (
    <html lang="en" data-theme="cmyk">
      <body>
        {user ? (
          <>
            <Header user={user} />
            <NavBar>{children}</NavBar>
          </>
        ) : (
          <LoginUser />
        )}
      </body>
    </html>
  );
}
