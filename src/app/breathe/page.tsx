"use client";

import React from "react";
import { motion } from "framer-motion";

const Breathe = () => {
  const [idx, setIdx] = React.useState(-1);
  // TODO: have user set num breaths!
  const [numBreaths, setNumBreaths] = React.useState(4);
  const [breathe, setBreathe] = React.useState(false);
  const [breathText, setBreathText] = React.useState("breathe");

  const startBreath = () => {
    setIdx(2);
    setBreathe(true);
    setBreathText("take a breath");

    setTimeout(() => {
      setIdx(-1);
      setBreathe(false);
    }, 40 * 1000);
  };

  return (
    <motion.div className="w-full h-full flex items-center justify-center">
      <motion.button
        whileHover={{ ...(breathe ? {} : { scale: 1.1 }) }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={
          idx === 2
            ? {
                // width: ["400px", "100vw"],
                // height: ["400px", "100vh"],
                scale: [1, 5],
                aspectRatio: "1/1",
                transition: {
                  duration: 4,
                  repeat: numBreaths,
                  ease: "linear",
                  repeatType: "reverse",
                  repeatDelay: 2,
                },
              }
            : { width: "400px", height: "400px", scale: 1 }
        }
        transition={{
          type: "spring",
          stiffness: idx === 2 ? 400 : 600,
          damping: 30,
        }}
        className={`aspect-square w-[400px] inset-0 rounded-full ${
          idx == 0 && "p-1 text-base"
        } cursor-pointer hover:border-none
          hover:z-30 z-10 flex items-center justify-center relative`}
        // onMouseOver={() => {
        //   if (breathe) return;
        //   // setIdx(2);
        // }}
        // onMouseLeave={() => {
        //   if (breathe) return;
        //   // setIdx(-1);
        // }}
        onClick={() => startBreath()}
      >
        <p className="absolute z-40 h-full w-full flex font-semibold items-center justify-center">
          {breathe ? breathText : "breathe"}
        </p>
        <span
          className="absolute rounded-full w-full h-full blur-sm
            bg-gradient-to-tr from-blue-800 via-indigo-600 to-cyan-200
          hover:shadow-orange-900/30 hover:shadow-2xl"
        />
      </motion.button>
    </motion.div>
  );
};

export default Breathe;
