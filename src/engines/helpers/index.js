/**
 * Takes in two state objects returning the merged defaults.
 * TODO: Assumes that the state object is flat. For deep merge,
 * - Consider lodash or underscore (yick)
 *
 * @template T
 * @param {T} state The initialed state
 * @param {T} defaultState The static defaults
 * @returns {T} The merged, stable state
 */
function initializeState(state, defaultState) {
  return Object.assign(defaultState, state);
}

export { initializeState };
