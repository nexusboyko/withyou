"use server";

import React from "react";

import { auth, signOut, signIn } from "@/auth";
// import { notFound } from "next/navigation";
import Image from "next/image";

const User = async () => {
  const session = await auth();
  // user not logged in
  // if (!session) return notFound();

  if (!session) {
    return (
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <button type="submit">Login with Google</button>
      </form>
    );
  }

  return (
    <>
      <Image
        src={session.user?.image as string}
        width={100}
        height={100}
        alt="logo"
        className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] rounded-full"
      />
      <h1>{session.user?.name || session.user?.email}</h1>

      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit" className="btn btn-primary">
          Log Out
        </button>
      </form>
    </>
  );
};

export default User;
