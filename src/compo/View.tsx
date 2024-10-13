"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import prisma from "@/lib/db";

export default function View({ children }: { children?: React.ReactNode }) {
  const [idx, setIdx] = React.useState(-1);
  const router = useRouter();

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <p className="text-3xl"></p>
      {/* <div>{children}</div> */}
      <motion.section
        id="links"
        className="flex items-center h-[130px] gap-2 m-5"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={
            idx === 0
              ? { width: "130px", height: "130px" }
              : { width: "100px", height: "100px" }
          }
          transition={{
            type: "spring",
            stiffness: idx === 0 ? 400 : 600,
            damping: 30,
          }}
          className={`aspect-square w-[100px] inset-0 rounded-full ${
            idx == 0 && "p-1 text-base"
          } cursor-pointer hover:border-none
          hover:z-30 z-10 flex items-center justify-center relative`}
          onMouseOver={() => setIdx(0)}
          onMouseLeave={() => setIdx(-1)}
          onClick={() => router.push("/check")}
        >
          <p className="absolute z-40 h-full w-full flex font-semibold items-center justify-center">
            check
          </p>
          <span
            className="absolute rounded-full w-full h-full blur-sm
            bg-gradient-to-tr from-green-800 via-lime-600 to-yellow-200
          hover:shadow-orange-900/30 hover:shadow-2xl"
          />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={
            idx === 1
              ? { width: "130px", height: "130px" }
              : { width: "100px", height: "100px" }
          }
          transition={{
            type: "spring",
            stiffness: idx === 1 ? 400 : 600,
            damping: 30,
          }}
          className={`aspect-square w-[100px] inset-0 rounded-full ${
            idx == 0 && "p-1 text-base"
          } cursor-pointer hover:border-none
          hover:z-30 z-10 flex items-center justify-center relative`}
          onMouseOver={() => setIdx(1)}
          onMouseLeave={() => setIdx(-1)}
          onClick={() => router.push("/feel")}
        >
          <p className="absolute z-40 h-full w-full flex font-semibold items-center justify-center">
            feel
          </p>
          <span
            className="absolute rounded-full w-full h-full blur-sm
            bg-gradient-to-tr from-red-800 via-pink-600 to-rose-200
          hover:shadow-orange-900/30 hover:shadow-2xl"
          />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={
            idx === 2
              ? { width: "130px", height: "130px" }
              : { width: "100px", height: "100px" }
          }
          transition={{
            type: "spring",
            stiffness: idx === 2 ? 400 : 600,
            damping: 30,
          }}
          className={`aspect-square w-[100px] inset-0 rounded-full ${
            idx == 0 && "p-1 text-base"
          } cursor-pointer hover:border-none
          hover:z-30 z-10 flex items-center justify-center relative`}
          onMouseOver={() => setIdx(2)}
          onMouseLeave={() => setIdx(-1)}
          onClick={() => router.push("/breathe")}
        >
          <p className="absolute z-40 h-full w-full flex font-semibold items-center justify-center">
            breathe
          </p>
          <span
            className="absolute rounded-full w-full h-full blur-sm
            bg-gradient-to-tr from-blue-800 via-indigo-600 to-cyan-200
          hover:shadow-orange-900/30 hover:shadow-2xl"
          />
        </motion.button>
      </motion.section>
    </div>
  );
}
