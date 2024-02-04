import { useContext, useSyncExternalStore } from "react";
import EngineContext from "./EngineContext";
import paramRegistrar from "./paramRegistrar";

export default function useEngine() {
  /**
   * @type {{
   *    engine: import('../../engines/EngineInterface').default,
   *    name: string
   * }}
   */
  const context = useContext(EngineContext);

  if (!context) {
    throw new Error("Engine not defined");
  }

  const state = useSyncExternalStore(
    context.engine.subscribe,
    context.engine.getSnapshot
  );

  const getName = (value) => `${context.name}_${value}`;

  const registerParam = paramRegistrar({
    getName,
    state,
    setter: context.engine.update,
  });

  return {
    state,
    engine: context.engine,
    setParam: context.engine.update,
    name: context.name,
    getName,
    registerParam,
  };
}
