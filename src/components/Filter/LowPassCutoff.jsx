import FatFilterEngine from "../../engines/FatFilterEngine";
import { useEngine } from "../Engine";
import Slider from "../Slider";

/**
 * An oscillator node
 *
 * @param {{ oscillator: import('../../engines/OscillatorEngine').default }} props
 * @returns {JSX.Element}
 */
export default function LowPassCutoff() {
  const { registerParam } = useEngine();

  const { handleUpdate, id, value } = registerParam(
    FatFilterEngine.params.LPF_CUTOFF,
    {
      onUpdate(event) {
        return event.target.value;
      },
    }
  );

  return (
    <Slider
      label="Low Pass Cutoff"
      name={id}
      id={id}
      step={1}
      min={0}
      max={220}
      onInput={handleUpdate}
      value={value}
    />
  );
}
