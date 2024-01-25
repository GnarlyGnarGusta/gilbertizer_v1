export default class RootEngine {
  constructor() {
    this.audioContext = new AudioContext();
    this.resumeEnginePlayback = this.resumeEnginePlayback.bind(this);
  }

  async resumeEnginePlayback() {
    return this.audioContext.resume();
  }
}
