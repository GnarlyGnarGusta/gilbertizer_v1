import LfoEngine from "../../engines/LfoEngine";
import { useEngine } from "../Engine";
import Slider from "../Slider";

export default function Frequency() {
  const { registerParam } = useEngine();

  const { handleUpdate, id, value } = registerParam(
    LfoEngine.params.FREQUENCY,
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
      max={100}
      onInput={handleUpdate}
      value={value}
    />
  );
}
