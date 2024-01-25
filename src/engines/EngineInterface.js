import { initializeState } from "./helpers";

export default class EngineInterface {
  constructor({
    initialState = {},
    defaultState = {},
    valueReducer = () => {},
  } = {}) {
    this.state = initializeState(initialState, defaultState);
    this.valueReducer = valueReducer.bind(this);

    this.getSnapshot = this.getSnapshot.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.update = this.update.bind(this);
    this.emitChange = this.emitChange.bind(this);
  }

  getSnapshot() {
    return this.state;
  }

  /**
   * Triggers listeners.
   *
   * @param {(...any) => void} listener The state listener
   * @returns {() => void} A cleanup function
   */
  subscribe(listener) {
    this.scheduledListeners.add(listener);

    return () => {
      this.scheduledListeners.delete(listener);
    };
  }

  update(newState) {
    this.state = {
      ...this.state,
      ...newState,
    };

    for (let [key, value] of Object.entries(newState)) {
      this.valueReducer(key, value);
    }

    this.emitChange();
  }

  emitChange() {
    for (let listener of this.scheduledListeners) {
      listener();
    }
  }
}
