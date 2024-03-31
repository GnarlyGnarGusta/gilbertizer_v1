import EngineInterface from "./EngineInterface";
import promiseInput from "./helpers/promiseInput";
import { makeHardClippingCurve } from "./helpers/clipping";

const PARAMETERS = {
  PRE_GAIN: "preGain",
  DISTORTION: "distortion",
  RESONANCE: "resonance",
  LPF_CUTOFF: "lpfCutoff",
  HPF_CUTOFF: "hpfCutoff",
};

/**
 *
 * @param {'frequency'|'detune'|'type'} key
 * @param {any} value
 * @this {FatFilterEngine}
 */
function valueReducer(key, value) {
  switch (key) {
    case PARAMETERS.LPF_CUTOFF:
      this.lowPassFilter.frequency.setTargetAtTime(
        value,
        this.rootContext.currentTime,
        0
      );
      break;
    case PARAMETERS.HPF_CUTOFF:
      this.highPassFilter.frequency.setTargetAtTime(
        value,
        this.rootContext.currentTime,
        0
      );
      break;
    case PARAMETERS.RESONANCE:
      this.lowPassFilter.Q.setTargetAtTime(
        value,
        this.rootContext.currentTime,
        0
      );
      break;
    case PARAMETERS.PRE_GAIN:
      // may not be required since the context is already based off a value that could change
      this.preamp.gain.setTargetAtTime(
        value,
        this.preamp.context.currentTime,
        0
      );
      break;
    default:
      break;
  }
}

const defaultState = {
  [PARAMETERS.PRE_GAIN]: 1,
  [PARAMETERS.DISTORTION]: 0,
  [PARAMETERS.RESONANCE]: 20,
  [PARAMETERS.LPF_CUTOFF]: 20,
  [PARAMETERS.HPF_CUTOFF]: 0,
};

export default class FatFilterEngine extends EngineInterface {
  constructor(rootContext, initialState = {}) {
    super({ initialState, defaultState, valueReducer, rootContext });

    /**
     * @type {WaveShaperNode}
     */
    this.waveShaper;
    /**
     * @type {BiquadFilterNode}
     */
    this.lowPassFilter;
    /**
     * @type {BiquadFilterNode}
     */
    this.highPassFilter;
    /**
     * @type {GainNode}
     */
    this.preamp;
    /**
     * @type {ConstantSourceNode}
     */
    this.sharedResonance;

    this.patch = this.patch.bind(this);
    this.input = this.input.bind(this);
    this.resolveParam = this.resolveParam.bind(this);
    this.paramInput = this.paramInput.bind(this);
  }

  async input() {
    return promiseInput({
      mustResolve: BiquadFilterNode,
      resolver: () => this.highPassFilter,
    });
  }

  /**
   * @template T
   * @param {keyof defaultState} param
   * @returns {() => Promise<T>}
   */
  paramInput(param) {
    /**
     * @type {Object.<keyof defaultState, AudioParam>}
     */
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
      case PARAMETERS.LPF_CUTOFF:
        final = [this.lowPassFilter, "frequency"];
        break;
      case PARAMETERS.HPF_CUTOFF:
        final = [this.highPassFilter, "frequency"];
        break;
      case PARAMETERS.RESONANCE:
        final = [this.lowPassFilter, "Q"];
        break;
      case PARAMETERS.PRE_GAIN:
        final = [this.preamp, "gain"];
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
    this.lowPassFilter = new BiquadFilterNode(this.rootContext, {
      frequency: this.state.lpfCutoff,
      Q: this.state.resonance,
      type: "lowpass",
    });

    this.highPassFilter = new BiquadFilterNode(this.rootContext, {
      frequency: this.state.hpfCutoff,
      Q: 10,
      type: "highpass",
    });

    this.preamp = new GainNode(this.rootContext, {
      gain: this.state.preGain,
    });

    this.waveShaper = new WaveShaperNode(this.rootContext, {
      curve: makeHardClippingCurve(100),
      oversample: "4x",
    });

    destination().then((destination) => {
      this.highPassFilter.connect(this.waveShaper);
      this.waveShaper.connect(this.lowPassFilter);
      this.lowPassFilter.connect(this.preamp);
      this.preamp.connect(destination);
      this.initialized = true;
    });

    const cleanup = () => {
      if (this.initialized) {
        this.initialized = false;
      }
    };

    return () => {
      cleanup();
    };
  }
}

FatFilterEngine.params = PARAMETERS;
