import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGlobalStore } from "./useGlobalStore";

const PomodoroOption = () => {
  const { pomodoroOnDuration, pomodoroOffDuration } = useGlobalStore();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const currentDuration = isWorkTime ? pomodoroOnDuration : pomodoroOffDuration;
  // time elapsed %
  const progress = (timeElapsed / currentDuration) * 100;
  // timer value
  const timeRemaining = currentDuration - timeElapsed;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed((prev) => {
        if (prev + 1 >= currentDuration) {
          setShowMessage(true);
          clearInterval(interval);
          return currentDuration;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isWorkTime, currentDuration]);

  const handleNextPhase = () => {
    if (showMessage) {
      setShowMessage(false);
      setIsWorkTime(!isWorkTime);
      setTimeElapsed(0);
    }
  };

  return (
    <div
      className="flex items-center justify-center w-[200px] h-[200px] relative cursor-pointer"
      onClick={handleNextPhase}
    >
      <svg className="absolute w-full h-full" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#e5e5e5"
          strokeWidth="10"
          fill="none"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          stroke={isWorkTime ? "#4caf50" : "#2196f3"} // Green for work, blue for break
          strokeWidth="10"
          fill="none"
          strokeDasharray="282.6" // Circumference of the circle (2 * Math.PI * r)
          strokeDashoffset={282.6 - (282.6 * progress) / 100}
          initial={{ strokeDashoffset: 282.6 }}
          animate={{ strokeDashoffset: 282.6 - (282.6 * progress) / 100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </svg>
      {!showMessage && (
        <div className="absolute text-xl font-bold">
          {Math.floor(timeRemaining / 60)
            .toString()
            .padStart(2, "0")}
          :{(timeRemaining % 60).toString().padStart(2, "0")}
        </div>
      )}
      <p className="absolute bottom-1/3 text-xs text-white font-bold">
        {isWorkTime ? "busy...🙇" : "free...🐵"}
      </p>
      {showMessage && (
        <div className="absolute top-1/2 z-50 text-sm px-2 py-1 rounded">
          {isWorkTime ? "Break!" : "Work!"}
        </div>
      )}
    </div>
  );
};

export default PomodoroOption;
