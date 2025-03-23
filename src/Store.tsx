import React, { createContext } from "react";

export type Option = "home" | "pomodoro" | "notes" | "settings";

export interface Store {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  pomodoroOnDuration: number;
  setPomodoroOnDuration: React.Dispatch<React.SetStateAction<number>>;
  pomodoroOffDuration: number;
  setPomodoroOffDuration: React.Dispatch<React.SetStateAction<number>>;

  selectedOption: Option;
  setSelectedOption: React.Dispatch<React.SetStateAction<Option>>;
}

// Create context
export const Store = createContext<Store | undefined>(undefined);
