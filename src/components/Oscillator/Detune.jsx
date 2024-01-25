import { useRootEngine } from "../Root";
import tw from "twin.macro";
import useOscillator from "./useOscillator";
import Slider from "../Slider";

/**
 * An oscillator node
 *
 * @param {{ oscillator: import('../../engines/OscillatorEngine').default }} props
 * @returns {JSX.Element}
 */
export default function Detune() {
  const { state, setOsc, getName } = useOscillator();
  const rootEngine = useRootEngine();

  const handleDetune = (event) => {
    const detune = event.target.value;

    setOsc({ detune }, rootEngine.audioContext.currentTime);
  };

  const id = getName("detune");

  return (
    <Slider
      label="Detune"
      name={id}
      id={id}
      step={1}
      min={0}
      max={500}
      onInput={handleDetune}
      value={state.detune}
    />
  );
}
