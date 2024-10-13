import { NextAuthConfig} from "next-auth";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // callbacks: {
  //   async signIn({ account, profile }) {
  //     if (!profile?.email) {
  //       throw new Error("Email not found");
  //     }

  //     await prisma.user.upsert({
  //       where: { email: profile.email },
  //       create: {
  //         email: profile.email,
  //         name: profile.name,
  //         image: profile.picture,
  //       },
  //       update: {
  //         name: profile.name,
  //       },
  //     });

  //     return true;
  //   }
  // },
};

export const { handlers, signIn, signOut, auth } = NextAuth({
 ...authConfig,
 adapter: PrismaAdapter(prisma),
 session: {
  strategy: "jwt",
 },
 pages: {
  // signIn: "/login",
 },
 callbacks: {
  async jwt({ token, user }) {
   if (user) {
    // get user from prisma (db) with the email
    // if there is no user with the email, create new user
    // else set the user data to token
    console.log("jtw() - USER", user);
   }

   return token;
  },

  async session({ session, token }) {
   if (token) {
    // set the token data to session
    console.log("session() - TOKEN", token);
   }

   return session;
  },

  redirect() {
   // redirect to login page
   return "/";
  //  return "/login";
  },

  // async signIn({ account, profile }) {
  //   if (!profile?.email) {
  //     throw new Error("Email not found");
  //   }

  //   // await prisma.user.upsert({
  //   //   where: { email: profile.email },
  //   //   create: {
  //   //     email: profile.email,
  //   //     name: profile.name,
  //   //     image: profile.picture,
  //   //   },
  //   //   update: {
  //   //     name: profile.name,
  //   //   },
  //   // });

  //   console.log("signIn() - PROFILE", profile);

  //   return true;
  // }
 },
});