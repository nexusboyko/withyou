import React, { useState, ReactNode } from "react";
import { Option, Store } from "./Store";

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [count, setCount] = useState(0);
  const [pomodoroOnDuration, setPomodoroOnDuration] = useState<number>(10);
  const [pomodoroOffDuration, setPomodoroOffDuration] = useState<number>(5);
  const [selectedOption, setSelectedOption] = useState<Option>("home");

  return (
    <Store.Provider
      value={{
        count,
        setCount,
        pomodoroOnDuration,
        setPomodoroOnDuration,
        pomodoroOffDuration,
        setPomodoroOffDuration,
        selectedOption,
        setSelectedOption,
      }}
    >
      {children}
    </Store.Provider>
  );
};
