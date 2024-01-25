import RootContext from "./RootContext";

export default function RootProvider({ engine, children }) {
  return <RootContext.Provider value={engine}>{children}</RootContext.Provider>;
}
