"use client";

import React from "react";
import { motion } from "framer-motion";

const Check = () => {
  const [idx, setIdx] = React.useState(-1);
  const [questions, setQuestions] = React.useState(false);

  // TODO: add user answers to questions
  const playQuestions = () => {
    return (
      <>
        <p className="absolute z-40 h-full w-full flex font-semibold items-center justify-center">
          are you okay?
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
        whileHover={{ scale: questions ? 1 : 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={
          questions
            ? { width: "70vh", height: "70vh" }
            : idx === 0
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
