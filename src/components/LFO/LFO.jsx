import Frequency from "./Frequency";
import Depth from "./Depth";
import tw from "twin.macro";
import { EngineProvider, useEnginePatchEffect } from "../Engine";
import WaveFormSelect from "../WaveFormSelect";
import LfoEngine from "../../engines/LfoEngine";

/**
 * An oscillator node
 *
 * @param {{ engine: import('../../engines/LfoEngine').default }} props
 * @returns {JSX.Element}
 */
export default function LFO({ engine: lfo, name, title, destination }) {
  useEnginePatchEffect(lfo.patch, destination);

  return (
    <EngineProvider engine={lfo} name={name}>
      <div css={[tw`mb-4 bg-white bg-opacity-10 p-2 rounded`]}>
        <h2 css={[tw`mb-1`]}>{title}</h2>
        <Frequency />
        <Depth />
        <WaveFormSelect param={LfoEngine.params.TYPE} />
      </div>
    </EngineProvider>
  );
}
