/**
 * Waits for an input to resolve a instance of a defined type.
 * - This is required because the instrument may not be initialized yet.
 * - Used when registering a patch.
 * @template F
 * @param {{
 *  mustResolve: F,
 *  timeout: number,
 *  interval: number,
 *  resolver: () => undefined | null | F
 * }} config
 * @returns {Promise<F, any>}
 */
export default async function promiseInput({
  mustResolve: MustResolve,
  timeout = 4000,
  interval = 20,
  resolver = () => {},
} = {}) {
  let start = Date.now();
  /**
   * @param {() => void} resolve
   * @param {() => void} reject
   */
  function loop(resolve, reject) {
    const currentValue = resolver();
    if (currentValue instanceof MustResolve) {
      resolve(currentValue);
    } else if (timeout && Date.now() - start >= timeout) {
      reject(new Error("Timeout exceeded"));
    } else {
      setTimeout(loop.bind(this, resolve, reject), interval);
    }
  }

  return new Promise(loop);
}
