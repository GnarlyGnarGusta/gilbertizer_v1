import FatFilterEngine from "../../engines/FatFilterEngine";
import { useEngine } from "../Engine";
import Slider from "../Slider";

export default function HighPassCutoff() {
  const { registerParam } = useEngine();

  const { handleUpdate, id, value } = registerParam(
    FatFilterEngine.params.HPF_CUTOFF,
    {
      onUpdate(event) {
        return event.target.value;
      },
    }
  );

  return (
    <Slider
      label="High Pass Cutoff"
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
