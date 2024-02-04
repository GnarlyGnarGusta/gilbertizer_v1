import OscillatorEngine from "./OscillatorEngine";
import FatFilterEngine from "./FatFilterEngine";
import LfoEngine from "./LfoEngine";

import Oscillator from "../components/Oscillator";
import LFO from "../components/LFO";
import Filter from "../components/Filter";
import DelayEngine from "./DelayEngine";
import Delay from "../components/Delay";

const basePlugins = [
  ["lfo", LfoEngine, LFO],
  ["filter", FatFilterEngine, Filter],
  ["oscillator", OscillatorEngine, Oscillator],
  ["delay", DelayEngine, Delay],
];

export default class InstrumentCreator {
  constructor(baseAudiContext, { plugins = [] } = {}) {
    this.context = baseAudiContext;
    this.plugins = [...plugins, ...basePlugins];
    this.create = this.create.bind(this);

    // Assign plugins to creator
    for (let [name, instrument, component] of this.plugins) {
      this.create[name] = (defaults) =>
        this.create(instrument, component, defaults);
    }
  }

  create(
    Instrument,
    Component,
    { defaultState = {}, name, title: Title } = {}
  ) {
    const engineInstance = new Instrument(this.context, defaultState);
    const instanceName = `${name}_${Date.now()}`.toUpperCase();

    function DecoratedComponent(props) {
      return (
        <Component
          title={Title}
          {...props}
          name={instanceName}
          engine={engineInstance}
        />
      );
    }

    DecoratedComponent.displayName = instanceName;

    if (engineInstance.input) {
      DecoratedComponent.input = engineInstance.input;
    }

    if (engineInstance.paramInput) {
      DecoratedComponent.paramInput = engineInstance.paramInput;
    }

    return DecoratedComponent;
  }
}
