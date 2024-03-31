# Gilbertizer V1

## Running The Project

1. Install dependencies with `npm i`.
2. Run a local development instance with `npm run dev`.
3. Launch the application in a new browser window.

**Note:** Auto play features may need to be enabled in your browser. A "speed bump" will prompt the user to resume playback if auto play blocks the base audio context.

## Project Overview

This project implements a drone synthesizer based on modular synthesis and sound design principles using the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) and [React](https://react.dev/).

## The RCA Synthesizer Mark I

This project is inspired by the [RCA Synthesizer Mark I](https://ethw.org/RCA_Mark_I_and_Mark_II_Synthesizers), a pioneering project in sound synthesis from the 1950s, designed to streamline sound production processes.

## Building Circuits

The project is split into two parts:

- Classes extending the `EngineInterface` manage Web Audio API instances and state.
- The `EngineProvider` context provider syncs subscribers with state updates using the `useEngine` hook.

```jsx
// Create the Engine Instance
const oscillator = new OscillatorEngine();

// Create a Component that accepts the Engine instance.
const Oscillator = ({ engine, name }) => {
  <EngineProvider engine={engine} name={name}>
    {/* Interface Goes Here */}
  </EngineProvider>;
};

// Create a control which can modify the Engine's parameters
const Frequency = () => {
  const { registerParam } = useEngine();

  const { handleUpdate, id, value } = registerParam(
    OscillatorEngine.params.FREQUENCY,
    {
      onUpdate(event) {
        return event.target.value;
      },
    }
  );

  return (
    <Slider
      label="Frequency"
      name={id}
      id={id}
      step={1}
      min={0}
      max={500}
      onInput={handleUpdate}
      value={value}
    />
  );
};

// Put them all together into an instrument
<Oscillator engine={oscillator} />;
```

Patches will initialize by supplying the destination. The destination is connected in a useEffect.

```js
const useEnginePatchEffect = (patch, destination) => {
  useEffect(() => {
    if (destination) {
      const disconnect = patch(destination);

      return () => {
        disconnect();
      };
    }
  }, [patch, destination]);
};
```

Here you can see an example of an `Oscillator` connecting to a `Filter`.

```jsx
const App = () => (
  <Root engine={root}>
    <Oscillator engine={oscillator} destination={filter.input} />
    <Filter engine={filter} destination={root.input} />
  </Root>
);
```

Another example of an `LFO` modulating the cutoff frequency of a `Filter`.

```jsx
const App = () => (
  <Root engine={root}>
    <Oscillator engine={oscillator} destination={filter.input} />
    <LFO
      engine={lfo}
      destination={filter.paramInput(FilterEngine.params.LPF_CUTOFF)}
    />
    <Filter engine={filter} destination={root.input} />
  </Root>
);
```

The plugin based architecture allows you to create your own instruments.

```jsx
// Create the root with a "granularSynthesizer" plugin.
const root = new RootEngine({
  plugins: ["granularSynthesizer", GranularEngine, GranularSynthesizer],
});

// Create an instrument from the custom plugin.
const GranularSynthesizer1 = root.createInstrument.granularSynthesizer({
  name: "granularSynthesizer1",
  title: "Granular Synthesizer 1",
});

// Create an instrument from a default plugin.
const Filter1 = root.createInstrument.filter({
  name: "Filter1",
  title: "Filter 1",
});

// Connect them together
const App = () => (
  <Root engine={root}>
    <GranularSynthesizer1 destination={Filter1.input} />
    <Filter1 destination={root.input} />
  </Root>
);
```

## Beta Notes

This project is a work in progress. Ideas for improvement include:

- Debouncing state updates for efficiency.
- Enhancing `EngineInterface` with more reusable methods.
- Enhancing visual design.
- Exploring signal multipliers for modulation outputs.

Feel free to contribute ideas or improvements!
