"use client";

import React from "react";
import { motion } from "framer-motion";

import prisma from "@/lib/db";

export default function View({ children }: { children?: React.ReactNode }) {
  const [idx, setIdx] = React.useState(-1);

  React.useEffect(() => {}, []);

  return (
    <>
      <p className="text-3xl"></p>
      <div>{children}</div>
      <motion.section
        id="links"
        className="flex items-center h-[130px] w-full gap-2 m-5"
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
        >
          <p className="absolute z-40 h-full w-full flex items-center justify-center">
            check in
          </p>
          <span
            className="absolute rounded-full w-full h-full blur-sm
            bg-gradient-to-tr from-green-800 via-lime-600 to-yellow-200
          hover:shadow-orange-900/30 hover:shadow-2xl"
          />
        </motion.button>
      </motion.section>
    </>
  );
}
