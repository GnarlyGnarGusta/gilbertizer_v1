import LowPassCutoff from "./LowPassCutoff";

import tw from "twin.macro";
import PreampGain from "./PreampGain";
import HighPassCutoff from "./HighPassCutoff";
import Resonance from "./Resonance";

import { useEnginePatchEffect, EngineProvider } from "../Engine";

/**
 * A Filter node
 *
 * @param {{ engine: import('../../engines/FatFilterEngine').default }} props
 * @returns {JSX.Element}
 */
export default function Filter({ engine: filter, name, title, destination }) {
  useEnginePatchEffect(filter.patch, destination);

  return (
    <EngineProvider engine={filter} name={name}>
      <div css={[tw`mb-4 bg-white bg-opacity-10 p-2 rounded`]}>
        <h2 css={[tw`mb-1`]}>{title}</h2>
        <LowPassCutoff />
        <HighPassCutoff />
        <Resonance />
        <PreampGain />
      </div>
    </EngineProvider>
  );
}
