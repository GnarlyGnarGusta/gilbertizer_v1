import DelayEngine from "../../engines/DelayEngine";
import { useEngine } from "../Engine";
import Slider from "../Slider";

export default function Feedback() {
  const { registerParam } = useEngine();

  const { handleUpdate, id, value } = registerParam(
    DelayEngine.params.FEEDBACK,
    {
      onUpdate(event) {
        return event.target.value;
      },
    }
  );

  return (
    <Slider
      label="Feedback"
      name={id}
      id={id}
      step={0.01}
      min={0}
      max={1}
      onInput={handleUpdate}
      value={value}
    />
  );
}
