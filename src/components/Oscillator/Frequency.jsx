import Slider from "../Slider";
import { useEngine } from "../Engine";
import OscillatorEngine from "../../engines/OscillatorEngine";

/**
 * An oscillator node
 *
 * @param {{ oscillator: import('../../engines/OscillatorEngine').default }} props
 * @returns {JSX.Element}
 */
export default function Frequency() {
  const { registerParam } = useEngine();

  const { handleUpdate, id, value } = registerParam(
    OscillatorEngine.params.FREQUENCY,
    {
      onUpdate(event) {
        return event.target.value;
      },
    }
  );

  return (
    <Slider
      label="Frequency"
      name={id}
      id={id}
      step={1}
      min={0}
      max={500}
      onInput={handleUpdate}
      value={value}
    />
  );
}
