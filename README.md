# GlassX

GlassX is a simple context based state management library for React and React Native. It provides simple hooks and classes to get you started right away. No need for initializing a context or any such thing. Just start writing and reading your state.

GlassX is based on Reactn by Charles Stover but is more tailored towards speed building from the ground up and polished with modern react. It has a ton of handy features with a minimal learning curve which makes it perfect for everyone.

## Features

### No boilerplate

Right after installation, you can call `GlassX.set` to add items to your global state or use the `useStore` hook. No setup, no initializations.

### Based on react context

GlassX is based on context which makes it super fast and allows it to sit right in your app like a part of the react code itself.

### TypeScript support

GlassX is 100% written in TypeScript which gives it amazing support with most editors and allows you to create and extend types on top of it. You no longer need to stick to state management tools with sub-par type support.

### Supports advanced features

Unlike many other state management libraries out there, GlassX supports features like async reducers, hooks, plugins and modules which allow you to scope your state and reducers to particular portions of your app.

## Example Usage

```js
import { useStore } from 'glassx';

export default function Home() {
  const [something, setSomething] = useStore('something');

  setTimeout(() => {
    setSomething('hobies');
  }, 3000);
  ...
```

You can also give shape to your state just as done in React, like this:

```tsx
import { useStore } from 'glassx';

type SomeType = string;

export default function Home() {
  const [something, setSomething] = useStore<SomeType>('something');

  setTimeout(() => {
    setSomething('hobies');
  }, 3000);
  ...
```

## Optional Setup

As mentioned earlier, GlassX requires absolute no setup or boilerplate. You only need to do this if you want extra options, plugins, just want to set a default state for your application or want to scope your state using modules.

To get started with this, you simply need to call the `store` method on the GlassX class.

```ts
const store = GlassX.store({
  // default State
  state: {
    key: 'value'
  },

  // register reducers to call by name
  reducers: {
    reducer_name: (state, payload) => ({
      stateKey: payload,
    }),
  },

  // to use modules
  modules: [layoutModule],

  // compare state to previous state before updating
  compareState: true,

  // glassx plugins
  plugins: [PersistedState],
});
```

## Setting State

## Retrieving State

## Reducers

```ts
const UPDATE_VALUE: Reducer<State, 'increment'|'decrement'> = (state, action) => {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

const changeCount = useReducer(UPDATE_VALUE);

changeCount('increment');
```

Find the documentation for reducers [here](https://github.com/mychidarko/glassx/wiki/Reducers)

## Modules
