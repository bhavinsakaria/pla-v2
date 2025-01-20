import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "username", type: "text", placeholder: "username" },
        password: {
          label: "password",
          type: "password",
          placeholder: "password",
        },
      },
      authorize: async (credentials) => {
        const username = credentials?.username as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!username || !password) {
          throw new CredentialsSignin("Please provide username and password");
        }
        const user = await prisma.user.findUnique({
          where: {
            username,
          },
        });
        if (!user) {
          throw new CredentialsSignin("User not found");
        }
        if (!user.password) {
          throw new CredentialsSignin("Invalid username or password");
        }

        const isMatched = await compare(password, user.password);

        if (!isMatched) {
          throw new Error("Invalid username or password");
        }

        const userData = {
          id: user.id,
          username: user.username,
          role: user.role,
        };
        return userData;
      },
    }),
  ],

  pages: {
    signIn: "/",
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.sub && token?.role) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.username = token.username;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.sub = user.id;
        token.username = user.username;
      }
      return token;
    },
    signIn: async ({ account }) => {
      if (account?.provider === "credentials") {
        return true;
      } else {
        return false;
      }
    },
  },
});
