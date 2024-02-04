export default function paramRegistrar({
  getName = () => undefined,
  state = {},
  setter = () => {},
} = {}) {
  return (param, { onUpdate } = {}) => ({
    value: state[param],
    handleUpdate: (...args) => {
      let value;
      if (typeof onUpdate === "function") {
        value = onUpdate(...args);
      }

      setter({ [param]: value });
    },
    id: getName(param),
  });
}
