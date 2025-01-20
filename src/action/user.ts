"use server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { signIn, signOut } from "../auth";
import { redirect } from "next/navigation";

const authUser = async (formData: FormData) => {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    throw new Error("Please provide username and password");
  }

  try {
    await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl: "/",
    });
    console.log("User logged in successfully");
  } catch (error) {
    console.error("Error logging in user:", error);
  }
  redirect("/");
};

const registerUser = async (formData: FormData): Promise<void> => {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const username = formData.get("username") as string;

  if (!password || !username) {
    throw new Error("Please provide username and password");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash the password
  const hashedPassword = await hash(password, 12);
  // Create the new user
  await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  console.log("User registered successfully");
};

const LogOut = async () => {
  await signOut();
};
export { registerUser, authUser, LogOut };
