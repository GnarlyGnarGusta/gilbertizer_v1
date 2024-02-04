import rootSoundModule from "../sound_modules/rootSoundModule";

const MasterDelay = rootSoundModule.createInstrument.delay({
  name: "delay",
  title: "Delay",
});

export default MasterDelay;
