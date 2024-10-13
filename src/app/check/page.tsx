"use client";

import React from "react";
import { motion } from "framer-motion";

const Check = () => {
  const [idx, setIdx] = React.useState(-1);
  const [questions, setQuestions] = React.useState(false);

  const toAsk: Object[] = [
    {
      q: "Are you okay?",
      a1: "yes",
      a2: "no",
    },
  ];

  const playQuestions = () => {
    return (
      <>
        <p className="absolute z-40 h-full w-full flex flex-col font-semibold text-3xl items-center justify-center">
          {toAsk.map((q: any, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute z-40 h-full w-full flex flex-col font-semibold text-3xl items-center justify-center"
            >
              <p>{q.q}</p>
              <motion.div className="flex gap-2 p-7">
                <motion.button
                  className="rounded-full h-[50px] aspect-square text-xl p-5 hover:bg-white/15 transition-all ease-in-out duration-200 filter hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] flex justify-center items-center "
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  onClick={() => {}}
                >
                  {q.a1}
                </motion.button>
                <motion.button
                  className="rounded-full h-[50px] aspect-square text-xl p-5 hover:bg-white/15 transition-all ease-in-out duration-200 filter hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] flex justify-center items-center "
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  onClick={() => {}}
                >
                  {q.a2}
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </p>
        <span
          className="absolute rounded-full w-full h-full blur-sm
            bg-gradient-to-tr from-green-800 via-lime-600 to-yellow-200
          hover:shadow-orange-900/30 hover:shadow-2xl"
        />
      </>
    );
  };

  return (
    <motion.div className="w-full h-full flex items-center justify-center">
      <motion.button
        whileHover={{ ...(questions ? {} : { scale: 1.1 }) }}
        whileTap={{ ...(questions ? {} : { scale: 0.9 }) }}
        initial={{ scale: 0 }}
        animate={
          questions
            ? { width: "70vh", height: "70vh", scale: 1 }
            : idx === 0
            ? { width: "130px", height: "130px", scale: 1 }
            : { width: "100px", height: "100px", scale: 1 }
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
        onClick={() => setQuestions(true)}
      >
        {questions ? (
          playQuestions()
        ) : (
          <>
            <p className="absolute z-40 h-full w-full flex font-semibold items-center justify-center">
              check
            </p>
            <span
              className="absolute rounded-full w-full h-full blur-sm
                bg-gradient-to-tr from-green-800 via-lime-600 to-yellow-200
              hover:shadow-orange-900/30 hover:shadow-2xl"
            />
          </>
        )}
      </motion.button>
    </motion.div>
  );
};

export default Check;
