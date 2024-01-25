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
export default function Frequency() {
  const { state, setOsc, getName } = useOscillator();
  const rootEngine = useRootEngine();

  const handleFrequency = (event) => {
    const frequency = event.target.value;

    setOsc({ frequency }, rootEngine.audioContext.currentTime);
  };

  const id = getName("frequency");

  return (
    <Slider
      label="Frequency"
      name={id}
      id={id}
      step={1}
      min={0}
      max={500}
      onInput={handleFrequency}
      value={state.frequency}
    />
  );
}
