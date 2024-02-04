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

  return (
    <Slider
      label="Gain"
      name={id}
      id={id}
      step={1}
      min={0}
      max={20}
      onInput={handleUpdate}
      value={value}
    />
  );
}
