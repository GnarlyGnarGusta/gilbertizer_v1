import FatFilterEngine from "../../engines/FatFilterEngine";
import { useEngine } from "../Engine";
import Slider from "../Slider";

export default function PreampGain() {
  const { registerParam } = useEngine();

  const { handleUpdate, id, value } = registerParam(
    FatFilterEngine.params.PRE_GAIN,
    {
      onUpdate(event) {
        return event.target.value;
      },
    }
  );

  /**
   * TODO: make min and max values part of the instruments parameters.
   */
  return (
    <Slider
      label="Gain"
      name={id}
      id={id}
      step={0.1}
      min={0}
      max={1}
      onInput={handleUpdate}
      value={value}
    />
  );
}
