import LfoEngine from "../../engines/LfoEngine";
import { useEngine } from "../Engine";
import Slider from "../Slider";

export default function Depth() {
  const { registerParam } = useEngine();

  const { handleUpdate, id, value } = registerParam(LfoEngine.params.DEPTH, {
    onUpdate(event) {
      return event.target.value;
    },
  });

  return (
    <Slider
      label="Depth"
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
