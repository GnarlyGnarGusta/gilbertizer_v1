import Slider from "../Slider";
import { useEngine } from "../Engine";
import OscillatorEngine from "../../engines/OscillatorEngine";

export default function Detune() {
  const { registerParam } = useEngine();

  const { handleUpdate, id, value } = registerParam(
    OscillatorEngine.params.DETUNE,
    {
      onUpdate(event) {
        return event.target.value;
      },
    }
  );

  return (
    <Slider
      label="Detune"
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
