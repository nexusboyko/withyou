import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth";
import { API_AUTH_PREFIX, AUTH_ROUTES, PROTECTED_ROUTES } from "@/routes";

export const { auth } = NextAuth(authConfig);

export default auth(req => {
 const path = req.nextUrl.pathname;
 const isAuth = req.auth;

 const onAuthApi = path.startsWith(API_AUTH_PREFIX);
 const onAuth = AUTH_ROUTES.some(route => path.startsWith(route));
 const onProtected = PROTECTED_ROUTES.some(route => path.startsWith(route));

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
  // allow ANYONE (no auth check for now)
  // return NextResponse.redirect(new URL("/login", req.url));
 }
});