import React from "react";
import { Global } from "@emotion/react";
import tw, { css, theme, GlobalStyles as BaseStyles } from "twin.macro";
import ids from "./utils/ids";

import rootSoundModule from "./sound_modules/rootSoundModule";
import { Root } from "./components/Root";
import Oscillator1 from "./instruments/Oscillator1";
import Filter1 from "./instruments/Filter1";
import LFO1 from "./instruments/LFO1";
import FatFilterEngine from "./engines/FatFilterEngine";
import LFO2 from "./instruments/LFO2";
import MasterDelay from "./instruments/Delay";

const initStyles = css({
  body: {
    color: theme`colors.gray.100`,
    background: theme`colors.red.900`,
    fontSize: "16px",
    ...tw`antialiased text-base`,
  },
});

function App() {
  return (
    <React.Fragment>
      <BaseStyles />
      <Global styles={initStyles} />
      <main
        id={ids.containers.main}
        css={[tw`w-full h-screen flex flex-col justify-between gap-4`]}
      >
        <header css={[tw`bg-gray-100 text-gray-800 p-2`]}>
          <h1>Gilbertizer V1</h1>
        </header>
        <section css={[tw`grow p-2`]}>
          <Root engine={rootSoundModule}>
            <div css={[tw`grid grid-cols-2 md:grid-cols-4 gap-2`]}>
              <Oscillator1 destination={Filter1.input} />
              <Filter1 destination={MasterDelay.input} />
              <LFO1
                title="Filter Frequency Mod"
                destination={Filter1.paramInput(
                  FatFilterEngine.params.LPF_CUTOFF
                )}
              />
              <LFO2
                title="Filter Gain Mod"
                destination={Filter1.paramInput(
                  FatFilterEngine.params.PRE_GAIN
                )}
              />
              <MasterDelay destination={rootSoundModule.input} />
            </div>
          </Root>
        </section>
        <footer
          css={[
            tw`px-4 pt-4 pb-3 text-gray-300 border-t border-red-950 text-sm font-bold`,
          ]}
        >
          &copy;&nbsp;Gnar Gusta {new Date().getFullYear()}
        </footer>
      </main>
    </React.Fragment>
  );
}

export default App;
