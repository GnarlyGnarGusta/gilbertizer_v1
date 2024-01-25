import tw from "twin.macro";
import { useRootEngine } from "../Root";
import useOscillator from "./useOscillator";

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

/**
 * An oscillator node
 *
 * @param {{ oscillator: import('../../engines/OscillatorEngine').default }} props
 * @returns {JSX.Element}
 */
export default function Wave() {
  const { state, setOsc, getName } = useOscillator();
  const rootEngine = useRootEngine();

  const handleWave = (waveform) => () => {
    setOsc({ type: waveform }, rootEngine.audioContext.currentTime);
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
              name={getName("waveform")}
              value={wave}
              checked={state.type === wave}
              onChange={handleWave(wave)}
              css={[tw`accent-gray-800`]}
            />
            <label for={getName(wave)}>{display}</label>
          </div>
        );
      })}
    </fieldset>
  );
}
