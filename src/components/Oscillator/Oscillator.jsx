import { useEffect } from "react";
import { useRootEngine } from "../Root";

import Frequency from "./Frequency";
import Detune from "./Detune";
import Wave from "./Wave";
import OscillatorProvider from "./OscillatorProvider";
import tw from "twin.macro";

/**
 * An oscillator node
 *
 * @param {{ oscillator: import('../../engines/OscillatorEngine').default }} props
 * @returns {JSX.Element}
 */
export default function Oscillator({ oscillator, name, title }) {
  const rootEngine = useRootEngine();

  useEffect(() => {
    oscillator.patch(
      rootEngine.audioContext,
      rootEngine.audioContext.destination
    );

    return () => {
      oscillator.osc.stop();
    };
  }, [rootEngine, oscillator]);

  return (
    <OscillatorProvider engine={oscillator} name={name}>
      <div css={[tw`mb-4 bg-white bg-opacity-10 p-2 rounded`]}>
        <h2 css={[tw`mb-1`]}>{title}</h2>
        <Frequency />
        <Detune />
        <Wave />
      </div>
    </OscillatorProvider>
  );
}
