import InstrumentCreator from "./InstrumentCreator";
import promiseInput from "./helpers/promiseInput";

export default class RootEngine {
  constructor({ plugins } = {}) {
    this.audioContext = new AudioContext();
    this.createInstrument = new InstrumentCreator(this.audioContext, {
      plugins,
    }).create;

    this.resumeEnginePlayback = this.resumeEnginePlayback.bind(this);
    this.input = this.input.bind(this);
  }

  async resumeEnginePlayback() {
    return this.audioContext.resume();
  }

  async input() {
    return promiseInput({
      mustResolve: AudioDestinationNode,
      resolver: () => this.audioContext.destination,
    });
  }
}
