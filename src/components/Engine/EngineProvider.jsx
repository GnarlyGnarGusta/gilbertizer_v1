import EngineContext from "./EngineContext";

export default function EngineProvider({ engine, children, name }) {
  return (
    <EngineContext.Provider value={{ engine, name }}>
      {children}
    </EngineContext.Provider>
  );
}
