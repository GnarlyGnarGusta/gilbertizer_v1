import { initializeState } from "./helpers";

/**
 *
 * @param {'frequency'|'detune'|'type'} key
 * @param {{
 *  timeIn: number,
 *  value: any
 * }} dispatch
 * @param {OscillatorNode} oscInstance
 */
const valueReducer = (key, dispatch, oscInstance) => {
  switch (key) {
    case "frequency":
      oscInstance.frequency.setValueAtTime(dispatch.value, dispatch.timeIn);
      break;
    case "detune":
      oscInstance.detune.setValueAtTime(dispatch.value, dispatch.timeIn);
      break;
    case "type":
      oscInstance.type = dispatch.value;
      break;
    default:
      break;
  }
};

const defaultState = {
  frequency: 220,
  detune: 0,
  type: "sine",
};

export default class OscillatorEngine {
  constructor(initState = {}) {
    this.state = initializeState(initState, defaultState);

    this.osc;

    this.scheduledListeners = new Set();

    this.setValues = this.setValues.bind(this);
    this.getSnapshot = this.getSnapshot.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.emitChange = this.emitChange.bind(this);
    this.patch = this.patch.bind(this);
  }

  patch(context, destination) {
    this.osc = new OscillatorNode(context, this.state);
    this.osc.connect(destination);
    this.osc.start();
  }

  getSnapshot() {
    return this.state;
  }

  subscribe(listener) {
    this.scheduledListeners.add(listener);
    return () => {
      this.scheduledListeners.delete(listener);
    };
  }

  setValues(newValues = {}, timing) {
    this.state = {
      ...this.state,
      ...newValues,
    };

    for (let [key, value] of Object.entries(newValues)) {
      valueReducer(key, { value, timeIn: timing }, this.osc);
    }

    this.emitChange();
  }

  emitChange() {
    for (let listener of this.scheduledListeners) {
      listener();
    }
  }
}
