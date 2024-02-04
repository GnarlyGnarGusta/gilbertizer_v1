import DelayEngine from "../../engines/DelayEngine";
import { useEngine } from "../Engine";
import Slider from "../Slider";

export default function DelayTime() {
  const { registerParam } = useEngine();

  const { handleUpdate, id, value } = registerParam(
    DelayEngine.params.DELAY_TIME,
    {
      onUpdate(event) {
        return event.target.value;
      },
    }
  );

  return (
    <Slider
      label="Delay Time"
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
