import { useContext } from "react";
import { Store } from "./Store";

export const useGlobalStore = () => {
  const context = useContext(Store);
  if (!context) {
    throw new Error("useGlobalStore must be used within a GlobalProvider");
  }
  return context;
};
