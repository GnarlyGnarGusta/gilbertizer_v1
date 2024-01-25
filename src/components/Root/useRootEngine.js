import RootContext from "./RootContext";
import RootEngine from "../../engines/RootEngine";
import { useContext } from "react";

/**
 * Returns the root engine context
 *
 * @returns {RootEngine} The root engine instance
 */
export default function useRootEngine() {
  const context = useContext(RootContext);

  if (context instanceof RootEngine) {
    return context;
  }

  throw new Error("Root Engine not defined");
}
