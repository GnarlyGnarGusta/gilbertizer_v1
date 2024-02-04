import EngineInterface from "./EngineInterface";
import promiseInput from "./helpers/promiseInput";

const PARAMETERS = {
  FREQUENCY: "frequency",
  DETUNE: "detune",
  TYPE: "type",
};

/**
 *
 * @param {'frequency'|'detune'|'type'} key
 * @param {any} value
 */
function valueReducer(key, value) {
  switch (key) {
    case PARAMETERS.FREQUENCY:
      this.osc.frequency.setValueAtTime(value, this.rootContext.currentTime);
      break;
    case PARAMETERS.DETUNE:
      this.osc.detune.setValueAtTime(value, this.rootContext.currentTime);
      break;
    case PARAMETERS.TYPE:
      this.osc.type = value;
      break;
    default:
      break;
  }
}

const defaultState = {
  frequency: 220,
  detune: 0,
  type: "sine",
};

export default class OscillatorEngine extends EngineInterface {
  constructor(rootContext, initialState = {}) {
    super({ initialState, defaultState, valueReducer, rootContext });

    /**
     * @type {OscillatorNode}
     */
    this.osc;
    this.patch = this.patch.bind(this);
    this.resolveParam = this.resolveParam.bind(this);
    this.paramInput = this.paramInput.bind(this);
  }

  /**
   *
   * @param {keyof defaultState} param
   * @returns {() => promiseInput}
   */
  paramInput(param) {
    return async () =>
      promiseInput({
        mustResolve: AudioParam,
        resolver: () => this.resolveParam(param),
      });
  }

  /**
   * @template T
   * @param {keyof defaultState} param
   * @returns {[T, string]}
   */
  resolveParam(param) {
    let final = [];
    switch (param) {
      case PARAMETERS.FREQUENCY:
        final = [this.osc, "frequency"];
        break;
      case PARAMETERS.DETUNE:
        final = [this.osc, "detune"];
        break;
      default:
        break;
    }

    const [node, audioParameter] = final;

    if (node) {
      return node[audioParameter];
    }

    return final;
  }

  patch(destination) {
    this.osc = new OscillatorNode(this.rootContext, this.state);
    this.osc.onended = () => {
      this.initialized = false;
    };

    destination().then((input) => {
      this.osc.connect(input);
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

OscillatorEngine.params = PARAMETERS;
