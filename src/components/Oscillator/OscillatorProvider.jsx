import OscillatorContext from "./OscillatorContext";

export default function OscillatorProvider({ engine, children, name }) {
  return (
    <OscillatorContext.Provider value={{ osc: engine, name }}>
      {children}
    </OscillatorContext.Provider>
  );
}
