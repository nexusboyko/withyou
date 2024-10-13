"use client";

import React from "react";
import { motion } from "framer-motion";

const Feel = () => {
  const [idx, setIdx] = React.useState(-1);

  // FIXME: AI chatbot feature?

  return (
    <motion.div className="w-full h-full flex items-center justify-center">
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
        onClick={() => {}}
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
    </motion.div>
  );
};

export default Feel;
