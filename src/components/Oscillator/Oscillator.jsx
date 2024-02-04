import Frequency from "./Frequency";
import Detune from "./Detune";
import tw from "twin.macro";
import { EngineProvider, useEnginePatchEffect } from "../Engine";
import WaveFormSelect from "../WaveFormSelect";
import OscillatorEngine from "../../engines/OscillatorEngine";

/**
 * An oscillator node
 *
 * @param {{ engine: import('../../engines/OscillatorEngine').default }} props
 * @returns {JSX.Element}
 */
export default function Oscillator({
  engine: oscillator,
  name,
  title,
  destination,
}) {
  useEnginePatchEffect(oscillator.patch, destination);

  return (
    <EngineProvider engine={oscillator} name={name}>
      <div css={[tw`mb-4 bg-white bg-opacity-10 p-2 rounded`]}>
        <h2 css={[tw`mb-1`]}>{title}</h2>
        <Frequency />
        <Detune />
        <WaveFormSelect param={OscillatorEngine.params.TYPE} />
      </div>
    </EngineProvider>
  );
}
