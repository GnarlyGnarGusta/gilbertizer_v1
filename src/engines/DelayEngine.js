import EngineInterface from "./EngineInterface";
import promiseInput from "./helpers/promiseInput";

const PARAMETERS = {
  DELAY_TIME: "delayTime",
  MIX: "mix",
  FEEDBACK: "feedback",
};

/**
 *
 * @param {'frequency'|'depth'|'type'} key
 * @param {any} value
 * @this {DelayEngine}
 */
function valueReducer(key, value) {
  switch (key) {
    case PARAMETERS.DELAY_TIME:
      this.delay.delayTime.setValueAtTime(value, this.rootContext.currentTime);
      break;
    case PARAMETERS.FEEDBACK:
      this.feedback.gain.setValueAtTime(value, this.rootContext.currentTime);
      break;
    default:
      break;
  }
}

const defaultState = {
  [PARAMETERS.DELAY_TIME]: 1,
  [PARAMETERS.MIX]: 0,
  [PARAMETERS.FEEDBACK]: 0.5,
};

export default class DelayEngine extends EngineInterface {
  constructor(rootContext, initialState = {}) {
    super({ initialState, defaultState, valueReducer, rootContext });

    /**
     * @type {DelayNode}
     */
    this.delay;

    /**
     * @type {GainNode}
     */
    this.feedback;

    /**
     * @type {BiquadFilterNode}
     */
    this.toneFeedback;

    this.input = this.input.bind(this);
    this.patch = this.patch.bind(this);
  }

  async input() {
    return promiseInput({
      mustResolve: DelayNode,
      resolver: () => this.delay,
    });
  }

  patch(destination) {
    this.delay = new DelayNode(this.rootContext, {
      delayTime: this.state[PARAMETERS.DELAY_TIME],
    });

    this.feedback = new GainNode(this.rootContext, {
      gain: this.state[PARAMETERS.FEEDBACK],
    });

    this.toneFeedback = new BiquadFilterNode(this.rootContext, {
      type: "highshelf",
      frequency: 3000,
      gain: -0.5,
    });

    destination().then((destination) => {
      // Darkens the repeats
      this.delay.connect(this.toneFeedback);
      this.toneFeedback.connect(this.feedback);
      this.feedback.connect(this.delay);
      this.delay.connect(destination);
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

DelayEngine.params = PARAMETERS;
