import FatFilterEngine from "../../engines/FatFilterEngine";
import { useEngine } from "../Engine";
import Slider from "../Slider";

export default function Resonance() {
  const { registerParam } = useEngine();

  const { handleUpdate, id, value } = registerParam(
    FatFilterEngine.params.RESONANCE,
    {
      onUpdate(event) {
        return event.target.value;
      },
    }
  );

  return (
    <Slider
      label="Resonance"
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
