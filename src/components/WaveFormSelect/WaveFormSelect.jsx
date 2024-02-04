import tw from "twin.macro";
import { useEngine } from "../Engine";

const waveTable = [
  {
    wave: "sine",
    display: "Sine",
  },
  {
    wave: "square",
    display: "Square",
  },
  {
    wave: "sawtooth",
    display: "Sawtooth",
  },
  {
    wave: "triangle",
    display: "Triangle",
  },
];

export default function WaveFormSelect({ param }) {
  const { registerParam, getName } = useEngine();

  const { handleUpdate, id, value } = registerParam(param, {
    onUpdate(wave) {
      return wave;
    },
  });

  const handleWave = (waveform) => () => {
    handleUpdate(waveform);
  };

  return (
    <fieldset>
      <legend>Waveform</legend>
      {waveTable.map(({ wave, display }) => {
        return (
          <div key={wave} css={[tw`inline-flex gap-2 w-full`]}>
            <input
              type="radio"
              id={getName(wave)}
              name={id}
              value={wave}
              checked={value === wave}
              onChange={handleWave(wave)}
              css={[tw`accent-gray-800`]}
            />
            <label htmlFor={getName(wave)}>{display}</label>
          </div>
        );
      })}
    </fieldset>
  );
}
