import EngineInterface from "./EngineInterface";

const PARAMETERS = {
  FREQUENCY: "frequency",
  TYPE: "type",
  DEPTH: "depth",
};

/**
 *
 * @param {'frequency'|'depth'|'type'} key
 * @param {any} value
 * @this {LfoEngine}
 */
function valueReducer(key, value) {
  switch (key) {
    case PARAMETERS.FREQUENCY:
      this.osc.frequency.setValueAtTime(value, this.rootContext.currentTime);
      break;
    case PARAMETERS.TYPE:
      this.osc.type = value;
      break;
    case PARAMETERS.DEPTH:
      this.gain.gain.setValueAtTime(value, this.rootContext.currentTime);
      break;
    default:
      break;
  }
}

const defaultState = {
  [PARAMETERS.FREQUENCY]: 0,
  [PARAMETERS.TYPE]: "sine",
  [PARAMETERS.DEPTH]: 10,
};

export default class LfoEngine extends EngineInterface {
  constructor(rootContext, initialState = {}) {
    super({ initialState, defaultState, valueReducer, rootContext });

    /**
     * @type {OscillatorNode}
     */
    this.osc;
    /**
     * @type {GainNode}
     */
    this.gain;
    this.patch = this.patch.bind(this);
  }

  /**
   * TODO: Make destination an array of inputs
   */
  patch(destination) {
    this.osc = new OscillatorNode(this.rootContext, {
      frequency: this.state.frequency,
      type: this.state.type,
    });

    this.osc.onended = () => {
      this.initialized = false;
    };

    this.gain = new GainNode(this.rootContext, {
      gain: this.state.depth,
    });

    destination().then((input) => {
      this.osc.connect(this.gain);
      this.gain.connect(input);
      !this.initialized && this.osc.start();

      this.initialized = true;
    });

    const cleanup = () => {
      if (this.initialized) {
        this.osc.stop();
      }
    };

    return () => {
      cleanup();
    };
  }
}

LfoEngine.params = PARAMETERS;
