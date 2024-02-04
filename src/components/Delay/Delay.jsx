import tw from "twin.macro";

import { useEnginePatchEffect, EngineProvider } from "../Engine";
import DelayTime from "./DelayTime";
import Feedback from "./Feedback";

export default function Delay({ engine: delay, name, title, destination }) {
  useEnginePatchEffect(delay.patch, destination);

  return (
    <EngineProvider engine={delay} name={name}>
      <div css={[tw`mb-4 bg-white bg-opacity-10 p-2 rounded`]}>
        <h2 css={[tw`mb-1`]}>{title}</h2>
        <DelayTime />
        <Feedback />
      </div>
    </EngineProvider>
  );
}
