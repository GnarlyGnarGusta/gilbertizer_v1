# Gilbertizer V1

> For my Grandfather, Gilbért Strubel. Thank you for gifting me with the perspective of an engineer.

## Running The Project

First install dependencies `npm i`. Then run a local development instance with `npm run dev`. Then launch the application in a new browser window.

You may need to enable auto play features on your browser for this application. There is a "speed bump" which will prompt the user to resume playback if auto play blocks the base audio context from running.

## Project Overview

The intention of this project is to capture patterns and paradigms that follow the practices of modular synthesis and sound design. The application itself is an implementation of a drone synthesizer, due to its initial simplicity.

A drone synthesizer is a rudimentary circuit that produces a consistent tone without stopping. A drone is usually just made up of a sound source, such as an `Oscillator` to create the pitch and timbre. And some things which modify the tonal qualities of the pitch such as a `Filter`, or modulation in the form of `LFO`.

Using the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API), we can implement these rudiments into functional circuits which are analogous to the ones used in sound production. Using [React](https://react.dev/), we can build and design instruments which provide an interface for users to interact with these circuits.

## The RCA Synthesizer Mark I

My Grandfather was an Electronics Engineer who was trained in the U.S. Army Core of Engineers during World War II. He spent his entire career in the private sector working for RCA. He was a technical lead and circuit designer for several very successful projects there, including the [RCA Synthesizer Mark I](https://ethw.org/RCA_Mark_I_and_Mark_II_Synthesizers).

When I was a young man and became interested in building things, specifically things that make noise. My Grandfather's work at RCA made him a hero to me. The RCA Synthesizer Mark became the first engineering project I would study through the notes and stories of my Grandfather.

One quote stood out most to me, "I had to get the god damn thing working without exhausting the world's supply of vacuum tubes."

The Mark I is a concept of compiling all these rudiments being used for sound design at the time, into one, functional piece of equipment. But why?

**Maintenance**, **efficiency**, **quality**, and **speed**.

Imagine you're working on a project, but it's made up of different applications, written in different languages, by developers who don't even work at the same company. To maintain parts of the project, you have to learn the interpretation of that language from a developer you don't have any contact with other than some comments left in the repo.

When stuff breaks, it doesn't break easy.

To get these applications to work together, that's a whole other story. You need to make sure the applications are able to communicate with each other. And sometimes that means handling special scenarios. What happens when you need to replace it?

You need to figure out a new way to integrate it.

The RCA Synthesizer Mark I was much more than an instrument. It was a standard. Where before there was a kludge of tightly coupled devices, cobbled together with specialized modifications that was prone to failure. Now there was order, structure, and practices that made building things easier.

It became the template for modern synthesizers.

## How this applies to React Developers

If you've stuck with me so far, thank you. I am not done with my analogies, though. So far, I've discussed the Web Audio API and the user interface. Then I went on a tangent about a project from the 1950's.

An application provides the user with access to functional properties. The functional properties might be a server which contains your business logic to read and write to a database. Which frankly, is a pretty damn boring way of learning how to do something properly in React.

React does this sort of thing very well, because it integrates well with almost anything. It just doesn't give you a really good way of doing those integrations out of the box. Because React is just state and components.

You need to bring everything else to the party.

This is not unique to React, or software engineering. It's a feature of Engineering. Methods yield abstraction.

## Building Circuits

This project is split into two parts. There is a set of classes which extend the `EngineInterface`. These classes then are created as singleton to hold the Web Audio API instances and manage their state. These are our _circuits_.

These `EngineInterfaces` are then supplied to an `EngineProvider` context provider, which uses `useContext`, and `useSyncExternalStore` under the hood to sync a set of subscribers with state updates from the `EngineInterface` using the `useEngine` hook.

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

In modular synthesis, you should be able to patch modules together. In the physical world, we would use patch cables to connect inputs and outputs together. In React, we can use side effects and props! These are managed through the `useEnginePatchEffect` hook, you can specify the patching method of the engine, and the destination it should bind itself to. Again, since the responsibility of holding state and instances belongs to the `EngineInterface`, our hook just gives React a way of connecting these two things in a side effect.

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

The `EngineInterface` will contain an input method, that can then be assigned to the `destination`` of another module.

```jsx
const App = () => (
  <Root engine={root}>
    <Oscillator engine={oscillator} destination={filter.input} />
    <Filter engine={filter} destination={root.input} />
  </Root>
);
```

This works with modulation sources as well but are supported via the `paramInput` factory method on an `EngineInterface`. This example allows an LFO to modulate the Filter's Low Pass Cutoff Frequency.

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

### The Root

The Root accesses the base audio context and provides the instruments with an output. All other Web Audio Nodes are created from this base audio context. I am working on the best way to create these nodes while reducing the need to pass it in the creation of every `EngineInterface`.

I created an `InstrumentCreator` helper that allows you to combine the `EngineInterface` instance, with the instruments `EngineProvider`, and a way to name the Instrument as a set of plugins you can assign to the `RootEngine` instance.

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

Please keep in mind that **this project is very much so a work in progress**. This section is for organizing ideas to improve the paradigm and expand on concepts within the project.

### Ideas

- Supply a way to debounce state updates and publishes when a parameter is changed. This will improve the efficiency of the state updates and the way they are reduced down into Web Audio Node parameters.
- Improve `EngineInterface` to have more reusable methods so extensions to the base class can be simpler and focus on the circuit, control, patching, and modulation capabilities.
- Make it look better.
- Destinations are already promise based to ensure an node instance is available for React to connect the patch to other nodes. Look into signal multipliers which combine destinations into a `Promise.all` so the modulation output can be multiplied to multiple destinations.
