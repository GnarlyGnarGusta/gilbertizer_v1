import { useContext, useSyncExternalStore } from "react";
import OscillatorContext from "./OscillatorContext";

export default function useOscillator() {
  /**
   * @type {{
   *    osc: import('../../engines/OscillatorEngine').default,
   *    name: string
   * }}
   */
  const context = useContext(OscillatorContext);

  if (!context) {
    throw new Error("Oscillator engine not defined");
  }

  const state = useSyncExternalStore(
    context.osc.subscribe,
    context.osc.getSnapshot
  );

  const getName = (value) => `${context.name}_${value}`;

  return {
    state,
    osc: context.osc,
    setOsc: context.osc.setValues,
    name: context.name,
    getName,
  };
}
