import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authConfig } from "@/auth";
import { API_AUTH_PREFIX, AUTH_ROUTES, PROTECTED_ROUTES } from "@/routes";

export const { auth } = NextAuth(authConfig);

export default auth(req => {
 const pathname = req.nextUrl.pathname;
 const isAuth = req.auth;

 const onAuthApi = pathname.startsWith(API_AUTH_PREFIX);
 const onAuth = AUTH_ROUTES.some(route => pathname.startsWith(route));
 const onProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

 if (onAuthApi) {
  return NextResponse.next();
 }

 if (onAuth) {
  if (isAuth) {
   return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
 }

 if (!isAuth && onProtected) {
  // return NextResponse.redirect(new URL("/login", req.url));
  console.log('not authed and accessing protected route');
 }
});

export const config = {
 matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};